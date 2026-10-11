"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
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
  await requireAdminUser();
  const parsed = z.uuid().safeParse(formData.get("applicationId"));
  if (!parsed.success) {
    return { status: "error", message: "Invalid application." };
  }

  try {
    const { code, tokenHash } = generateInvitationCode();
    const supabase = await createClient();
    const { data: issued, error } = await supabase.rpc(
      "issue_mentorship_invitation",
      {
        p_application_id: parsed.data,
        p_token_hash: tokenHash,
      },
    );

    if (error || issued !== true) {
      return {
        status: "error",
        message:
          "Only approved, unlinked applications with a recorded package can receive invitations.",
      };
    }

    revalidatePath("/admin/mentorship");
    return { status: "created", code };
  } catch {
    return {
      status: "error",
      message: "Invitation service is unavailable. Please try again later.",
    };
  }
}
