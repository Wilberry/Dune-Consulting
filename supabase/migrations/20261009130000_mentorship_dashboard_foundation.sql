alter table public.mentorship_applications
  add column if not exists linked_user_id uuid references auth.users(id),
  add column if not exists linked_at timestamptz;

create unique index if not exists mentorship_applications_linked_user_id_unique
on public.mentorship_applications (linked_user_id)
where linked_user_id is not null;

create table if not exists public.mentorship_enrolments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.mentorship_applications(id) on delete restrict,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  package text not null default 'Foundation',
  status text not null default 'pending',
  cohort_name text,
  cohort_start_date timestamptz,
  cohort_end_date timestamptz,
  enrolled_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mentorship_enrolments_package_check check (package in ('Foundation', 'Momentum', 'Elevation')),
  constraint mentorship_enrolments_status_check check (status in ('pending', 'active', 'paused', 'completed', 'withdrawn'))
);

create index if not exists mentorship_enrolments_user_id_idx
on public.mentorship_enrolments(user_id);

create index if not exists mentorship_enrolments_status_idx
on public.mentorship_enrolments(status);

create trigger mentorship_enrolments_set_updated_at
before update on public.mentorship_enrolments
for each row execute function public.set_updated_at();

alter table public.mentorship_enrolments enable row level security;

create policy "Users can read their own enrolment"
on public.mentorship_enrolments
for select
to authenticated
using (user_id = auth.uid());

create policy "Admins manage enrolments"
on public.mentorship_enrolments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Users can read their own linked application"
on public.mentorship_applications
for select
to authenticated
using (linked_user_id = auth.uid() or public.is_admin());
