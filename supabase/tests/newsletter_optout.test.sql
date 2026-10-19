-- Local-only pgTAP verification. Run in a disposable Supabase stack.
begin;
create extension if not exists pgtap with schema extensions;
select extensions.no_plan();

insert into public.newsletter_subscribers (id, email, status, unsubscribed_at)
values (
  '30000000-0000-4000-8000-000000000001',
  'opted-out-audit@example.test',
  'unsubscribed',
  now()
);

select extensions.ok(
  has_table_privilege('service_role', 'public.newsletter_subscribers', 'UPDATE'),
  'provider backend may still update provider metadata'
);

set local role service_role;
select extensions.throws_ok(
  $$update public.newsletter_subscribers
      set status='subscribed', unsubscribed_at=null
      where email='opted-out-audit@example.test'$$,
  '23514',
  'Previously unsubscribed contacts require verified staff approval.',
  'privileged webhooks cannot silently reinstate an opted-out address'
);
reset role;

select extensions.is(
  (select status from public.newsletter_subscribers
    where email='opted-out-audit@example.test'),
  'unsubscribed',
  'failed stale webhook does not erase withdrawal of consent'
);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values (
  '30000000-0000-4000-8000-000000000002',
  'authenticated','authenticated','consent-admin@example.test','',now(),
  '{}'::jsonb, '{}'::jsonb, now(), now()
);

update public.profiles set role='admin'
where id='30000000-0000-4000-8000-000000000002';

set local role authenticated;
select set_config('request.jwt.claim.sub','30000000-0000-4000-8000-000000000002',true);
select extensions.lives_ok(
  $$update public.newsletter_subscribers
      set status='subscribed', unsubscribed_at=null,
          subscribed_at=now()
      where email='opted-out-audit@example.test'$$,
  'authorized staff may manually record verified consent'
);
select extensions.is(
  (select status from public.newsletter_subscribers
    where email='opted-out-audit@example.test'),
  'subscribed',
  'explicit authorized renewal is persisted'
);

select * from extensions.finish();
rollback;
