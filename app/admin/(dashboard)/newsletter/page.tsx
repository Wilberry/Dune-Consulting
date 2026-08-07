import { SectionFoundation } from "@/components/admin/section-foundation";
import { requireAdminUser } from "@/lib/admin/auth";
import { getSectionCount } from "@/lib/admin/dashboard";

export default async function AdminNewsletterPage() {
  await requireAdminUser();
  let count: number | null = null;
  let error = false;

  try {
    count = await getSectionCount("newsletter_subscribers");
  } catch {
    error = true;
  }

  return (
    <SectionFoundation
      eyebrow="Audience"
      title="Newsletter"
      description="Subscriber storage is established in Supabase. Sending campaigns and connecting an external delivery provider are deliberately outside Phase One."
      count={count}
      countLabel="Stored newsletter subscribers"
      error={error}
    />
  );
}
