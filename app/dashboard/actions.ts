"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hashInvitationCode } from "@/lib/mentorship/invitation-token";

export type ClaimState = {
  status: "idle" | "error" | "success";
  message?: string;
};

export async function logoutMentee() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("The sign-out request could not be completed.");
  }

  redirect("/dashboard/login");
}

export async function claimMentorshipApplication(
  _previous: ClaimState,
  formData: FormData,
): Promise<ClaimState> {
  const tokenHash = hashInvitationCode(formData.get("invitationCode"));
  if (!tokenHash) {
    return { status: "error", message: "Enter the private invitation code provided by staff." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { status: "error", message: "Sign in to link your enrolment." };
    }

    const { data: result, error } = await supabase.rpc(
      "claim_mentorship_with_code",
      { p_token_hash: tokenHash },
    );

    if (error || (result !== "claimed" && result !== "already_claimed")) {
      return {
        status: "error",
        message: "The invitation could not be used. Confirm your account email is verified and ask staff for a valid code.",
      };
    }

    revalidatePath("/dashboard");
    return { status: "success", message: "Your approved enrolment is now linked." };
  } catch {
    return {
      status: "error",
      message: "The invitation service is temporarily unavailable. Please try again.",
    };
  }
}
