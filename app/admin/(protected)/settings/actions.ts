"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaffUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
});

export type ProfileState = {
  status?: "success" | "error";
  message?: string;
};

export async function updateProfileAction(
  _state: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  await requireStaffUser();
  const parsed = profileSchema.safeParse({ fullName: formData.get("fullName") });
  if (!parsed.success) {
    return { status: "error", message: "Enter a name between 2 and 120 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_my_profile_name", {
    p_full_name: parsed.data.fullName,
  });

  if (error) {
    console.error("Admin profile update failed", error.message);
    return { status: "error", message: "The profile could not be updated." };
  }

  revalidatePath("/admin", "layout");
  return { status: "success", message: "Profile name updated." };
}
