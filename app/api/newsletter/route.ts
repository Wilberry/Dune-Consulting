import { handleNewsletterSignup } from "@/lib/newsletter/handler";
import { syncNewsletterSubscriber } from "@/lib/newsletter/provider";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstileRequest } from "@/lib/turnstile/server";

type DeliverabilityStatus =
  "ok" | "bounced" | "complained" | "suppressed" | "failed";

type SubscriberRecord = {
  id: string;
  email: string;
  first_name: string | null;
  status: "subscribed" | "unsubscribed";
  deliverability_status: DeliverabilityStatus;
  external_contact_id: string | null;
};

async function loadSubscriber(email: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select(
      "id,email,first_name,status,deliverability_status,external_contact_id",
    )
    .eq("email", email)
    .single();

  if (error || !data) {
    const loadError = new Error("Newsletter subscriber reload failed");
    loadError.name = error?.code || "SupabaseError";
    throw loadError;
  }
  return data as SubscriberRecord;
}

async function syncPersistedSubscriber(subscriber: SubscriberRecord) {
  const supabase = createAdminClient();

  try {
    const result = await syncNewsletterSubscriber({
      email: subscriber.email,
      firstName: subscriber.first_name,
      status: subscriber.status,
      deliverabilityStatus: subscriber.deliverability_status,
      externalContactId: subscriber.external_contact_id,
    });

    if (result.status === "unconfigured") {
      return;
    }

    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        external_contact_id: result.externalContactId,
        provider_synced_at: new Date().toISOString(),
        provider_sync_error: null,
      })
      .eq("id", subscriber.id);

    if (error) {
      console.error(
        "Newsletter provider sync state could not be recorded",
        error.code || "SupabaseError",
      );
    }
  } catch (error) {
    const providerError =
      error instanceof Error ? error.name : "NewsletterProviderError";
    console.error("Newsletter provider sync failed", providerError);

    const { error: stateError } = await supabase
      .from("newsletter_subscribers")
      .update({ provider_sync_error: providerError })
      .eq("id", subscriber.id);

    if (stateError) {
      console.error(
        "Newsletter provider sync failure could not be recorded",
        stateError.code || "SupabaseError",
      );
    }
  }
}

async function persistSubscription(email: string) {
  const supabase = createAdminClient();
  const { data: existing, error: lookupError } = await supabase
    .from("newsletter_subscribers")
    .select("id,status")
    .eq("email", email)
    .maybeSingle();

  if (lookupError) {
    const error = new Error("Newsletter lookup failed");
    error.name = lookupError.code || "SupabaseError";
    throw error;
  }

  if (existing) {
    if (existing.status === "unsubscribed") {
      const { error: updateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "subscribed",
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
        })
        .eq("id", existing.id);

      if (updateError) {
        const error = new Error("Newsletter re-subscription failed");
        error.name = updateError.code || "SupabaseError";
        throw error;
      }
    }

    await syncPersistedSubscriber(await loadSubscriber(email));
    return;
  }

  const { error: insertError } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, status: "subscribed" });

  if (!insertError) {
    await syncPersistedSubscriber(await loadSubscriber(email));
    return;
  }

  if (insertError.code === "23505") {
    const { data: raced, error: raceLookupError } = await supabase
      .from("newsletter_subscribers")
      .select("id,status")
      .eq("email", email)
      .maybeSingle();

    if (raceLookupError || !raced) {
      const error = new Error("Newsletter duplicate reconciliation failed");
      error.name = raceLookupError?.code || "SupabaseError";
      throw error;
    }

    if (raced.status === "unsubscribed") {
      const { error: reactivateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "subscribed",
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null,
        })
        .eq("id", raced.id);

      if (reactivateError) {
        const error = new Error("Newsletter duplicate reactivation failed");
        error.name = reactivateError.code || "SupabaseError";
        throw error;
      }
    }

    await syncPersistedSubscriber(await loadSubscriber(email));
    return;
  }

  const error = new Error("Newsletter insert failed");
  error.name = insertError.code || "SupabaseError";
  throw error;
}

export async function POST(request: Request) {
  const turnstile = await verifyTurnstileRequest(request, "newsletter");
  if (!turnstile.ok) return turnstile.response;

  return handleNewsletterSignup(request, { persist: persistSubscription });
}
