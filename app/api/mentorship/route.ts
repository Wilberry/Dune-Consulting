import { handleMentorshipApplication } from "@/lib/mentorship/handler";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstileRequest } from "@/lib/turnstile/server";

export async function POST(request: Request) {
  const turnstile = await verifyTurnstileRequest(request, "mentorship");
  if (!turnstile.ok) return turnstile.response;

  return handleMentorshipApplication(request, {
    persist: async (application) => {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("mentorship_applications")
        .insert(application);

      if (error) {
        const persistenceError = new Error(
          "Mentorship application persistence failed",
        );
        persistenceError.name = error.code || "SupabaseError";
        throw persistenceError;
      }
    },
  });
}
