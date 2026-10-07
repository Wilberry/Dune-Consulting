create table public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint faq_items_question_not_blank check (length(trim(question)) > 0),
  constraint faq_items_answer_not_blank check (length(trim(answer)) > 0)
);

create index faq_items_active_sort_idx on public.faq_items (is_active, sort_order, created_at desc);

create trigger faq_items_set_updated_at
before update on public.faq_items
for each row execute function public.set_updated_at();

alter table public.faq_items enable row level security;

create policy "Public FAQ items are readable"
on public.faq_items
for select
to anon, authenticated
using (is_active = true);

create policy "Authorized staff can read all FAQ items"
on public.faq_items
for select
to authenticated
using (public.can_manage_articles());

create policy "Authorized staff can create FAQ items"
on public.faq_items
for insert
to authenticated
with check (public.can_manage_articles());

create policy "Authorized staff can update FAQ items"
on public.faq_items
for update
to authenticated
using (public.can_manage_articles())
with check (public.can_manage_articles());

create policy "Authorized staff can delete FAQ items"
on public.faq_items
for delete
to authenticated
using (public.can_manage_articles());

insert into public.faq_items (question, answer, sort_order, is_active)
select * from (
  values
    ('What does Dune Consulting do?', 'Dune Consulting is a Health, Safety, Environment, Quality, and Risk Management consultancy. We help organisations create safer workplaces through professional training, event safety management, HSE personnel outsourcing, compliance support, and strategic safety consulting.', 1, true),
    ('Which industries do you serve?', 'We work with organisations across multiple sectors, including construction, oil and gas, manufacturing, education, healthcare, hospitality, logistics, government agencies, and event management.', 2, true),
    ('What HSE training programmes do you offer?', 'We provide industry-relevant HSE training programmes ranging from introductory safety awareness to advanced professional development. Training may be delivered on-site, online, or at a designated training location, depending on the client’s needs.', 3, true),
    ('What is the HSE Mentorship Programme?', 'The HSE Mentorship Programme supports aspiring and early-career safety professionals through practical guidance, career coaching, industry insights, and real-world knowledge from experienced HSE professionals.', 4, true),
    ('Do you provide HSE personnel for companies?', 'Yes. We recruit, train, and deploy qualified HSE professionals for short-term, long-term, and project-based assignments, helping organisations access competent safety personnel when needed.', 5, true),
    ('What is Event Safety Management?', 'Event Safety Management involves planning and coordinating the safety requirements of an event. This includes risk assessment, crowd safety, emergency planning, incident prevention, and compliance with relevant safety standards.', 6, true),
    ('Can you customise training for our organisation?', 'Yes. We develop customised training programmes based on an organisation’s operations, workforce, industry risks, regulatory requirements, and learning objectives.', 7, true),
    ('Do you support regulatory compliance?', 'Yes. We help organisations understand applicable HSE requirements, conduct risk assessments, improve workplace safety systems, and implement practical measures that support compliance and operational excellence.', 8, true),
    ('How can I register for a training programme?', 'You can register through the website contact form, phone, email, or the company’s official social media channels. The Dune Consulting team will guide you through the available programmes and registration process.', 9, true),
    ('Why should I choose Dune Consulting?', 'Dune Consulting combines technical expertise, practical industry experience, and a strong commitment to safety excellence. Our solutions are designed to reduce risk, strengthen compliance, improve workforce competence, and support sustainable organisational performance.', 10, true)
) as seed(question, answer, sort_order, is_active)
where not exists (
  select 1 from public.faq_items existing
  where existing.question = seed.question
);
