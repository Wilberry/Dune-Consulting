import { FAQManager } from "@/components/admin/faq-manager";
import { requireStaffUser } from "@/lib/admin/auth";
import { getAdminFaqItems } from "@/lib/faq";

export default async function FAQAdminPage() {
  await requireStaffUser();
  const items = await getAdminFaqItems();

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
        Website content
      </p>
      <h1 className="text-navy mt-2 text-3xl font-extrabold sm:text-4xl">
        FAQ management
      </h1>
      <p className="text-muted mt-3 max-w-2xl leading-7">
        Add new questions, edit existing answers and keep the homepage FAQ aligned
        with the current service offers and client needs.
      </p>

      <div className="mt-8">
        <FAQManager items={items} />
      </div>
    </div>
  );
}
