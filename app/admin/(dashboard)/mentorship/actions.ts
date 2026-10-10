"use server";

import { createHash, randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

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

export type MentorshipInvitationState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "created"; code: string };

export async function createMentorshipInvitation(
  _previous: MentorshipInvitationState,
  formData: FormData,
): Promise<MentorshipInvitationState> {
  const staff = await requireAdminUser();
  const parsed = z.uuid().safeParse(formData.get("applicationId"));
  if (!parsed.success) {
    return { status: "error", message: "Invalid application." };
  }

  // Staff must deliberately hand the invitation to the approved applicant.
  // No automatic email or external delivery is triggered by this action.
  try {
    const admin = createAdminClient();
    const { data: application, error: applicationError } = await admin
      .from("mentorship_applications")
      .select("id,status,selected_package")
      .eq("id", parsed.data)
      .maybeSingle();
    if (
      applicationError ||
      !application ||
      application.status !== "accepted" ||
      !application.selected_package
    ) {
      return {
        status: "error",
        message: "Only approved applications with a recorded package can be invited.",
      };
    }

    const { data: enrolment, error: enrolmentError } = await admin
      .from("mentorship_enrolments")
      .select("id")
      .eq("application_id", application.id)
      .maybeSingle();

    if (enrolmentError || enrolment) {
      return {
        status: "error",
        message: "Invitation unavailable. The application may already be linked.",
      };
    }

    const code = randomBytes(32).toString("base64url");
    const tokenHash = createHash("sha256").update(code).digest("hex");
    const { error } = await admin.from("mentorship_claims").upsert(
      {
        application_id: application.id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        claimed_at: null,
        claimed_by: null,
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
      message: "Invitation could not be created. Verify the database migration.",
    };
  }
}
