import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleEditorForm } from "@/components/admin/article-editor-form";
import { requireStaffUser } from "@/lib/admin/auth";
import { getAdminArticle } from "@/lib/admin/articles";

type Props = { params: Promise<{ id: string }> };

export default async function EditInsightArticlePage({ params }: Props) {
  await requireStaffUser();
  const { id } = await params;
  const article = await getAdminArticle(id);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href="/admin/insights"
        className="text-navy decoration-amber text-sm font-bold underline decoration-2 underline-offset-4"
      >
        Back to Insights
      </Link>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Edit Insight
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">
            {article.title}
          </h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Update the article, SEO details, cover image and publishing state.
          </p>
        </div>
        {article.publishedAt && (
          <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-800">
            Published
          </span>
        )}
      </div>
      <div className="mt-8">
        <ArticleEditorForm article={article} />
      </div>
    </div>
  );
}
