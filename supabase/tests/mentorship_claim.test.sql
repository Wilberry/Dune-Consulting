begin;

create extension if not exists pgtap with schema extensions;
select extensions.plan(45);

insert into auth.users (
  id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('10000000-0000-4000-8000-000000000001', 'authenticated', 'authenticated', 'alice@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000002', 'authenticated', 'authenticated', 'bob@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000003', 'authenticated', 'authenticated', 'unverified@example.test', '', null, '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000004', 'authenticated', 'authenticated', 'pending@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000005', 'authenticated', 'authenticated', 'rejected@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000006', 'authenticated', 'authenticated', 'ambiguous@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000007', 'authenticated', 'authenticated', 'admin@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now()),
  ('10000000-0000-4000-8000-000000000008', 'authenticated', 'authenticated', 'historical@example.test', '', now(), '{}'::jsonb, '{}'::jsonb, now(), now());

update public.profiles
set role = 'admin'
where id = '10000000-0000-4000-8000-000000000007';

insert into public.mentorship_applications (
  id, name, email, phone, selected_package, status, reason_for_applying, career_goals
) values
  ('20000000-0000-4000-8000-000000000001', 'Alice Applicant', ' Alice@Example.Test ', '+234000000001', 'Momentum', 'accepted', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000002', 'Pending Applicant', 'pending@example.test', '+234000000002', 'Foundation', 'reviewing', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000003', 'Rejected Applicant', 'rejected@example.test', '+234000000003', 'Elevation', 'declined', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000004', 'Ambiguous Applicant One', 'ambiguous@example.test', '+234000000004', 'Foundation', 'accepted', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000005', 'Ambiguous Applicant Two', 'ambiguous@example.test', '+234000000005', 'Elevation', 'accepted', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000006', 'Admin Review Applicant', 'admin-review@example.test', '+234000000006', 'Foundation', 'new', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.'),
  ('20000000-0000-4000-8000-000000000007', 'Historical Applicant', 'historical@example.test', '+234000000007', null, 'accepted', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.');

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000001', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}', true);

select extensions.is(public.claim_my_mentorship_application(), 'claimed', 'verified accepted applicant claims an application');
select extensions.is((select linked_user_id from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000001'), '10000000-0000-4000-8000-000000000001'::uuid, 'claim stores the immutable Auth user id');
select extensions.is((select package from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'), 'Momentum', 'enrolment preserves the selected package');
select extensions.is((select status from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'), 'active', 'accepted application creates an active enrolment atomically');
select extensions.is(public.claim_my_mentorship_application(), 'already_claimed', 'retry is idempotent');
select extensions.is((select count(*) from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'), 1::bigint, 'retry does not create duplicate enrolment');
reset role;
insert into public.mentorship_applications (id, name, email, phone, selected_package, status, reason_for_applying, career_goals)
values ('20000000-0000-4000-8000-000000000008', 'Alice Second Application', 'alice@example.test', '+234000000008', 'Elevation', 'accepted', 'A sufficiently detailed reason for this test application.', 'A sufficiently detailed career goal for this test application.');
set local role authenticated;
select extensions.is(public.claim_my_mentorship_application(), 'already_claimed', 'user cannot claim a second application');
reset role;
select extensions.is((select count(*) from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000008' and linked_user_id is null), 1::bigint, 'second application remains unlinked');
set local role authenticated;
select extensions.is((select count(*) from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000001' and selected_package is null), 0::bigint, 'package remains sourced from the application');
select extensions.is((select count(*) from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000001'), 1::bigint, 'mentee can read their linked application');
select extensions.is((select count(*) from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'), 1::bigint, 'mentee can read their own enrolment');
select extensions.lives_ok($$update public.mentorship_applications set status = 'declined' where id = '20000000-0000-4000-8000-000000000001'$$, 'mentee approval update is rejected without an error');
select extensions.is((select status from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000001'), 'accepted', 'mentee cannot change application approval status');
select extensions.throws_ok($$update public.mentorship_applications set selected_package = 'Elevation' where id = '20000000-0000-4000-8000-000000000001'$$, '42501', 'permission denied for table mentorship_applications', 'mentee package update is denied');
select extensions.is((select selected_package from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000001'), 'Momentum', 'mentee cannot change application package');
select extensions.throws_ok($$update public.mentorship_applications set email = 'attacker@example.test' where id = '20000000-0000-4000-8000-000000000001'$$, '42501', 'permission denied for table mentorship_applications', 'mentee email update is denied');
select extensions.is((select email from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000001'), ' Alice@Example.Test ', 'mentee cannot change application email');
select extensions.throws_ok($$update public.mentorship_applications set linked_user_id = '10000000-0000-4000-8000-000000000002' where id = '20000000-0000-4000-8000-000000000001'$$, '42501', 'permission denied for table mentorship_applications', 'mentee ownership update is denied');
select extensions.is((select linked_user_id from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000001'), '10000000-0000-4000-8000-000000000001'::uuid, 'mentee cannot reassign application ownership');
select extensions.lives_ok($$update public.profiles set role = 'admin' where id = '10000000-0000-4000-8000-000000000001'$$, 'mentee role update is rejected without an error');
select extensions.is((select role from public.profiles where id = '10000000-0000-4000-8000-000000000001'), null::text, 'mentee cannot change their staff role');
select extensions.lives_ok($$update public.mentorship_enrolments set package = 'Elevation' where user_id = '10000000-0000-4000-8000-000000000001'$$, 'mentee enrolment package update is rejected without an error');
select extensions.is((select package from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'), 'Momentum', 'mentee cannot change enrolment package');
select extensions.lives_ok($$update public.mentorship_enrolments set status = 'completed' where user_id = '10000000-0000-4000-8000-000000000001'$$, 'mentee enrolment status update is rejected without an error');
select extensions.is((select status from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'), 'active', 'mentee cannot change enrolment status');
select extensions.throws_ok($$delete from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000001'$$, '42501', 'permission denied for table mentorship_applications', 'mentee cannot delete applications');
select extensions.throws_ok($$insert into public.mentorship_enrolments (application_id,user_id,package,status) values ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Momentum','active')$$, '42501', 'new row violates row-level security policy for table "mentorship_enrolments"', 'mentee cannot insert enrolments directly');
select extensions.lives_ok($$delete from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'$$, 'mentee enrolment delete is filtered by RLS');
select extensions.is((select count(*) from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'), 1::bigint, 'mentee cannot delete their enrolment');

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000002', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}', true);
select extensions.is(public.claim_my_mentorship_application(), 'unavailable', 'user cannot claim another users application');
select extensions.is((select count(*) from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000001'), 0::bigint, 'mentee cannot read another users application');
select extensions.is((select count(*) from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000001'), 0::bigint, 'mentee cannot read another users enrolment');

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000003', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000003","role":"authenticated"}', true);
select extensions.is(public.claim_my_mentorship_application(), 'email_unverified', 'unverified user cannot claim');

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000004', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000004","role":"authenticated"}', true);
select extensions.is(public.claim_my_mentorship_application(), 'unavailable', 'pending application cannot be claimed');

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000005', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000005","role":"authenticated"}', true);
select extensions.is(public.claim_my_mentorship_application(), 'unavailable', 'rejected application cannot be claimed');

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000006', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000006","role":"authenticated"}', true);
select extensions.is(public.claim_my_mentorship_application(), 'ambiguous', 'multiple accepted applications do not create an arbitrary claim');
select extensions.is((select count(*) from public.mentorship_applications where email = 'ambiguous@example.test' and linked_user_id is not null), 0::bigint, 'ambiguous applications remain unlinked');

select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000008', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000008","role":"authenticated"}', true);
select extensions.is(public.claim_my_mentorship_application(), 'claimed', 'historical null-package application remains claimable');
select extensions.is((select package from public.mentorship_enrolments where user_id = '10000000-0000-4000-8000-000000000008'), null::text, 'historical null package remains null in enrolment');

reset role;
select set_config('request.jwt.claim.sub', '10000000-0000-4000-8000-000000000007', true);
select set_config('request.jwt.claims', '{"sub":"10000000-0000-4000-8000-000000000007","role":"authenticated"}', true);
set local role authenticated;
select extensions.lives_ok($$update public.mentorship_applications set status = 'accepted' where id = '20000000-0000-4000-8000-000000000006'$$, 'admin retains application review permissions');
select extensions.is((select status from public.mentorship_applications where id = '20000000-0000-4000-8000-000000000006'), 'accepted', 'admin application review change is persisted');
select extensions.ok(not pg_catalog.has_function_privilege('anon', 'public.claim_my_mentorship_application()', 'EXECUTE'), 'anonymous users cannot execute the claim function');
select extensions.ok(not pg_catalog.has_table_privilege('anon', 'public.mentorship_applications', 'SELECT'), 'anonymous role cannot read applicant records');
select extensions.ok(pg_catalog.has_column_privilege('authenticated', 'public.mentorship_applications', 'status', 'UPDATE'), 'authenticated staff can update application status');
select extensions.ok(not pg_catalog.has_column_privilege('authenticated', 'public.mentorship_applications', 'selected_package', 'UPDATE'), 'authenticated clients cannot update package columns');

select * from extensions.finish();
rollback;
