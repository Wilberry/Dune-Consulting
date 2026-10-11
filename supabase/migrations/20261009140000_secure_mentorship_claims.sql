alter table public.mentorship_enrolments
  alter column package drop default,
  alter column package drop not null;

revoke all on table public.mentorship_applications from anon;
revoke all on table public.mentorship_enrolments from anon;
revoke insert, update, delete on table public.profiles from anon;

create index if not exists mentorship_applications_claim_lookup_idx
on public.mentorship_applications (lower(btrim(email)))
where status = 'accepted' and linked_user_id is null;

create or replace function public.enforce_mentorship_enrolment_source()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
declare
  source_package text;
begin
  select application.selected_package
  into source_package
  from public.mentorship_applications as application
  where application.id = new.application_id
    and application.linked_user_id = new.user_id
    and application.status = 'accepted';

  if not found or new.package is distinct from source_package then
    raise exception using
      errcode = '23514',
      message = 'Enrolment must match its accepted linked application.';
  end if;

  return new;
end;
$$;

revoke all on function public.enforce_mentorship_enrolment_source() from public;

create trigger mentorship_enrolments_source_check
before insert or update of application_id, user_id, package
on public.mentorship_enrolments
for each row execute function public.enforce_mentorship_enrolment_source();

create or replace function public.prevent_linked_application_reassignment()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if exists (
    select 1
    from public.mentorship_enrolments as enrolment
    where enrolment.application_id = old.id
  ) and (
    new.linked_user_id is distinct from old.linked_user_id
    or new.selected_package is distinct from old.selected_package
  ) then
    raise exception using
      errcode = '23514',
      message = 'Linked application ownership and package are immutable.';
  end if;

  return new;
end;
$$;

revoke all on function public.prevent_linked_application_reassignment() from public;

create trigger mentorship_applications_linked_fields_immutable
before update of linked_user_id, selected_package
on public.mentorship_applications
for each row execute function public.prevent_linked_application_reassignment();

create or replace function public.claim_my_mentorship_application()
returns text
language plpgsql
security definer
set search_path = pg_catalog, public, auth
as $$
declare
  caller_id uuid := auth.uid();
  caller_email text;
  email_verified boolean;
  matching_applications integer;
  application public.mentorship_applications%rowtype;
  existing_application public.mentorship_applications%rowtype;
  existing_enrolment public.mentorship_enrolments%rowtype;
begin
  if caller_id is null then
    return 'unauthenticated';
  end if;

  select lower(btrim(account.email)), account.email_confirmed_at is not null
  into caller_email, email_verified
  from auth.users as account
  where account.id = caller_id;

  if caller_email is null or not coalesce(email_verified, false) then
    return 'email_unverified';
  end if;

  select *
  into existing_application
  from public.mentorship_applications as candidate
  where candidate.linked_user_id = caller_id
  for update;

  if found then
    select *
    into existing_enrolment
    from public.mentorship_enrolments as enrolment
    where enrolment.user_id = caller_id
    for update;

    if found
      and existing_enrolment.application_id = existing_application.id
      and existing_enrolment.package is not distinct from existing_application.selected_package
      and existing_application.status = 'accepted'
      and lower(btrim(existing_application.email)) = caller_email then
      return 'already_claimed';
    end if;

    return 'inconsistent';
  end if;

  select *
  into existing_enrolment
  from public.mentorship_enrolments as enrolment
  where enrolment.user_id = caller_id
  for update;

  if found then
    return 'already_enrolled';
  end if;

  select count(*)
  into matching_applications
  from public.mentorship_applications as candidate
  where lower(btrim(candidate.email)) = caller_email
    and candidate.status = 'accepted'
    and candidate.linked_user_id is null;

  if matching_applications = 0 then
    return 'unavailable';
  end if;

  if matching_applications > 1 then
    return 'ambiguous';
  end if;

  select *
  into application
  from public.mentorship_applications as candidate
  where lower(btrim(candidate.email)) = caller_email
    and candidate.status = 'accepted'
    and candidate.linked_user_id is null
  for update;

  if not found then
    return 'unavailable';
  end if;

  update public.mentorship_applications as candidate
  set linked_user_id = caller_id,
      linked_at = pg_catalog.now()
  where candidate.id = application.id
    and candidate.status = 'accepted'
    and candidate.linked_user_id is null
  returning candidate.* into application;

  if not found then
    return 'unavailable';
  end if;

  insert into public.mentorship_enrolments (
    application_id,
    user_id,
    package,
    status
  ) values (
    application.id,
    caller_id,
    application.selected_package,
    'active'
  );

  return 'claimed';
end;
$$;

alter function public.claim_my_mentorship_application() owner to postgres;
revoke all on function public.claim_my_mentorship_application() from public;
revoke all on function public.claim_my_mentorship_application() from anon;
revoke all on function public.claim_my_mentorship_application() from service_role;
grant execute on function public.claim_my_mentorship_application() to authenticated;
