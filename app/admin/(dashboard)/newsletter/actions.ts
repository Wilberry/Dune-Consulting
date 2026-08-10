"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

const statusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["subscribed", "unsubscribed"]),
});

export async function updateNewsletterStatus(formData: FormData) {
  await requireAdminUser();

  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error("Invalid newsletter subscriber status update.");
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

  const supabase = await createClient();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .update(update)
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/newsletter");
}
