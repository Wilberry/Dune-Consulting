"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireStaffUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";

const faqSchema = z.object({
  id: z.string().uuid().optional(),
  question: z
    .string()
    .trim()
    .min(6, "Ask a clearer question that is at least 6 characters long.")
    .max(220, "Keep the question under 220 characters."),
  answer: z
    .string()
    .trim()
    .min(12, "Write a full answer with at least 12 characters.")
    .max(2000, "Keep the answer under 2000 characters."),
});

export type FAQActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function saveFaqItem(
  _previousState: FAQActionState,
  formData: FormData,
): Promise<FAQActionState> {
  await requireStaffUser();

  const parsed = faqSchema.safeParse({
    id: formData.get("id") || undefined,
    question: formData.get("question"),
    answer: formData.get("answer"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Review the FAQ fields.",
    };
  }

  const supabase = await createClient();
  const payload = {
    question: parsed.data.question,
    answer: parsed.data.answer,
  };

  try {
    if (parsed.data.id) {
      const { error } = await supabase
        .from("faq_items")
        .update(payload)
        .eq("id", parsed.data.id);

      if (error) throw error;
    } else {
      const { data: existingItems, error: listError } = await supabase
        .from("faq_items")
        .select("sort_order")
        .order("sort_order", { ascending: true });

      if (listError) throw listError;

      const nextSortOrder =
        (existingItems ?? []).reduce((max, item) => {
          const value = Number(item.sort_order ?? 0);
          return Math.max(max, value);
        }, 0) + 1;

      const { error } = await supabase.from("faq_items").insert([
        {
          ...payload,
          sort_order: nextSortOrder,
          is_active: true,
        },
      ]);

      if (error) throw error;
    }

    revalidatePath("/admin/faq");
    revalidatePath("/");
    return {
      status: "success",
      message: parsed.data.id ? "FAQ item updated." : "FAQ item created.",
    };
  } catch (error) {
    console.error("FAQ item save failed", error);
    return {
      status: "error",
      message: "The FAQ item could not be saved. Please try again.",
    };
  }
}

export async function deleteFaqItem(formData: FormData): Promise<void> {
  await requireStaffUser();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("faq_items").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/faq");
    revalidatePath("/");
  } catch (error) {
    console.error("FAQ item deletion failed", error);
  }
}
