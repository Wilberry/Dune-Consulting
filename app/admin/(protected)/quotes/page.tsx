import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminQuotesPage() {
  await requireAdminUser();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("quote_requests")
    .select("id", { count: "exact", head: true });
  if (error) throw error;

  return (
    <SectionPlaceholder
      eyebrow="Operations"
      title={`Quote Requests (${count ?? 0})`}
      description="The quote-request table and concurrency-safe DUNE-Q reference sequence are ready for the dedicated Phase Two form workflow."
      emptyTitle={(count ?? 0) === 0 ? "No quote requests yet" : "Quote storage is connected"}
      emptyCopy="A dedicated quote form and full request-management interface are intentionally deferred to the next phase."
    />
  );
}
