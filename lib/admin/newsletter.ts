import "server-only";

import { createClient } from "@/lib/supabase/server";

export type NewsletterSubscriberStatus = "subscribed" | "unsubscribed";
export type NewsletterDeliverabilityStatus =
  "ok" | "bounced" | "complained" | "suppressed" | "failed";

export type NewsletterSubscriber = {
  id: string;
  email: string;
  firstName: string | null;
  status: NewsletterSubscriberStatus;
  externalContactId: string | null;
  providerSyncedAt: string | null;
  providerSyncError: string | null;
  deliverabilityStatus: NewsletterDeliverabilityStatus;
  deliverabilityUpdatedAt: string | null;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsletterCampaignStatus = "draft" | "sending" | "sent" | "failed";

export type NewsletterCampaign = {
  id: string;
  name: string;
  subject: string;
  previewText: string | null;
  contentHtml: string;
  contentText: string | null;
  status: NewsletterCampaignStatus;
  providerBroadcastId: string | null;
  providerStatus: string | null;
  recipientCount: number;
  sentAt: string | null;
  lastError: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewsletterCampaignEventSummary = Record<string, number>;

export async function getNewsletterSubscribers() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select(
      "id,email,first_name,status,external_contact_id,provider_synced_at,provider_sync_error,deliverability_status,deliverability_updated_at,subscribed_at,unsubscribed_at,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) throw new Error(error.message);

  return (data ?? []).map((subscriber): NewsletterSubscriber => ({
    id: subscriber.id,
    email: subscriber.email,
    firstName: subscriber.first_name,
    status: subscriber.status as NewsletterSubscriberStatus,
    externalContactId: subscriber.external_contact_id,
    providerSyncedAt: subscriber.provider_synced_at,
    providerSyncError: subscriber.provider_sync_error,
    deliverabilityStatus:
      subscriber.deliverability_status as NewsletterDeliverabilityStatus,
    deliverabilityUpdatedAt: subscriber.deliverability_updated_at,
    subscribedAt: subscriber.subscribed_at,
    unsubscribedAt: subscriber.unsubscribed_at,
    createdAt: subscriber.created_at,
    updatedAt: subscriber.updated_at,
  }));
}

export async function getNewsletterCampaigns() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .select(
      "id,name,subject,preview_text,content_html,content_text,status,provider_broadcast_id,provider_status,recipient_count,sent_at,last_error,created_at,updated_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapCampaign);
}

export async function getNewsletterCampaign(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .select(
      "id,name,subject,preview_text,content_html,content_text,status,provider_broadcast_id,provider_status,recipient_count,sent_at,last_error,created_at,updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapCampaign(data) : null;
}

function mapCampaign(campaign: Record<string, unknown>): NewsletterCampaign {
  return {
    id: String(campaign.id),
    name: String(campaign.name),
    subject: String(campaign.subject),
    previewText: campaign.preview_text ? String(campaign.preview_text) : null,
    contentHtml: String(campaign.content_html),
    contentText: campaign.content_text ? String(campaign.content_text) : null,
    status: campaign.status as NewsletterCampaignStatus,
    providerBroadcastId: campaign.provider_broadcast_id
      ? String(campaign.provider_broadcast_id)
      : null,
    providerStatus: campaign.provider_status
      ? String(campaign.provider_status)
      : null,
    recipientCount: Number(campaign.recipient_count ?? 0),
    sentAt: campaign.sent_at ? String(campaign.sent_at) : null,
    lastError: campaign.last_error ? String(campaign.last_error) : null,
    createdAt: String(campaign.created_at),
    updatedAt: String(campaign.updated_at),
  };
}

export async function getNewsletterAudienceReadiness() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select(
      "status,external_contact_id,provider_sync_error,deliverability_status",
    );

  if (error) throw new Error(error.message);
  const all = data ?? [];
  const active = all.filter((subscriber) => subscriber.status === "subscribed");
  const eligible = active.filter(
    (subscriber) => subscriber.deliverability_status === "ok",
  );
  const providerPending = all.filter((subscriber) => {
    if (subscriber.provider_sync_error) return true;
    return (
      subscriber.status === "subscribed" &&
      subscriber.deliverability_status === "ok" &&
      !subscriber.external_contact_id
    );
  });

  return {
    activeCount: active.length,
    eligibleCount: eligible.length,
    suppressedCount: active.length - eligible.length,
    unsyncedCount: providerPending.length,
  };
}

export async function getNewsletterCampaignEventSummary(campaignId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_provider_events")
    .select("event_type")
    .eq("campaign_id", campaignId)
    .limit(5000);

  if (error) throw new Error(error.message);
  return (data ?? []).reduce<NewsletterCampaignEventSummary>(
    (summary, event) => {
      summary[event.event_type] = (summary[event.event_type] ?? 0) + 1;
      return summary;
    },
    {},
  );
}
