export type Testimonial = {
  id?: string;
  quote: string;
  name: string;
  role: string;
  image?: string;
  rating: number;
  sortOrder?: number;
  isActive?: boolean;
};

export const testimonialDefaultItems: Testimonial[] = [
  {
    quote:
      "The Dune HSE Mentorship Program gave me the confidence to apply safety decisions in real event and workplace environments. The coaching was practical, direct and easy to follow.",
    name: "Amina Yusuf",
    role: "HSE Graduate",
    image: "/images/executive_portrait.webp",
    rating: 5,
  },
  {
    quote:
      "Dune Consulting’s team helped us deliver a large conference with clarity and calm. Their event safety planning and on-site communication made the whole delivery far more reliable.",
    name: "Michael Ade",
    role: "Event Operations Manager",
    image: "/images/Hero.webp",
    rating: 5,
  },
  {
    quote:
      "Their practical training sessions were directly relevant to our crew and made immediate improvements to how we manage site risk and communicate expectations.",
    name: "Adaeze Okoro",
    role: "Safety Supervisor",
    image: "/images/dune_training_outdoor_high_quality.webp",
    rating: 4,
  },
];

export function normalizeTestimonials(
  items: Array<Partial<Testimonial> | null | undefined>,
): Testimonial[] {
  return items
    .map((item) => ({
      quote: String(item?.quote ?? "").trim(),
      name: String(item?.name ?? "").trim(),
      role: String(item?.role ?? "").trim(),
      image: String(item?.image ?? "").trim(),
      rating: Number(item?.rating ?? 0),
    }))
    .filter(
      (item) =>
        item.name.length > 0 &&
        item.role.length > 0 &&
        item.quote.length > 0 &&
        Number.isFinite(item.rating) &&
        item.rating >= 1 &&
        item.rating <= 5,
    )
    .map((item) => ({
      ...item,
      quote: item.quote.replace(/\s+/g, " "),
      name: item.name.replace(/\s+/g, " "),
      role: item.role.replace(/\s+/g, " "),
      image: item.image ? item.image.replace(/\s+/g, " ") : undefined,
    }));
}

export async function getTestimonialItems(): Promise<Testimonial[]> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, quote, name, role, image, rating, sort_order, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) throw error;

    const normalized = normalizeTestimonials(
      (data ?? []).map((item) => ({
        id: item.id,
        quote: item.quote,
        name: item.name,
        role: item.role,
        image: item.image,
        rating: item.rating,
        sortOrder: item.sort_order,
        isActive: item.is_active,
      })),
    );

    return normalized.length > 0 ? normalized : testimonialDefaultItems;
  } catch (error) {
    console.warn(
      "Unable to load testimonials from Supabase. Falling back to the default seed.",
      error,
    );
    return testimonialDefaultItems;
  }
}

export async function getAdminTestimonialItems(): Promise<Testimonial[]> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, quote, name, role, image, rating, sort_order, is_active")
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) throw error;

    return normalizeTestimonials(
      (data ?? []).map((item) => ({
        id: item.id,
        quote: item.quote,
        name: item.name,
        role: item.role,
        image: item.image,
        rating: item.rating,
        sortOrder: item.sort_order,
        isActive: item.is_active,
      })),
    );
  } catch (error) {
    console.warn(
      "Unable to load admin testimonials from Supabase. Falling back to the default seed.",
      error,
    );
    return testimonialDefaultItems;
  }
}
