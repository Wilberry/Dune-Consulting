import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminUser } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

export default async function AdminNewsletterPage() {
  await requireAdminUser();
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("newsletter_subscribers")
    .select("id", { count: "exact", head: true })
    .eq("status", "subscribed");
  if (error) throw error;

  return (
    <SectionPlaceholder
      eyebrow="Audience"
      title={`Newsletter Subscribers (${count ?? 0})`}
      description="Subscriber storage is provider-neutral in Phase One. No bulk sending service or campaign tooling has been introduced."
      emptyTitle={(count ?? 0) === 0 ? "No subscribers stored yet" : "Subscriber storage is connected"}
      emptyCopy="The public newsletter form and any future delivery provider can be connected to this table without changing the admin architecture."
    />
  );
}
