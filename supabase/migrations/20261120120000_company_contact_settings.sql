create table public.company_contact_settings (
  id smallint primary key default 1,
  contact_phone text not null,
  contact_email text not null,
  updated_at timestamptz not null default now(),
  constraint company_contact_settings_singleton check (id = 1),
  constraint company_contact_settings_phone_not_blank check (length(trim(contact_phone)) > 0),
  constraint company_contact_settings_email_not_blank check (length(trim(contact_email)) > 0)
);

create trigger company_contact_settings_set_updated_at
before update on public.company_contact_settings
for each row execute function public.set_updated_at();

alter table public.company_contact_settings enable row level security;

grant select on public.company_contact_settings to anon, authenticated;
grant insert, update on public.company_contact_settings to authenticated;

create policy "Public company contact details are readable"
on public.company_contact_settings
for select
to anon, authenticated
using (true);

create policy "Authorized staff can create company contact details"
on public.company_contact_settings
for insert
to authenticated
with check (public.can_manage_articles());

create policy "Authorized staff can update company contact details"
on public.company_contact_settings
for update
to authenticated
using (public.can_manage_articles())
with check (public.can_manage_articles());
