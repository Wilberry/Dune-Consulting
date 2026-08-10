import { NextResponse } from "next/server";
import { getResendWebhookSecret } from "@/lib/server-env";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifySvixWebhook } from "@/lib/newsletter/webhook";

type WebhookEvent = {
  type: string;
  created_at: string;
  data: Record<string, unknown>;
};

type AdminClient = ReturnType<typeof createAdminClient>;

type SubscriberEventTarget = {
  id: string;
  email: string;
  status: string;
  deliverability_status: string;
  provider_synced_at: string | null;
  deliverability_updated_at: string | null;
};

function asString(value: unknown) {
  return typeof value === "string" && value ? value : null;
}

function recipientEmail(data: Record<string, unknown>) {
  const direct = asString(data.email);
  if (direct) return direct;
  const recipients = Array.isArray(data.to) ? data.to : [];
  return (
    recipients.find((value): value is string => typeof value === "string") ??
    null
  );
}

function contactSegmentIds(data: Record<string, unknown>) {
  if (!Array.isArray(data.segment_ids)) return null;
  return data.segment_ids.filter(
    (value): value is string => typeof value === "string" && value.length > 0,
  );
}

function providerSegmentSyncError(
  event: WebhookEvent,
  subscriber: SubscriberEventTarget,
  unsubscribed: boolean,
) {
  const segmentId = process.env.NEWSLETTER_SEGMENT_ID?.trim();
  const segmentIds = contactSegmentIds(event.data);
  if (!segmentId || !segmentIds) return undefined;

  const shouldBelong =
    !unsubscribed && subscriber.deliverability_status === "ok";
  const belongs = segmentIds.includes(segmentId);
  return belongs === shouldBelong
    ? null
    : "Provider segment reconciliation pending";
}

function isNewerEvent(eventTime: string, previousTime: string | null) {
  if (!previousTime) return true;
  return Date.parse(eventTime) > Date.parse(previousTime);
}

async function campaignIdForBroadcast(
  supabase: AdminClient,
  broadcastId: string | null,
) {
  if (!broadcastId) return null;
  const { data, error } = await supabase
    .from("newsletter_campaigns")
    .select("id")
    .eq("provider_broadcast_id", broadcastId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.id ?? null;
}

async function subscriberForEvent(
  supabase: AdminClient,
  data: Record<string, unknown>,
  email: string | null,
): Promise<SubscriberEventTarget | null> {
  const select =
    "id,email,status,deliverability_status,provider_synced_at,deliverability_updated_at";
  const providerContactId = asString(data.id);
  if (providerContactId) {
    const { data: byProvider, error } = await supabase
      .from("newsletter_subscribers")
      .select(select)
      .eq("external_contact_id", providerContactId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (byProvider) return byProvider as SubscriberEventTarget;
  }

  if (!email) return null;
  const { data: byEmail, error } = await supabase
    .from("newsletter_subscribers")
    .select(select)
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return byEmail ? (byEmail as SubscriberEventTarget) : null;
}

async function applyContactEvent(
  supabase: AdminClient,
  event: WebhookEvent,
  subscriber: SubscriberEventTarget | null,
) {
  if (!subscriber) return;
  if (!isNewerEvent(event.created_at, subscriber.provider_synced_at)) return;

  const providerContactId = asString(event.data.id);

  if (event.type === "contact.deleted") {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        external_contact_id: null,
        provider_synced_at: event.created_at,
        provider_sync_error: "Provider contact deleted",
      })
      .eq("id", subscriber.id);
    if (error) throw new Error(error.message);
    return;
  }

  if (event.type !== "contact.created" && event.type !== "contact.updated") {
    return;
  }

  const unsubscribed = event.data.unsubscribed === true;
  const segmentSyncError = providerSegmentSyncError(
    event,
    subscriber,
    unsubscribed,
  );
  const update: Record<string, unknown> = {
    external_contact_id: providerContactId,
    provider_synced_at: event.created_at,
    status: unsubscribed ? "unsubscribed" : "subscribed",
  };
  if (segmentSyncError !== undefined) {
    update.provider_sync_error = segmentSyncError;
  }
  if (unsubscribed) update.unsubscribed_at = event.created_at;
  else update.unsubscribed_at = null;

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update(update)
    .eq("id", subscriber.id);
  if (error) throw new Error(error.message);
}

async function applyDeliverabilityEvent(
  supabase: AdminClient,
  event: WebhookEvent,
  subscriber: SubscriberEventTarget | null,
) {
  if (!subscriber) return;
  if (
    !isNewerEvent(event.created_at, subscriber.deliverability_updated_at)
  ) {
    return;
  }

  const statusByEvent: Record<string, string> = {
    "email.bounced": "bounced",
    "email.complained": "complained",
    "email.suppressed": "suppressed",
    "email.failed": "failed",
  };
  const deliverability = statusByEvent[event.type];
  if (!deliverability) return;

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update({
      deliverability_status: deliverability,
      deliverability_updated_at: event.created_at,
      provider_sync_error: "Deliverability segment cleanup pending",
    })
    .eq("id", subscriber.id);
  if (error) throw new Error(error.message);
}

function eventMetadata(event: WebhookEvent) {
  const metadata: Record<string, unknown> = {};
  const broadcastId = asString(event.data.broadcast_id);
  if (broadcastId) metadata.broadcast_id = broadcastId;

  if (event.data.bounce && typeof event.data.bounce === "object") {
    const bounce = event.data.bounce as Record<string, unknown>;
    metadata.bounce_type = asString(bounce.type);
    metadata.bounce_subtype = asString(bounce.subType);
  }
  if (event.data.failed && typeof event.data.failed === "object") {
    const failed = event.data.failed as Record<string, unknown>;
    metadata.failed_reason = asString(failed.reason);
  }
  return metadata;
}

export async function POST(request: Request) {
  const secret = getResendWebhookSecret();
  if (!secret) {
    return NextResponse.json({ status: "unconfigured" }, { status: 503 });
  }

  const id = request.headers.get("svix-id");
  const timestamp = request.headers.get("svix-timestamp");
  const signature = request.headers.get("svix-signature");
  if (!id || !timestamp || !signature) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const payload = await request.text();
  if (!verifySvixWebhook(payload, { id, timestamp, signature }, secret)) {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  let event: WebhookEvent;
  try {
    const parsed = JSON.parse(payload) as unknown;
    if (!parsed || typeof parsed !== "object") throw new Error("Invalid payload");
    const candidate = parsed as Partial<WebhookEvent>;
    if (
      typeof candidate.type !== "string" ||
      typeof candidate.created_at !== "string" ||
      !Number.isFinite(Date.parse(candidate.created_at)) ||
      !candidate.data ||
      typeof candidate.data !== "object"
    ) {
      throw new Error("Invalid payload");
    }
    event = candidate as WebhookEvent;
  } catch {
    return NextResponse.json({ status: "invalid" }, { status: 400 });
  }

  const supabase = createAdminClient();

  try {
    const { data: duplicate, error: duplicateError } = await supabase
      .from("newsletter_provider_events")
      .select("id")
      .eq("svix_id", id)
      .maybeSingle();
    if (duplicateError) throw new Error(duplicateError.message);
    if (duplicate) return NextResponse.json({ status: "ok" });

    const email = recipientEmail(event.data);
    const subscriber = await subscriberForEvent(supabase, event.data, email);
    const broadcastId = asString(event.data.broadcast_id);
    const campaignId = await campaignIdForBroadcast(supabase, broadcastId);

    await applyContactEvent(supabase, event, subscriber);
    await applyDeliverabilityEvent(supabase, event, subscriber);

    const { error: insertError } = await supabase
      .from("newsletter_provider_events")
      .insert({
        svix_id: id,
        event_type: event.type,
        campaign_id: campaignId,
        subscriber_id: subscriber?.id ?? null,
        provider_email_id: asString(event.data.email_id),
        recipient_email: email,
        occurred_at: event.created_at,
        metadata: eventMetadata(event),
      });

    if (insertError && insertError.code !== "23505") {
      throw new Error(insertError.message);
    }
  } catch (error) {
    console.error(
      "Resend webhook processing failed",
      error instanceof Error ? error.name : "UnknownWebhookError",
    );
    return NextResponse.json({ status: "error" }, { status: 500 });
  }

  return NextResponse.json({ status: "ok" });
}
