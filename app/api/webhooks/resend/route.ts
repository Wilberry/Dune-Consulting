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
) {
  const providerContactId = asString(data.id);
  if (providerContactId) {
    const { data: byProvider, error } = await supabase
      .from("newsletter_subscribers")
      .select("id,email,status")
      .eq("external_contact_id", providerContactId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (byProvider) return byProvider;
  }

  if (!email) return null;
  const { data: byEmail, error } = await supabase
    .from("newsletter_subscribers")
    .select("id,email,status")
    .eq("email", email.toLowerCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return byEmail ?? null;
}

async function applyContactEvent(
  supabase: AdminClient,
  event: WebhookEvent,
  subscriberId: string | null,
) {
  if (!subscriberId) return;
  const providerContactId = asString(event.data.id);

  if (event.type === "contact.deleted") {
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        external_contact_id: null,
        provider_synced_at: null,
        provider_sync_error: "Provider contact deleted",
      })
      .eq("id", subscriberId);
    if (error) throw new Error(error.message);
    return;
  }

  if (event.type !== "contact.created" && event.type !== "contact.updated") {
    return;
  }

  const unsubscribed = event.data.unsubscribed === true;
  const update: Record<string, unknown> = {
    external_contact_id: providerContactId,
    provider_synced_at: event.created_at,
    provider_sync_error: null,
    status: unsubscribed ? "unsubscribed" : "subscribed",
  };
  if (unsubscribed) update.unsubscribed_at = event.created_at;
  else update.unsubscribed_at = null;

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update(update)
    .eq("id", subscriberId);
  if (error) throw new Error(error.message);
}

async function applyDeliverabilityEvent(
  supabase: AdminClient,
  event: WebhookEvent,
  subscriberId: string | null,
) {
  if (!subscriberId) return;
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
    .eq("id", subscriberId);
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

    await applyContactEvent(supabase, event, subscriber?.id ?? null);
    await applyDeliverabilityEvent(supabase, event, subscriber?.id ?? null);

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
