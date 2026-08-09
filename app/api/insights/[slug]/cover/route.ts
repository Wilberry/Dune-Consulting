import { createAdminClient } from "@/lib/supabase/admin";

type Props = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const { data: article, error } = await supabase
    .from("articles")
    .select("cover_image_url")
    .eq("slug", slug)
    .eq("status", "published")
    .not("published_at", "is", null)
    .maybeSingle();

  if (error || !article?.cover_image_url) {
    return new Response("Not found", { status: 404 });
  }

  const { data: file, error: storageError } = await supabase.storage
    .from("insights")
    .download(article.cover_image_url);

  if (storageError || !file) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(file, {
    status: 200,
    headers: {
      "Content-Type": file.type || "application/octet-stream",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
