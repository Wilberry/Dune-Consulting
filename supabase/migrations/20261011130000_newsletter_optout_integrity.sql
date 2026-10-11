-- Consent is a database invariant, not a best-effort application check.
-- Protect against delayed/concurrent provider webhooks overwriting an opt-out.
-- A signed-in administrator may record an explicitly verified opt-in; anonymous
-- and service-role/webhook writes cannot silently reinstate a subscriber.
create or replace function public.enforce_newsletter_optout()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if old.status = 'unsubscribed' and new.status = 'subscribed' then
    if auth.uid() is null or not public.is_admin() then
      raise exception using
        errcode = '23514',
        message = 'Previously unsubscribed contacts require verified staff approval.';
    end if;
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_newsletter_optout()
  from public, anon, authenticated, service_role;

create trigger newsletter_subscribers_optout_guard
before update of status on public.newsletter_subscribers
for each row execute function public.enforce_newsletter_optout();
