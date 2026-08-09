"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

const statusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "reviewing", "accepted", "declined"]),
});

export async function updateMentorshipStatus(formData: FormData) {
  await requireAdminUser();

  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error("Invalid mentorship status update.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mentorship_applications")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/mentorship");
}
