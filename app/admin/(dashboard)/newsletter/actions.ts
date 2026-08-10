"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin/auth";
import { syncNewsletterSubscriber } from "@/lib/newsletter/provider";
import { createClient } from "@/lib/supabase/server";

const statusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["subscribed", "unsubscribed"]),
});

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function syncSubscriberRecord(subscriber: {
  id: string;
  email: string;
  first_name: string | null;
  status: "subscribed" | "unsubscribed";
  external_contact_id: string | null;
}) {
  const supabase = await createClient();

  try {
    const result = await syncNewsletterSubscriber({
      email: subscriber.email,
      firstName: subscriber.first_name,
      status: subscriber.status,
      externalContactId: subscriber.external_contact_id,
    });

    if (result.status === "unconfigured") return;

    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({
        external_contact_id: result.externalContactId,
        provider_synced_at: new Date().toISOString(),
        provider_sync_error: null,
      })
      .eq("id", subscriber.id);
    if (error) throw new Error(error.message);
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "ProviderSyncError";
    const { error: stateError } = await supabase
      .from("newsletter_subscribers")
      .update({ provider_sync_error: errorName })
      .eq("id", subscriber.id);
    if (stateError) console.error("Newsletter sync state update failed", stateError.code);
  }
}

export async function updateNewsletterStatus(formData: FormData) {
  await requireAdminUser();

  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error("Invalid newsletter subscriber status update.");
  }

  const supabase = await createClient();
  const { data: subscriber, error: loadError } = await supabase
    .from("newsletter_subscribers")
    .select("id,email,first_name,status,external_contact_id")
    .eq("id", parsed.data.id)
    .maybeSingle();

  if (loadError || !subscriber) {
    throw new Error("Newsletter subscriber could not be loaded.");
  }

  const now = new Date().toISOString();
  const update =
    parsed.data.status === "subscribed"
      ? {
          status: "subscribed" as const,
          subscribed_at: now,
          unsubscribed_at: null,
        }
      : {
          status: "unsubscribed" as const,
          unsubscribed_at: now,
        };

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update(update)
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  await syncSubscriberRecord({
    ...subscriber,
    status: parsed.data.status,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/newsletter");
}

export async function syncNewsletterSubscribers() {
  await requireAdminUser();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("id,email,first_name,status,external_contact_id,provider_sync_error")
    .order("updated_at", { ascending: true })
    .limit(100);

  if (error) throw new Error(error.message);

  const pending = (data ?? [])
    .filter(
      (subscriber) =>
        !subscriber.external_contact_id || Boolean(subscriber.provider_sync_error),
    )
    .slice(0, 10);

  for (const subscriber of pending) {
    await syncSubscriberRecord({
      id: subscriber.id,
      email: subscriber.email,
      first_name: subscriber.first_name,
      status: subscriber.status as "subscribed" | "unsubscribed",
      external_contact_id: subscriber.external_contact_id,
    });
    await delay(600);
  }

  revalidatePath("/admin/newsletter");
  revalidatePath("/admin/newsletter/campaigns");
}
