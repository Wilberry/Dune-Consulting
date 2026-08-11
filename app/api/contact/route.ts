import { handleContactRequest } from "@/lib/contact/handler";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstileRequest } from "@/lib/turnstile/server";

export async function POST(request: Request) {
  const turnstile = await verifyTurnstileRequest(request, "contact");
  if (!turnstile.ok) return turnstile.response;

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
