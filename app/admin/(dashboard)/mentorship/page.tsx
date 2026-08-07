import { SectionFoundation } from "@/components/admin/section-foundation";
import { requireAdminUser } from "@/lib/admin/auth";
import { getSectionCount } from "@/lib/admin/dashboard";

export default async function AdminMentorshipPage() {
  await requireAdminUser();
  let count: number | null = null;
  let error = false;

  try {
    count = await getSectionCount("mentorship_applications");
  } catch {
    error = true;
  }

  return (
    <SectionFoundation
      eyebrow="Programme Applications"
      title="Mentorship Applications"
      description="The database and protected management route are ready. A dedicated public mentorship application form will be added in a later phase."
      count={count}
      countLabel="Stored mentorship applications"
      error={error}
    />
  );
}
