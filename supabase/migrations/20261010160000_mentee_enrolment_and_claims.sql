-- Mentee enrolments link immutable Auth IDs to reviewed applications.
-- Claims are opaque one-use invitation codes. Only a SHA-256 digest is stored.
-- No application status or package values are duplicated in enrolments.

create table public.mentorship_enrolments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.mentorship_applications(id) on delete restrict,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  cohort_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mentorship_enrolments_cohort_name_check check (
    cohort_name is null or char_length(btrim(cohort_name)) between 2 and 120
  )
);

create index mentorship_enrolments_user_idx
  on public.mentorship_enrolments(user_id);

create trigger mentorship_enrolments_set_updated_at
before update on public.mentorship_enrolments
for each row execute function public.set_updated_at();

create table public.mentorship_claims (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.mentorship_applications(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  claimed_at timestamptz,
  claimed_by uuid references auth.users(id) on delete set null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  constraint mentorship_claims_token_hash_check check (token_hash ~ '^[a-f0-9]{64}$'),
  constraint mentorship_claims_claimed_pair_check check (
    (claimed_at is null and claimed_by is null)
    or (claimed_at is not null and claimed_by is not null)
  )
);

create index mentorship_claims_expires_idx
  on public.mentorship_claims(expires_at);

alter table public.mentorship_enrolments enable row level security;
alter table public.mentorship_claims enable row level security;

create policy "Mentees read their own enrolment"
on public.mentorship_enrolments
for select to authenticated
using (user_id = (select auth.uid()));

create policy "Admins manage mentee enrolments"
on public.mentorship_enrolments
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Applications retain their existing admin-only write rules.
-- Only linked account owners can additionally read their own original application.
create policy "Linked mentees read their own application"
on public.mentorship_applications
for select to authenticated
using (
  exists (
    select 1 from public.mentorship_enrolments e
    where e.application_id = mentorship_applications.id
      and e.user_id = (select auth.uid())
  )
);

-- Claims have NO browser-readable policies. Only the server-side service role
-- can issue/revoke them, while the SECURITY DEFINER function can redeem them.
revoke all on public.mentorship_claims from anon, authenticated;
revoke insert, update, delete on public.mentorship_enrolments from anon, authenticated;
grant select on public.mentorship_enrolments to authenticated;

create or replace function public.claim_mentorship_enrolment(p_token_hash text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid;
  v_email text;
  v_claim record;
  v_enrolment_id uuid;
  v_enrolment_owner uuid;
begin
  v_uid := auth.uid();
  if v_uid is null or p_token_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid invitation or account';
  end if;

  select lower(btrim(email)) into v_email
  from auth.users
  where id = v_uid and email_confirmed_at is not null;

  if v_email is null or v_email = '' then
    raise exception 'Invalid invitation or account';
  end if;

  select c.id, c.application_id, c.expires_at, c.claimed_at,
         c.claimed_by, a.email, a.status
  into v_claim
  from public.mentorship_claims c
  join public.mentorship_applications a on a.id = c.application_id
  where c.token_hash = p_token_hash
  for update of c;

  if not found
     or lower(btrim(v_claim.email)) <> v_email
     or v_claim.status <> 'accepted'
     or (v_claim.claimed_at is not null and v_claim.claimed_by is distinct from v_uid)
     or (v_claim.claimed_at is null and v_claim.expires_at <= now()) then
    raise exception 'Invalid invitation or account';
  end if;

  select e.id, e.user_id into v_enrolment_id, v_enrolment_owner
  from public.mentorship_enrolments e
  where e.application_id = v_claim.application_id
  for update;

  if v_enrolment_id is not null and v_enrolment_owner <> v_uid then
    raise exception 'Invalid invitation or account';
  end if;

  if v_enrolment_id is null then
    -- Unique constraints protect against a second application on this account
    -- and concurrent attempts linking one application to two accounts.
    insert into public.mentorship_enrolments (application_id, user_id)
    values (v_claim.application_id, v_uid)
    returning id into v_enrolment_id;
  end if;

  update public.mentorship_claims
  set claimed_at = coalesce(claimed_at, now()), claimed_by = v_uid
  where id = v_claim.id;

  return v_enrolment_id;
exception
  when unique_violation then
    raise exception 'Invalid invitation or account';
end;
$$;

revoke all on function public.claim_mentorship_enrolment(text) from public;
grant execute on function public.claim_mentorship_enrolment(text) to authenticated;

-- Profile updates for mentees cannot change email, package, role, or ownership.
create or replace function public.update_my_mentee_name(new_full_name text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null
     or not exists (
       select 1 from public.mentorship_enrolments
       where user_id = auth.uid()
     )
     or new_full_name is null
     or char_length(btrim(new_full_name)) not between 2 and 120 then
    raise exception 'Invalid profile update';
  end if;

  update public.profiles
  set full_name = btrim(new_full_name)
  where id = auth.uid();
end;
$$;

revoke all on function public.update_my_mentee_name(text) from public;
grant execute on function public.update_my_mentee_name(text) to authenticated;
