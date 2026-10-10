import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { MenteeAuthForm } from "@/components/mentee/auth-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mentee sign in",
  robots: { index: false, follow: false },
};

export default async function MenteeLoginPage() {
  let signedIn = false;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    signedIn = !!data.user;
  } catch {
    // Display login UI even when configuration is unavailable.
  }
  if (signedIn) redirect("/dashboard");
  return <MenteeAuthForm />;
}
