import "server-only";

import { createClient } from "@/lib/supabase/server";

export type ArticleStatus = "draft" | "published";

export type AdminArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImagePath: string | null;
  category: string;
  authorName: string;
  status: ArticleStatus;
  featured: boolean;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

const select =
  "id,title,slug,excerpt,content,cover_image_url,category,author_name,status,featured,seo_title,seo_description,published_at,created_at,updated_at";

function mapArticle(article: Record<string, unknown>): AdminArticle {
  return {
    id: String(article.id),
    title: String(article.title),
    slug: String(article.slug),
    excerpt: String(article.excerpt ?? ""),
    content: String(article.content ?? ""),
    coverImagePath: article.cover_image_url
      ? String(article.cover_image_url)
      : null,
    category: String(article.category ?? ""),
    authorName: String(article.author_name ?? ""),
    status: article.status as ArticleStatus,
    featured: Boolean(article.featured),
    seoTitle: String(article.seo_title ?? ""),
    seoDescription: String(article.seo_description ?? ""),
    publishedAt: article.published_at ? String(article.published_at) : null,
    createdAt: String(article.created_at),
    updatedAt: String(article.updated_at),
  };
}

export async function getAdminArticles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(select)
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);
  return (data ?? []).map((article) => mapArticle(article));
}

export async function getAdminArticle(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(select)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapArticle(data) : null;
}
