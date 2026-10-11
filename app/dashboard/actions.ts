"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function logoutMentee() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("The sign-out request could not be completed.");
  }

  redirect("/dashboard/login");
}

export async function claimMentorshipApplication() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/dashboard/login");
  }

  const { data: result, error } = await supabase.rpc(
    "claim_my_mentorship_application",
  );

  if (error) {
    throw new Error("The application could not be linked securely.");
  }

  if (result === "claimed" || result === "already_claimed") {
    revalidatePath("/dashboard");
    redirect("/dashboard?claim=success");
  }

  revalidatePath("/dashboard");
  redirect("/dashboard?claim=unavailable");
}
