-- Run only against a disposable local Supabase database after ALL migrations.
-- Synthetic users/data are rolled back even when assertions succeed.
begin;

create extension if not exists pgtap with schema extensions;
select extensions.no_plan();

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'alice@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'bob@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'unverified@example.test', '', null, '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'pending@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'declined@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000006', 'authenticated', 'authenticated', 'admin@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000007', 'authenticated', 'authenticated', 'editor@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now());

update public.profiles set role = 'admin'
where id = '10000000-0000-4000-8000-000000000006';
update public.profiles set role = 'editor'
where id = '10000000-0000-4000-8000-000000000007';

insert into public.mentorship_applications (
  id, name, email, phone, selected_package, status,
  reason_for_applying, career_goals
) values
  ('20000000-0000-4000-8000-000000000001', 'Alice Applicant', ' ALICE@example.test ', '+234000000001', 'Momentum', 'accepted', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000002', 'Pending Applicant', 'pending@example.test', '+234000000002', 'Foundation', 'reviewing', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000003', 'Declined Applicant', 'declined@example.test', '+234000000003', 'Elevation', 'declined', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000004', 'Unverified Applicant', 'unverified@example.test', '+234000000004', 'Foundation', 'accepted', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000005', 'Old Applicant', 'historical@example.test', '+234000000005', null, 'accepted', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000006', 'Bob Applicant', 'bob@example.test', '+234000000006', 'Elevation', 'accepted', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.');

insert into public.mentorship_claim_invitations (
  application_id, token_hash, expires_at, created_by
) values
  ('20000000-0000-4000-8000-000000000001', encode(digest('alice-invitation', 'sha256'), 'hex'), now() + interval '48 hours', '10000000-0000-4000-8000-000000000006'),
  ('20000000-0000-4000-8000-000000000002', encode(digest('pending-invitation', 'sha256'), 'hex'), now() + interval '48 hours', '10000000-0000-4000-8000-000000000006'),
  ('20000000-0000-4000-8000-000000000003', encode(digest('declined-invitation', 'sha256'), 'hex'), now() + interval '48 hours', '10000000-0000-4000-8000-000000000006'),
  ('20000000-0000-4000-8000-000000000004', encode(digest('unverified-invitation', 'sha256'), 'hex'), now() + interval '48 hours', '10000000-0000-4000-8000-000000000006'),
  ('20000000-0000-4000-8000-000000000006', encode(digest('expired-invitation', 'sha256'), 'hex'), now() - interval '1 minute', '10000000-0000-4000-8000-000000000006');

select extensions.ok(
  not has_function_privilege('authenticated', 'public.claim_my_mentorship_application()', 'EXECUTE'),
  'email-only claiming is revoked'
);
select extensions.ok(
  has_function_privilege('authenticated', 'public.claim_mentorship_with_code(text)', 'EXECUTE'),
  'only the new token RPC is available to signed-in users'
);
select extensions.ok(
  not has_function_privilege('anon', 'public.claim_mentorship_with_code(text)', 'EXECUTE'),
  'anonymous clients cannot invoke invitation claims'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.mentorship_claim_invitations', 'SELECT'),
  'invitation hashes are private even for signed-in users'
);

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', true);

select extensions.is(
  public.claim_mentorship_with_code(encode(digest('alice-invitation', 'sha256'), 'hex')),
  'invalid',
  'another signed-in user cannot steal Alice invitation'
);
select extensions.is(
  public.claim_mentorship_with_code(encode(digest('expired-invitation', 'sha256'), 'hex')),
  'invalid',
  'expired invitation cannot link a user'
);

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000003', true);
select extensions.is(
  public.claim_mentorship_with_code(encode(digest('unverified-invitation', 'sha256'), 'hex')),
  'invalid',
  'unverified account cannot claim its invitation'
);

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000004', true);
select extensions.is(
  public.claim_mentorship_with_code(encode(digest('pending-invitation', 'sha256'), 'hex')),
  'invalid',
  'pending applicant cannot claim'
);

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000005', true);
select extensions.is(
  public.claim_mentorship_with_code(encode(digest('declined-invitation', 'sha256'), 'hex')),
  'invalid',
  'rejected applicant cannot claim'
);

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select extensions.is(
  public.claim_mentorship_with_code(encode(digest('alice-invitation', 'sha256'), 'hex')),
  'claimed',
  'accepted verified user with private token links successfully'
);
select extensions.is(
  public.claim_mentorship_with_code(encode(digest('alice-invitation', 'sha256'), 'hex')),
  'already_claimed',
  'same account retry is idempotent'
);
select extensions.is(
  (select count(*) from public.mentorship_enrolments where user_id = auth.uid()),
  1::bigint,
  'claim creates exactly one enrolment'
);
select extensions.is(
  (select package from public.mentorship_enrolments where user_id = auth.uid()),
  'Momentum',
  'package comes from the reviewed application'
);
select extensions.is(
  (select count(*) from public.mentorship_applications where linked_user_id = auth.uid()),
  1::bigint,
  'mentee can read own linked application'
);
select extensions.is(
  (select count(*) from public.mentorship_claim_invitations),
  0::bigint,
  'no authenticated user can read invitation hashes'
);
select extensions.lives_ok(
  $$update public.mentorship_enrolments set status = 'completed' where user_id = auth.uid()$$,
  'mentee enrolment modification is suppressed by RLS'
);
select extensions.is(
  (select status from public.mentorship_enrolments where user_id = auth.uid()),
  'active',
  'mentee cannot self-certify progress'
);
select extensions.lives_ok(
  $$update public.profiles set role = 'admin' where id = auth.uid()$$,
  'mentee staff privilege change is filtered by RLS'
);
select extensions.is(
  (select role from public.profiles where id = auth.uid()),
  null::text,
  'mentee remains unprivileged'
);

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', true);
select extensions.is(
  (select count(*) from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'),
  0::bigint,
  'Bob cannot read Alice enrolment'
);
select extensions.is(
  public.claim_mentorship_with_code(encode(digest('alice-invitation', 'sha256'), 'hex')),
  'invalid',
  'consumed invitation is not transferable'
);

reset role;
select extensions.is(
  (select linked_user_id from public.mentorship_applications
   where id = '20000000-0000-4000-8000-000000000001'),
  '10000000-0000-4000-8000-000000000001'::uuid,
  'application owner is immutable Supabase Auth UUID'
);
select extensions.ok(
  has_function_privilege('authenticated', 'public.can_manage_articles()', 'EXECUTE'),
  'pre-existing admin/editor role helper remains granted'
);
select extensions.ok(
  not has_table_privilege('authenticated', 'public.mentorship_claim_invitations', 'UPDATE'),
  'even editors cannot update invitation digests through the browser'
);
select * from extensions.finish();
rollback;
