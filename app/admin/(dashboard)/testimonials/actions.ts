"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaffUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

const testimonialSchema = z.object({
  id: z.string().uuid().optional(),
  name: z
    .string()
    .trim()
    .min(2, "Add the client name.")
    .max(120, "Keep the name under 120 characters."),
  role: z
    .string()
    .trim()
    .min(2, "Add the client title or role.")
    .max(120, "Keep the role under 120 characters."),
  quote: z
    .string()
    .trim()
    .min(20, "The review should include useful detail.")
    .max(800, "Keep the review under 800 characters."),
  image: z
    .string()
    .trim()
    .max(500, "Use a shorter image URL.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  rating: z.coerce.number().int().min(1).max(5),
});

export type TestimonialActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function saveTestimonial(
  _previousState: TestimonialActionState,
  formData: FormData,
): Promise<TestimonialActionState> {
  await requireStaffUser();

  const parsed = testimonialSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    role: formData.get("role"),
    quote: formData.get("quote"),
    image: formData.get("image"),
    rating: formData.get("rating"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Review the testimonial fields.",
    };
  }

  const supabase = await createClient();
  const payload = {
    name: parsed.data.name,
    role: parsed.data.role,
    quote: parsed.data.quote,
    image: parsed.data.image ?? null,
    rating: parsed.data.rating,
  };

  try {
    if (parsed.data.id) {
      const { error } = await supabase
        .from("testimonials")
        .update(payload)
        .eq("id", parsed.data.id);

      if (error) throw error;
    } else {
      const { data: existingItems, error: listError } = await supabase
        .from("testimonials")
        .select("sort_order")
        .order("sort_order", { ascending: true });

      if (listError) throw listError;

      const nextSortOrder =
        (existingItems ?? []).reduce((max, item) => {
          const value = Number(item.sort_order ?? 0);
          return Math.max(max, value);
        }, 0) + 1;

      const { error } = await supabase.from("testimonials").insert([
        {
          ...payload,
          sort_order: nextSortOrder,
          is_active: true,
        },
      ]);

      if (error) throw error;
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return {
      status: "success",
      message: parsed.data.id ? "Client feedback updated." : "Client feedback created.",
    };
  } catch (error) {
    console.error("Testimonial save failed", error);
    return {
      status: "error",
      message: "The client feedback could not be saved. Please try again.",
    };
  }
}

export async function deleteTestimonial(formData: FormData): Promise<void> {
  await requireStaffUser();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
  } catch (error) {
    console.error("Testimonial deletion failed", error);
  }
}
