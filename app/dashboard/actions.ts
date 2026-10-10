"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hashInvitationCode } from "@/lib/mentorship/invitation-token";

export type MenteeActionState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function claimMentorship(
  _previous: MenteeActionState,
  formData: FormData,
): Promise<MenteeActionState> {
  const tokenHash = hashInvitationCode(formData.get("code"));
  if (!tokenHash) {
    return { status: "error", message: "Invalid or expired invitation code." };
  }

  try {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) {
      return {
        status: "error",
        message: "Sign in before claiming an invitation.",
      };
    }

    const { error } = await supabase.rpc("claim_mentorship_enrolment", {
      p_token_hash: tokenHash,
    });

    if (error) {
      return {
        status: "error",
        message:
          "We could not link this invitation. Check that it is current and that your account email has been verified.",
      };
    }

    revalidatePath("/dashboard");
    return {
      status: "success",
      message:
        "Your enrolment is now linked. Refresh the dashboard to view it.",
    };
  } catch {
    return {
      status: "error",
      message: "The invitation service is temporarily unavailable.",
    };
  }
}

export async function updateMenteeProfile(
  _previous: MenteeActionState,
  formData: FormData,
): Promise<MenteeActionState> {
  const name = formData.get("fullName");
  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 120
  ) {
    return {
      status: "error",
      message: "Enter a name between 2 and 120 characters.",
    };
  }

  try {
    const supabase = await createClient();
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth.user) {
      return { status: "error", message: "Please sign in again." };
    }

    const { error } = await supabase.rpc("update_my_mentee_name", {
      new_full_name: name.trim(),
    });
    if (error) {
      return { status: "error", message: "Your profile could not be updated." };
    }

    revalidatePath("/dashboard");
    return { status: "success", message: "Your name has been updated." };
  } catch {
    return {
      status: "error",
      message: "Profile updates are temporarily unavailable.",
    };
  }
}
