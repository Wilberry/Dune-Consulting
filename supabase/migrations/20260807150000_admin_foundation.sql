create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_temp
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
  role text check (role is null or role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
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
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'closed')),
  origin_page text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index contact_enquiries_status_idx on public.contact_enquiries(status);
create index contact_enquiries_created_at_idx on public.contact_enquiries(created_at desc);

create sequence public.quote_reference_seq start 1;
create or replace function public.next_quote_reference()
returns text
language sql
volatile
set search_path = public, pg_temp
as $$
  select 'DUNE-Q-' || lpad(nextval('public.quote_reference_seq')::text, 6, '0');
$$;

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
  participant_count integer check (participant_count is null or participant_count >= 0),
  project_description text not null,
  additional_requirements text,
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'converted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index quote_requests_status_idx on public.quote_requests(status);
create index quote_requests_created_at_idx on public.quote_requests(created_at desc);

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
  status text not null default 'new' check (status in ('new', 'reviewing', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index mentorship_applications_status_idx on public.mentorship_applications(status);
create index mentorship_applications_created_at_idx on public.mentorship_applications(created_at desc);

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  status text not null default 'subscribed' check (status in ('subscribed', 'unsubscribed')),
  external_contact_id text,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index newsletter_subscribers_status_idx on public.newsletter_subscribers(status);

create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger articles_updated_at before update on public.articles for each row execute function public.set_updated_at();
create trigger contact_enquiries_updated_at before update on public.contact_enquiries for each row execute function public.set_updated_at();
create trigger quote_requests_updated_at before update on public.quote_requests for each row execute function public.set_updated_at();
create trigger mentorship_applications_updated_at before update on public.mentorship_applications for each row execute function public.set_updated_at();
create trigger newsletter_subscribers_updated_at before update on public.newsletter_subscribers for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, coalesce(new.email, ''), nullif(new.raw_user_meta_data ->> 'full_name', ''), null)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.current_staff_role()
returns text
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select role from public.profiles where id = auth.uid();
$$;
revoke all on function public.current_staff_role() from public;
grant execute on function public.current_staff_role() to authenticated;

create or replace function public.update_my_profile_name(p_full_name text)
returns public.profiles
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  updated_profile public.profiles;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if public.current_staff_role() not in ('admin', 'editor') then raise exception 'Not authorised'; end if;
  if length(trim(p_full_name)) < 2 or length(trim(p_full_name)) > 120 then
    raise exception 'Invalid profile name';
  end if;
  update public.profiles
     set full_name = trim(p_full_name)
   where id = auth.uid()
   returning * into updated_profile;
  if updated_profile.id is null then raise exception 'Profile not found'; end if;
  return updated_profile;
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

create policy "profiles read own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "admins read all profiles" on public.profiles for select to authenticated using (public.current_staff_role() = 'admin');
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.current_staff_role() = 'admin') with check (public.current_staff_role() = 'admin');

create policy "published articles are public" on public.articles for select to anon, authenticated using (status = 'published');
create policy "staff read articles" on public.articles for select to authenticated using (public.current_staff_role() in ('admin', 'editor'));
create policy "staff create articles" on public.articles for insert to authenticated with check (public.current_staff_role() in ('admin', 'editor'));
create policy "staff update articles" on public.articles for update to authenticated using (public.current_staff_role() in ('admin', 'editor')) with check (public.current_staff_role() in ('admin', 'editor'));
create policy "staff delete articles" on public.articles for delete to authenticated using (public.current_staff_role() in ('admin', 'editor'));

create policy "admins manage enquiries" on public.contact_enquiries for all to authenticated using (public.current_staff_role() = 'admin') with check (public.current_staff_role() = 'admin');
create policy "admins manage quotes" on public.quote_requests for all to authenticated using (public.current_staff_role() = 'admin') with check (public.current_staff_role() = 'admin');
create policy "admins manage mentorship" on public.mentorship_applications for all to authenticated using (public.current_staff_role() = 'admin') with check (public.current_staff_role() = 'admin');
create policy "admins manage newsletter" on public.newsletter_subscribers for all to authenticated using (public.current_staff_role() = 'admin') with check (public.current_staff_role() = 'admin');

insert into storage.buckets (id, name, public)
values ('insights', 'insights', false)
on conflict (id) do update set public = excluded.public;

create policy "staff reads insight media" on storage.objects for select to authenticated using (bucket_id = 'insights' and public.current_staff_role() in ('admin', 'editor'));
create policy "staff uploads insight media" on storage.objects for insert to authenticated with check (bucket_id = 'insights' and public.current_staff_role() in ('admin', 'editor'));
create policy "staff updates insight media" on storage.objects for update to authenticated using (bucket_id = 'insights' and public.current_staff_role() in ('admin', 'editor')) with check (bucket_id = 'insights' and public.current_staff_role() in ('admin', 'editor'));
create policy "staff deletes insight media" on storage.objects for delete to authenticated using (bucket_id = 'insights' and public.current_staff_role() in ('admin', 'editor'));
