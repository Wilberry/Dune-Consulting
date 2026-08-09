import { handleQuoteRequest } from "@/lib/quote/handler";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
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
