import { handleMentorshipApplication } from "@/lib/mentorship/handler";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkPublicFormAbuse } from "@/lib/forms/abuse-guard";

export async function POST(request: Request) {
  const abuse = await checkPublicFormAbuse(request, "mentorship");
  if (!abuse.ok) return abuse.response;

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
