-- Additive, data-preserving package persistence for new mentorship applications.
-- Historical applications remain NULL; never infer their packages from email.
alter table public.mentorship_applications
  add column if not exists selected_package text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'mentorship_applications_selected_package_check'
      and conrelid = 'public.mentorship_applications'::regclass
  ) then
    alter table public.mentorship_applications
      add constraint mentorship_applications_selected_package_check
      check (
        selected_package is null
        or selected_package in ('Foundation', 'Momentum', 'Elevation')
      );
  end if;
end;
$$;
