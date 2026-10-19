import { handleContactRequest } from "@/lib/contact/handler";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkPublicFormAbuse } from "@/lib/forms/abuse-guard";

export async function POST(request: Request) {
  const abuse = await checkPublicFormAbuse(request, "contact");
  if (!abuse.ok) return abuse.response;

  return handleContactRequest(request, {
    persist: async (enquiry) => {
      const supabase = createAdminClient();
      const { error } = await supabase
        .from("contact_enquiries")
        .insert(enquiry);

      if (error) {
        const persistenceError = new Error(
          "Contact enquiry persistence failed",
        );
        persistenceError.name = error.code || "SupabaseError";
        throw persistenceError;
      }
    },
  });
}
