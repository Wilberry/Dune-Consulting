alter table public.mentorship_applications
  add column if not exists selected_package text;

alter table public.mentorship_applications
  add constraint mentorship_applications_selected_package_check
  check (
    selected_package is null
    or selected_package in ('Foundation', 'Momentum', 'Elevation')
  );
