alter table public.newsletter_subscribers
add column if not exists provider_synced_at timestamptz,
add column if not exists provider_sync_error text,
add column if not exists deliverability_status text not null default 'ok',
add column if not exists deliverability_updated_at timestamptz;

alter table public.newsletter_subscribers
add constraint newsletter_subscribers_deliverability_status_check
check (deliverability_status in ('ok', 'bounced', 'complained', 'suppressed', 'failed'));

create table public.newsletter_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null,
  preview_text text,
  content_html text not null,
  content_text text,
  status text not null default 'draft',
  provider_broadcast_id text unique,
  provider_status text,
  recipient_count integer not null default 0,
  sent_at timestamptz,
  last_error text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint newsletter_campaigns_name_check check (char_length(trim(name)) between 3 and 120),
  constraint newsletter_campaigns_subject_check check (char_length(trim(subject)) between 3 and 160),
  constraint newsletter_campaigns_status_check check (status in ('draft', 'sending', 'sent', 'failed')),
  constraint newsletter_campaigns_recipient_count_check check (recipient_count >= 0)
);

create index newsletter_campaigns_status_idx
on public.newsletter_campaigns(status);

create index newsletter_campaigns_created_at_idx
on public.newsletter_campaigns(created_at desc);

create index newsletter_campaigns_sent_at_idx
on public.newsletter_campaigns(sent_at desc);

create table public.newsletter_provider_events (
  id uuid primary key default gen_random_uuid(),
  svix_id text not null unique,
  event_type text not null,
  campaign_id uuid references public.newsletter_campaigns(id) on delete cascade,
  subscriber_id uuid references public.newsletter_subscribers(id) on delete set null,
  provider_email_id text,
  recipient_email text,
  occurred_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index newsletter_provider_events_campaign_idx
on public.newsletter_provider_events(campaign_id, occurred_at desc);

create index newsletter_provider_events_subscriber_idx
on public.newsletter_provider_events(subscriber_id, occurred_at desc);

create index newsletter_provider_events_type_idx
on public.newsletter_provider_events(event_type, occurred_at desc);

create trigger newsletter_campaigns_set_updated_at
before update on public.newsletter_campaigns
for each row execute function public.set_updated_at();

alter table public.newsletter_campaigns enable row level security;
alter table public.newsletter_provider_events enable row level security;

create policy "Admins manage newsletter campaigns"
on public.newsletter_campaigns
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "Admins read newsletter provider events"
on public.newsletter_provider_events
for select
to authenticated
using (public.is_admin());
