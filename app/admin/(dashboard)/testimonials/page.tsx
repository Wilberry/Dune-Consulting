import { TestimonialManager } from "@/components/admin/testimonial-manager";
import { requireStaffUser } from "@/lib/admin/auth";
import { getAdminTestimonialItems } from "@/lib/testimonials";

export default async function TestimonialAdminPage() {
  await requireStaffUser();
  const items = await getAdminTestimonialItems();

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
        Website content
      </p>
      <h1 className="text-navy mt-2 text-3xl font-extrabold sm:text-4xl">
        Client feedback management
      </h1>
      <p className="text-muted mt-3 max-w-2xl leading-7">
        Update the client feedback section with the latest reviews, profile image,
        client role, star rating and written experience.
      </p>

      <div className="mt-8">
        <TestimonialManager items={items} />
      </div>
    </div>
  );
}
