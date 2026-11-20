import { FAQManager } from "@/components/admin/faq-manager";
import { requireStaffUser } from "@/lib/admin/auth";
import { getAdminFaqItems, type FAQItem } from "@/lib/faq";

export default async function FAQAdminPage() {
  await requireStaffUser();
  let items: FAQItem[] = [];
  let loadError = false;
  try {
    items = await getAdminFaqItems();
  } catch (error) {
    console.error("Admin FAQ records could not be loaded", error);
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
        Website content
      </p>
      <h1 className="text-navy mt-2 text-3xl font-extrabold sm:text-4xl">
        FAQ management
      </h1>
      <p className="text-muted mt-3 max-w-2xl leading-7">
        Add new questions, edit existing answers and keep the homepage FAQ
        aligned with the current service offers and client needs.
      </p>

      <div className="mt-8">
        {loadError ? (
          <p
            className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800"
            role="alert"
          >
            FAQ records could not be loaded. Check the Supabase connection and
            apply the pending database migrations before editing FAQ content.
          </p>
        ) : (
          <FAQManager items={items} />
        )}
      </div>
    </div>
  );
}
