"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

const statusSchema = z.object({
  id: z.uuid(),
  status: z.enum(["new", "read", "replied", "closed"]),
});

export async function updateEnquiryStatus(formData: FormData) {
  await requireAdminUser();

  const parsed = statusSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });

  if (!parsed.success) {
    throw new Error("Invalid enquiry status update.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_enquiries")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
}
