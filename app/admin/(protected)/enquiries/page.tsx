import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminEnquiriesPage() {
  await requireAdminUser();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("contact_enquiries")
    .select("id", { count: "exact", head: true });
  if (error) throw error;

  return (
    <SectionPlaceholder
      eyebrow="Operations"
      title={`Contact Enquiries (${count ?? 0})`}
      description="Private enquiry data is restricted to administrators through Supabase Row Level Security and server-side role checks."
      emptyTitle={(count ?? 0) === 0 ? "No stored enquiries yet" : "Enquiry storage is connected"}
      emptyCopy="The existing public contact flow remains unchanged in Phase One. Phase Two will store validated submissions here before email delivery."
    />
  );
}
