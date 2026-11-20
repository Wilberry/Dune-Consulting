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

const companyContactSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(30, "Keep the phone number under 30 characters.")
    .regex(/^\+?[0-9().\s]+$/, "Enter a valid phone number."),
  email: z
    .string()
    .trim()
    .max(254, "Keep the email address under 254 characters.")
    .pipe(z.email("Enter a valid email address.")),
});

export type ProfileActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type CompanyContactActionState = ProfileActionState;

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

export async function updateCompanyContactDetails(
  _previousState: CompanyContactActionState,
  formData: FormData,
): Promise<CompanyContactActionState> {
  await requireStaffUser();

  const parsed = companyContactSchema.safeParse({
    phone: formData.get("phone"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ??
        "Review the public contact information.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("company_contact_settings").upsert(
    {
      id: 1,
      contact_phone: parsed.data.phone,
      contact_email: parsed.data.email,
    },
    { onConflict: "id" },
  );

  if (error) {
    console.error("Admin company contact update failed", error.message);
    return {
      status: "error",
      message: "The public contact details could not be updated.",
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
  return { status: "success", message: "Public contact details updated." };
}
