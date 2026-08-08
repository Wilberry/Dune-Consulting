import { SectionFoundation } from "@/components/admin/section-foundation";
import { requireAdminUser } from "@/lib/admin/auth";
import { getSectionCount } from "@/lib/admin/dashboard";

export default async function AdminEnquiriesPage() {
  await requireAdminUser();
  let count: number | null = null;
  let error = false;

  try {
    count = await getSectionCount("contact_enquiries");
  } catch {
    error = true;
  }

  return (
    <SectionFoundation
      eyebrow="Client Requests"
      title="Contact Enquiries"
      description="Incoming consultation and contact enquiries will be managed here once the existing public form is connected to Supabase in Phase Two."
      count={count}
      countLabel="Stored contact enquiries"
      error={error}
    />
  );
}
