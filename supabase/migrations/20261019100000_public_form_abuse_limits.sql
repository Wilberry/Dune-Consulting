-- Invisible, cross-instance abuse protection for the four public forms.
-- No raw IPs or email addresses are stored: the application sends keyed hashes.
-- Deploy BEFORE enabling the Cloudflare-free form handlers.
create table public.public_form_abuse_buckets (
  scope text not null,
  subject_hash text not null
    constraint public_form_abuse_hash_check check (subject_hash ~ '^[a-f0-9]{64}$'),
  window_start timestamptz not null,
  expires_at timestamptz not null,
  request_count integer not null
    constraint public_form_abuse_count_check check (request_count > 0),
  primary key (scope, subject_hash, window_start)
);

create index public_form_abuse_expiry_idx
  on public.public_form_abuse_buckets(expires_at);

alter table public.public_form_abuse_buckets enable row level security;
revoke all on table public.public_form_abuse_buckets
  from public, anon, authenticated;
grant select, insert, update, delete
  on public.public_form_abuse_buckets to service_role;

-- One atomic reservation for IP + email: two deterministic advisory locks
-- serialize concurrent requests across all Vercel instances. Rejected calls
-- never consume either quota. Uses fixed UTC buckets for simple bounded state.
create or replace function public.reserve_public_form_attempt(
  p_action text, p_ip_hash text, p_email_hash text
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  ip_scope text;
  email_scope text;
  ip_window timestamptz;
  email_window timestamptz;
  ip_limit integer;
  email_limit integer;
  ip_used integer;
  email_used integer;
  lock_key text;
begin
  if p_action is null or p_action not in ('mentorship', 'contact', 'quote', 'newsletter')
    or p_ip_hash is null or p_email_hash is null
    or p_ip_hash !~ '^[a-f0-9]{64}$'
    or p_email_hash !~ '^[a-f0-9]{64}$' then
    return false;
  end if;

  -- Keep thresholds moderate for shared offices and mobile networks.
  ip_limit := case p_action
    when 'newsletter' then 20
    when 'contact' then 12
    else 8 end;
  email_limit := case p_action
    when 'newsletter' then 4
    else 5 end;

  ip_scope := p_action || ':ip';
  email_scope := p_action || ':email';
  ip_window := pg_catalog.to_timestamp(
    floor(extract(epoch from pg_catalog.clock_timestamp()) / 900) * 900
  );
  email_window := pg_catalog.to_timestamp(
    floor(extract(epoch from pg_catalog.clock_timestamp()) / 86400) * 86400
  );

  -- Acquire locks in the same order in every transaction; avoid deadlocks.
  for lock_key in
    select unnest(array[
      ip_scope || ':' || p_ip_hash || ':' || ip_window::text,
      email_scope || ':' || p_email_hash || ':' || email_window::text
    ]) order by 1
  loop
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended(lock_key, 0)
    );
  end loop;

  select coalesce((
    select request_count from public.public_form_abuse_buckets
    where scope = ip_scope
      and subject_hash = p_ip_hash
      and window_start = ip_window
  ), 0) into ip_used;

  select coalesce((
    select request_count from public.public_form_abuse_buckets
    where scope = email_scope
      and subject_hash = p_email_hash
      and window_start = email_window
  ), 0) into email_used;

  if ip_used >= ip_limit or email_used >= email_limit then
    return false;
  end if;

  insert into public.public_form_abuse_buckets
    (scope, subject_hash, window_start, expires_at, request_count)
  values
    (ip_scope, p_ip_hash, ip_window, ip_window + interval '15 minutes', 1),
    (email_scope, p_email_hash, email_window, email_window + interval '1 day', 1)
  on conflict (scope, subject_hash, window_start)
  do update set request_count = public.public_form_abuse_buckets.request_count + 1;

  -- Probabilistic, bounded pruning: no scheduled job or external service.
  if pg_catalog.random() < 0.01 then
    delete from public.public_form_abuse_buckets as bucket
    where (bucket.scope, bucket.subject_hash, bucket.window_start) in (
      select scope, subject_hash, window_start
      from public.public_form_abuse_buckets
      where expires_at < pg_catalog.clock_timestamp()
      order by expires_at
      limit 200
    );
  end if;

  return true;
end;
$$;

revoke all on function public.reserve_public_form_attempt(text, text, text)
  from public, anon, authenticated;
grant execute on function public.reserve_public_form_attempt(text, text, text)
  to service_role;
