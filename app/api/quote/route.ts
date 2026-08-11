import { handleQuoteRequest } from "@/lib/quote/handler";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstileRequest } from "@/lib/turnstile/server";

export async function POST(request: Request) {
  const turnstile = await verifyTurnstileRequest(request, "quote");
  if (!turnstile.ok) return turnstile.response;

  return handleQuoteRequest(request, {
    persist: async (quote) => {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("quote_requests")
        .insert(quote)
        .select("reference_number")
        .single();

      if (error || !data?.reference_number) {
        const persistenceError = new Error("Quote request persistence failed");
        persistenceError.name = error?.code || "SupabaseError";
        throw persistenceError;
      }

      return data.reference_number;
    },
  });
}
