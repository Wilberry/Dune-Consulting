create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  quote text not null,
  image text,
  rating integer not null default 5,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint testimonials_name_not_blank check (length(trim(name)) > 0),
  constraint testimonials_role_not_blank check (length(trim(role)) > 0),
  constraint testimonials_quote_not_blank check (length(trim(quote)) > 0),
  constraint testimonials_rating_check check (rating between 1 and 5)
);

create index testimonials_active_sort_idx on public.testimonials (is_active, sort_order, created_at desc);

create trigger testimonials_set_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

create policy "Public testimonials are readable"
on public.testimonials
for select
to anon, authenticated
using (is_active = true);

create policy "Authorized staff can read all testimonials"
on public.testimonials
for select
to authenticated
using (public.can_manage_articles());

create policy "Authorized staff can create testimonials"
on public.testimonials
for insert
to authenticated
with check (public.can_manage_articles());

create policy "Authorized staff can update testimonials"
on public.testimonials
for update
to authenticated
using (public.can_manage_articles())
with check (public.can_manage_articles());

create policy "Authorized staff can delete testimonials"
on public.testimonials
for delete
to authenticated
using (public.can_manage_articles());

insert into public.testimonials (name, role, quote, image, rating, sort_order, is_active)
select * from (
  values
    ('Amina Yusuf', 'HSE Graduate', 'The Dune HSE Mentorship Program gave me the confidence to apply safety decisions in real event and workplace environments. The coaching was practical, direct and easy to follow.', '/images/executive_portrait.webp', 5, 1, true),
    ('Michael Ade', 'Event Operations Manager', 'Dune Consulting’s team helped us deliver a large conference with clarity and calm. Their event safety planning and on-site communication made the whole delivery far more reliable.', '/images/Hero.webp', 5, 2, true),
    ('Adaeze Okoro', 'Safety Supervisor', 'Their practical training sessions were directly relevant to our crew and made immediate improvements to how we manage site risk and communicate expectations.', '/images/dune_training_outdoor_high_quality.webp', 4, 3, true)
) as seed(name, role, quote, image, rating, sort_order, is_active)
where not exists (
  select 1 from public.testimonials existing
  where existing.name = seed.name and existing.role = seed.role
);
