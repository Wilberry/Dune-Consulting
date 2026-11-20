"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaffUser } from "@/lib/admin/auth";
import type { AdminActionState } from "@/lib/admin/action-state";
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

const testimonialPhotoBucket = "testimonial-photos";
const maxPhotoBytes = 5 * 1024 * 1024;
const photoExtensions: Record<string, string> = {
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
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

  const photoEntry = formData.get("imageFile");
  const photo =
    photoEntry instanceof File && photoEntry.size > 0 ? photoEntry : null;
  if (photoEntry && typeof photoEntry === "string" && photoEntry.length > 0) {
    return { status: "error", message: "Choose a valid profile photo." };
  }
  if (photo && photo.size > maxPhotoBytes) {
    return {
      status: "error",
      message: "Profile photos must be 5 MB or smaller.",
    };
  }
  if (photo && !photoExtensions[photo.type]) {
    return {
      status: "error",
      message: "Profile photos must be JPEG, PNG, WebP or AVIF.",
    };
  }

  if (!parsed.success) {
    return {
      status: "error",
      message:
        parsed.error.issues[0]?.message ?? "Review the testimonial fields.",
    };
  }

  const supabase = await createClient();
  let uploadedPath: string | null = null;
  try {
    let image = parsed.data.image ?? null;
    if (photo) {
      const photoPath = `avatars/${crypto.randomUUID()}.${photoExtensions[photo.type]}`;
      const { error: uploadError } = await supabase.storage
        .from(testimonialPhotoBucket)
        .upload(photoPath, new Uint8Array(await photo.arrayBuffer()), {
          cacheControl: "3600",
          contentType: photo.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;
      uploadedPath = photoPath;
      image = supabase.storage
        .from(testimonialPhotoBucket)
        .getPublicUrl(photoPath).data.publicUrl;
    }

    const payload = {
      name: parsed.data.name,
      role: parsed.data.role,
      quote: parsed.data.quote,
      image,
      rating: parsed.data.rating,
    };

    if (parsed.data.id) {
      const { data: updatedItem, error } = await supabase
        .from("testimonials")
        .update(payload)
        .eq("id", parsed.data.id)
        .select("id")
        .maybeSingle();

      if (error) throw error;
      if (!updatedItem) {
        throw new Error("Client feedback was not found or accessible.");
      }
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

      const { error } = await supabase
        .from("testimonials")
        .insert({
          ...payload,
          sort_order: nextSortOrder,
          is_active: true,
        })
        .select("id")
        .single();

      if (error) throw error;
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return {
      status: "success",
      message: parsed.data.id
        ? "Client feedback updated."
        : "Client feedback created.",
    };
  } catch (error) {
    console.error("Testimonial save failed", error);
    if (uploadedPath) {
      const { error: cleanupError } = await supabase.storage
        .from(testimonialPhotoBucket)
        .remove([uploadedPath]);
      if (cleanupError) {
        console.error(
          "Uploaded testimonial photo cleanup failed",
          cleanupError.message,
        );
      }
    }
    return {
      status: "error",
      message: "The client feedback could not be saved. Please try again.",
    };
  }
}

export async function deleteTestimonial(
  _previousState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireStaffUser();

  const parsedId = z.uuid().safeParse(formData.get("id"));
  if (!parsedId.success) {
    return {
      status: "error",
      message: "This feedback entry has an invalid ID.",
    };
  }

  try {
    const supabase = await createClient();
    const { data: deletedItem, error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", parsedId.data)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!deletedItem) {
      return {
        status: "error",
        message: "Feedback was not found or could not be deleted.",
      };
    }

    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { status: "success", message: "Feedback deleted." };
  } catch (error) {
    console.error("Testimonial deletion failed", error);
    return {
      status: "error",
      message: "Feedback could not be deleted. Please try again.",
    };
  }
}
