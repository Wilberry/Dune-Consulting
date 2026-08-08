import { SectionFoundation } from "@/components/admin/section-foundation";
import { getSectionCount } from "@/lib/admin/dashboard";

export default async function AdminInsightsPage() {
  let count: number | null = null;
  let error = false;

  try {
    count = await getSectionCount("articles");
  } catch {
    error = true;
  }

  return (
    <SectionFoundation
      eyebrow="Content"
      title="Insights"
      description="The secure content-management foundation is ready for Dune articles. The full editor, publishing controls and image workflow are intentionally deferred to the Insights phase."
      count={count}
      countLabel="Total article records"
      error={error}
    />
  );
}
