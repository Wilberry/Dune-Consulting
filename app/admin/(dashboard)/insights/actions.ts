"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireStaffUser } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { articleEditorSchema } from "@/lib/validations";

export type ArticleActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const idSchema = z.uuid();
const MAX_COVER_BYTES = 5 * 1024 * 1024;
const ALLOWED_COVER_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function nullable(value?: string) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function safeFileName(name: string) {
  const normalized = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return normalized || "cover-image";
}

function parseArticle(formData: FormData) {
  return articleEditorSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    category: formData.get("category"),
    authorName: formData.get("authorName"),
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
  });
}

function validateCover(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) return null;
  if (file.size > MAX_COVER_BYTES) {
    return "Cover image must be 5 MB or smaller.";
  }
  if (!ALLOWED_COVER_TYPES.has(file.type)) {
    return "Cover image must be JPEG, PNG, WebP or AVIF.";
  }
  return null;
}

async function uploadCover(
  articleId: string,
  file: File,
  previousPath: string | null,
) {
  const supabase = await createClient();
  const path = `${articleId}/${Date.now()}-${safeFileName(file.name)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabase.storage.from("insights").upload(path, bytes, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message);

  if (previousPath) {
    await supabase.storage.from("insights").remove([previousPath]);
  }
  return path;
}

export async function saveArticle(
  _previousState: ArticleActionState,
  formData: FormData,
): Promise<ArticleActionState> {
  await requireStaffUser();

  const parsed = parseArticle(formData);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted article fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const coverError = validateCover(formData.get("cover"));
  if (coverError) return { status: "error", message: coverError };

  const suppliedId = formData.get("id");
  const articleId = suppliedId ? idSchema.safeParse(suppliedId) : null;
  if (suppliedId && !articleId?.success) {
    return { status: "error", message: "Invalid article identifier." };
  }

  const supabase = await createClient();
  const existingId = articleId?.success ? articleId.data : null;
  let existingCover: string | null = null;
  let existingPublishedAt: string | null = null;

  if (existingId) {
    const { data, error } = await supabase
      .from("articles")
      .select("cover_image_url,published_at")
      .eq("id", existingId)
      .maybeSingle();
    if (error || !data) {
      return { status: "error", message: "The article could not be loaded." };
    }
    existingCover = data.cover_image_url;
    existingPublishedAt = data.published_at;
  }

  const values = parsed.data;
  const publishedAt =
    values.status === "published"
      ? existingPublishedAt || new Date().toISOString()
      : null;
  const payload = {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt,
    content: values.content,
    category: values.category,
    author_name: values.authorName,
    status: values.status,
    featured: values.featured,
    seo_title: nullable(values.seoTitle),
    seo_description: nullable(values.seoDescription),
    published_at: publishedAt,
  };

  let id = existingId;
  if (id) {
    const { error } = await supabase.from("articles").update(payload).eq("id", id);
    if (error) {
      return {
        status: "error",
        message:
          error.code === "23505"
            ? "That article slug is already in use."
            : "The article could not be saved.",
      };
    }
  } else {
    const { data, error } = await supabase
      .from("articles")
      .insert(payload)
      .select("id")
      .single();
    if (error || !data) {
      return {
        status: "error",
        message:
          error?.code === "23505"
            ? "That article slug is already in use."
            : "The article could not be created.",
      };
    }
    id = data.id;
  }

  const cover = formData.get("cover");
  if (cover instanceof File && cover.size > 0) {
    try {
      const coverPath = await uploadCover(id, cover, existingCover);
      const { error } = await supabase
        .from("articles")
        .update({ cover_image_url: coverPath })
        .eq("id", id);
      if (error) throw new Error(error.message);
    } catch {
      if (!existingId) await supabase.from("articles").delete().eq("id", id);
      return {
        status: "error",
        message: "The cover image could not be stored. Please try again.",
      };
    }
  }

  if (values.featured) {
    await supabase
      .from("articles")
      .update({ featured: false })
      .neq("id", id)
      .eq("featured", true);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/insights");
  revalidatePath("/insights");
  revalidatePath(`/insights/${values.slug}`);
  redirect(`/admin/insights/${id}?saved=1`);
}

export async function deleteArticle(formData: FormData) {
  await requireStaffUser();
  const parsedId = idSchema.safeParse(formData.get("id"));
  if (!parsedId.success) throw new Error("Invalid article identifier.");

  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("cover_image_url,slug")
    .eq("id", parsedId.data)
    .maybeSingle();

  const { error } = await supabase
    .from("articles")
    .delete()
    .eq("id", parsedId.data);
  if (error) throw new Error(error.message);

  if (data?.cover_image_url) {
    await supabase.storage.from("insights").remove([data.cover_image_url]);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/insights");
  revalidatePath("/insights");
  if (data?.slug) revalidatePath(`/insights/${data.slug}`);
}
