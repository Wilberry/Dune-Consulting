import "server-only";

import { createClient } from "@/lib/supabase/server";

export type PublishedArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  authorName: string;
  featured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string;
  coverImagePath: string | null;
};

const articleSelect =
  "id,title,slug,excerpt,content,category,author_name,featured,seo_title,seo_description,published_at,cover_image_url";

function mapArticle(article: Record<string, unknown>): PublishedArticle {
  return {
    id: String(article.id),
    title: String(article.title),
    slug: String(article.slug),
    excerpt: String(article.excerpt ?? ""),
    content: String(article.content ?? ""),
    category: String(article.category ?? "HSE Insight"),
    authorName: String(article.author_name ?? "Dune Consulting"),
    featured: Boolean(article.featured),
    seoTitle: article.seo_title ? String(article.seo_title) : null,
    seoDescription: article.seo_description
      ? String(article.seo_description)
      : null,
    publishedAt: String(article.published_at),
    coverImagePath: article.cover_image_url
      ? String(article.cover_image_url)
      : null,
  };
}

export async function getPublishedArticles(limit = 50) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .not("published_at", "is", null)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map((article) => mapArticle(article));
}

export async function getPublishedArticleBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select(articleSelect)
    .eq("status", "published")
    .eq("slug", slug)
    .not("published_at", "is", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapArticle(data) : null;
}

export function getArticleCoverUrl(article: Pick<PublishedArticle, "slug" | "coverImagePath">) {
  return article.coverImagePath
    ? `/api/insights/${encodeURIComponent(article.slug)}/cover`
    : "/images/insights/insights-hero.jpg";
}

export function formatArticleDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(value));
}
