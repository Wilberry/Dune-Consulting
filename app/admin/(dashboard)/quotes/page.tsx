import { SectionFoundation } from "@/components/admin/section-foundation";
import { requireAdminUser } from "@/lib/admin/auth";
import { getSectionCount } from "@/lib/admin/dashboard";

export default async function AdminQuotesPage() {
  await requireAdminUser();
  let count: number | null = null;
  let error = false;

  try {
    count = await getSectionCount("quote_requests");
  } catch {
    error = true;
  }

  return (
    <SectionFoundation
      eyebrow="Commercial Requests"
      title="Quote Requests"
      description="Dedicated quote requests will be stored and managed here after the public quote workflow is introduced in Phase Two."
      count={count}
      countLabel="Stored quote requests"
      error={error}
    />
  );
}
