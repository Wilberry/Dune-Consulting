"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateInvitationCode } from "@/lib/mentorship/invitation-token";

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

export type InvitationActionState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "created"; code: string };

export async function createMentorshipInvitation(
  _previous: InvitationActionState,
  formData: FormData,
): Promise<InvitationActionState> {
  const staff = await requireAdminUser();
  const parsed = z.uuid().safeParse(formData.get("applicationId"));
  if (!parsed.success) {
    return { status: "error", message: "Invalid application." };
  }

  try {
    const admin = createAdminClient();
    const { data: application, error: applicationError } = await admin
      .from("mentorship_applications")
      .select("id,status,selected_package,linked_user_id")
      .eq("id", parsed.data)
      .maybeSingle();

    if (
      applicationError ||
      !application ||
      application.status !== "accepted" ||
      !application.selected_package ||
      application.linked_user_id
    ) {
      return {
        status: "error",
        message: "Only accepted, unlinked applications with a saved package can receive invitations.",
      };
    }

    const { data: enrolment, error: enrolmentError } = await admin
      .from("mentorship_enrolments")
      .select("id")
      .eq("application_id", application.id)
      .maybeSingle();

    if (enrolmentError || enrolment) {
      return { status: "error", message: "This application is already linked or unavailable." };
    }

    const { code, tokenHash } = generateInvitationCode();
    const { error } = await admin.from("mentorship_claim_invitations").upsert(
      {
        application_id: application.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        claimed_by: null,
        claimed_at: null,
        created_by: staff.id,
      },
      { onConflict: "application_id" },
    );

    if (error) throw error;

    revalidatePath("/admin/mentorship");
    return { status: "created", code };
  } catch {
    return {
      status: "error",
      message: "Invitation could not be generated. Verify the development migration and try again.",
    };
  }
}
