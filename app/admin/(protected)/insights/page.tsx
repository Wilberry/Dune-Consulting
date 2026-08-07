import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireStaffUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminInsightsPage() {
  await requireStaffUser();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("articles")
    .select("id", { count: "exact", head: true });

  if (error) throw error;

  return (
    <SectionPlaceholder
      eyebrow="Content"
      title={`Insights (${count ?? 0})`}
      description="The secure content-management foundation is connected. Full article creation, editing, publishing and media workflows are intentionally deferred to Phase Two."
      emptyTitle={(count ?? 0) === 0 ? "No Insights in Supabase yet" : "Insights data is connected"}
      emptyCopy={(count ?? 0) === 0 ? "Published and draft articles will appear here once the Phase Two content workflow is enabled." : "The database is live. Phase Two will add the management table and editor without changing the public design."}
    />
  );
}
