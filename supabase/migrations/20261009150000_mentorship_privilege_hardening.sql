revoke all on table public.mentorship_applications from anon;
revoke all on table public.mentorship_applications from authenticated;
grant select on table public.mentorship_applications to authenticated;
grant update (status) on table public.mentorship_applications to authenticated;

revoke all on table public.mentorship_enrolments from anon;
revoke all on table public.mentorship_enrolments from authenticated;
grant select, insert, update, delete
on table public.mentorship_enrolments to authenticated;

create unique index if not exists mentorship_applications_id_linked_user_unique
on public.mentorship_applications (id, linked_user_id);

alter table public.mentorship_enrolments
  drop constraint mentorship_enrolments_package_check,
  add constraint mentorship_enrolments_package_check
    check (
      package is null
      or package in ('Foundation', 'Momentum', 'Elevation')
    );

alter table public.mentorship_enrolments
  add constraint mentorship_enrolments_application_owner_fkey
  foreign key (application_id, user_id)
  references public.mentorship_applications (id, linked_user_id)
  on delete restrict;

create or replace function public.prevent_linked_application_reassignment()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if old.linked_user_id is not null
    and new.linked_user_id is distinct from old.linked_user_id then
    raise exception using
      errcode = '23514',
      message = 'Linked application ownership is immutable.';
  end if;

  if old.linked_user_id is not null
    and new.selected_package is distinct from old.selected_package then
    raise exception using
      errcode = '23514',
      message = 'Linked application package is immutable.';
  end if;

  return new;
end;
$$;

revoke all on function public.prevent_linked_application_reassignment() from public;

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
