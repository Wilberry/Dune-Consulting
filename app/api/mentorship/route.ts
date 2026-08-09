import { handleMentorshipApplication } from "@/lib/mentorship/handler";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
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
