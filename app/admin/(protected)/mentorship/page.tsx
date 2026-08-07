import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminMentorshipPage() {
  await requireAdminUser();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("mentorship_applications")
    .select("id", { count: "exact", head: true });
  if (error) throw error;

  return (
    <SectionPlaceholder
      eyebrow="Program"
      title={`Mentorship Applications (${count ?? 0})`}
      description="The application storage and role-protected admin route are ready without changing the current public mentorship page."
      emptyTitle={(count ?? 0) === 0 ? "No mentorship applications yet" : "Application storage is connected"}
      emptyCopy="The dedicated mentorship application form and review workflow will be added in a later phase, as planned."
    />
  );
}
