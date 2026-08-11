"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaffUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter at least 2 characters.")
    .max(120, "Keep the name under 120 characters."),
});

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function updateProfileName(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  await requireStaffUser();

  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Review the profile name.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("update_my_profile_name", {
    new_full_name: parsed.data.fullName,
  });

  if (error) {
    console.error("Admin profile update failed", error.message);
    return { status: "error", message: "The profile could not be updated." };
  }

  revalidatePath("/admin", "layout");
  return { status: "success", message: "Profile name updated." };
}
