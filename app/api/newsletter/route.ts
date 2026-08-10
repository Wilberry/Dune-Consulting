import { handleNewsletterSignup } from "@/lib/newsletter/handler";
import { createAdminClient } from "@/lib/supabase/admin";

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
    return;
  }

  const { error: insertError } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, status: "subscribed" });

  if (!insertError) return;

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
    return;
  }

  const error = new Error("Newsletter insert failed");
  error.name = insertError.code || "SupabaseError";
  throw error;
}

export async function POST(request: Request) {
  return handleNewsletterSignup(request, { persist: persistSubscription });
}
