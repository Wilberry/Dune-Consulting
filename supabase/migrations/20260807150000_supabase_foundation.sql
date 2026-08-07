-- Dune Consulting Phase One: Supabase foundation
-- Creates the admin/content data model, secure RLS policies, profile bootstrap,
-- quote references, and the private Insights storage bucket.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (role is null or role in ('admin', 'editor'))
);

create index profiles_role_idx on public.profiles(role);

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text not null default '',
  cover_image_url text,
  category text,
  author_name text,
  status text not null default 'draft',
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_status_check check (status in ('draft', 'published')),
  constraint articles_slug_not_blank check (length(trim(slug)) > 0),
  constraint articles_title_not_blank check (length(trim(title)) > 0)
);

create index articles_status_idx on public.articles(status);
create index articles_category_idx on public.articles(category);
create index articles_published_at_idx on public.articles(published_at desc);

create table public.contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  organisation text,
  service text not null,
  project_date date,
  location text,
  message text not null,
  status text not null default 'new',
  origin_page text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_enquiries_status_check check (status in ('new', 'read', 'replied', 'closed'))
);

create index contact_enquiries_status_idx on public.contact_enquiries(status);
create index contact_enquiries_created_at_idx on public.contact_enquiries(created_at desc);

create sequence public.quote_reference_seq start with 1 increment by 1 no minvalue no maxvalue cache 1;

create or replace function public.next_quote_reference()
returns text
language sql
volatile
security definer
set search_path = public
as $$
  select 'DUNE-Q-' || lpad(nextval('public.quote_reference_seq')::text, 6, '0');
$$;

revoke all on function public.next_quote_reference() from public;
grant execute on function public.next_quote_reference() to authenticated, service_role;

create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference_number text not null unique default public.next_quote_reference(),
  name text not null,
  company text,
  email text not null,
  phone text not null,
  service text not null,
  location text,
  expected_start_date date,
  participant_count integer,
  project_description text not null,
  additional_requirements text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quote_requests_status_check check (status in ('new', 'reviewing', 'contacted', 'converted', 'closed')),
  constraint quote_requests_participant_count_check check (participant_count is null or participant_count >= 0)
);

create index quote_requests_status_idx on public.quote_requests(status);
create index quote_requests_created_at_idx on public.quote_requests(created_at desc);
create index quote_requests_service_idx on public.quote_requests(service);

create table public.mentorship_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  current_role text,
  experience_level text,
  education text,
  reason_for_applying text,
  career_goals text,
  additional_information text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint mentorship_applications_status_check check (status in ('new', 'reviewing', 'accepted', 'declined'))
);

create index mentorship_applications_status_idx on public.mentorship_applications(status);
create index mentorship_applications_created_at_idx on public.mentorship_applications(created_at desc);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  status text not null default 'subscribed',
  external_contact_id text,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_subscribers_status_check check (status in ('subscribed', 'unsubscribed'))
);

create index newsletter_subscribers_status_idx on public.newsletter_subscribers(status);
create index newsletter_subscribers_created_at_idx on public.newsletter_subscribers(created_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger articles_set_updated_at
before update on public.articles
for each row execute function public.set_updated_at();

create trigger contact_enquiries_set_updated_at
before update on public.contact_enquiries
for each row execute function public.set_updated_at();

create trigger quote_requests_set_updated_at
before update on public.quote_requests
for each row execute function public.set_updated_at();

create trigger mentorship_applications_set_updated_at
before update on public.mentorship_applications
for each row execute function public.set_updated_at();

create trigger newsletter_subscribers_set_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

-- The role remains NULL until an approved operator explicitly promotes the user.
-- This prevents newly created Auth users from receiving admin/editor privileges.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    null
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Backfill profiles when this migration is applied to a project that already
-- has Auth users. Existing users remain unauthorized until explicitly promoted.
insert into public.profiles (id, email, full_name, role)
select
  id,
  coalesce(email, ''),
  nullif(trim(coalesce(raw_user_meta_data ->> 'full_name', '')), ''),
  null
from auth.users
on conflict (id) do nothing;

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

revoke all on function public.current_user_role() from public;
grant execute on function public.current_user_role() to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() = 'admin', false);
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create or replace function public.can_manage_articles()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin', 'editor'), false);
$$;

revoke all on function public.can_manage_articles() from public;
grant execute on function public.can_manage_articles() to authenticated;

create or replace function public.update_my_profile_name(new_full_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.can_manage_articles() then
    raise exception 'Not authorized';
  end if;

  if new_full_name is null or char_length(trim(new_full_name)) < 2 or char_length(trim(new_full_name)) > 120 then
    raise exception 'Invalid full name';
  end if;

  update public.profiles
  set full_name = trim(new_full_name)
  where id = auth.uid();
end;
$$;

revoke all on function public.update_my_profile_name(text) from public;
grant execute on function public.update_my_profile_name(text) to authenticated;

alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.contact_enquiries enable row level security;
alter table public.quote_requests enable row level security;
alter table public.mentorship_applications enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "Users can read their own profile"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "Admins can read all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

create policy "Admins can insert profiles"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

create policy "Admins can update profiles"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete profiles"
on public.profiles
for delete
to authenticated
using (public.is_admin() and id <> auth.uid());

create policy "Published articles are publicly readable"
on public.articles
for select
to anon, authenticated
using (status = 'published' or public.can_manage_articles());

create policy "Authorized staff can create articles"
on public.articles
for insert
to authenticated
with check (public.can_manage_articles());

create policy "Authorized staff can update articles"
on public.articles
for update
to authenticated
using (public.can_manage_articles())
with check (public.can_manage_articles());

create policy "Authorized staff can delete articles"
on public.articles
for delete
to authenticated
using (public.can_manage_articles());

create policy "Admins manage contact enquiries"
on public.contact_enquiries
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage quote requests"
on public.quote_requests
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage mentorship applications"
on public.mentorship_applications
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins manage newsletter subscribers"
on public.newsletter_subscribers
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Phase One keeps the Insights bucket private. Phase Three can introduce a
-- deliberate public-delivery strategy for published article media.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'insights',
  'insights',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Authorized staff can read Insights media"
on storage.objects
for select
to authenticated
using (bucket_id = 'insights' and public.can_manage_articles());

create policy "Authorized staff can upload Insights media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'insights' and public.can_manage_articles());

create policy "Authorized staff can update Insights media"
on storage.objects
for update
to authenticated
using (bucket_id = 'insights' and public.can_manage_articles())
with check (bucket_id = 'insights' and public.can_manage_articles());

create policy "Authorized staff can delete Insights media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'insights' and public.can_manage_articles());
