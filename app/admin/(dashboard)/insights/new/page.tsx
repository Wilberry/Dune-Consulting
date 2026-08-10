import Link from "next/link";
import { ArticleEditorForm } from "@/components/admin/article-editor-form";
import { requireStaffUser } from "@/lib/admin/auth";

export default async function NewInsightArticlePage() {
  await requireStaffUser();

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href="/admin/insights"
        className="text-navy decoration-amber text-sm font-bold underline decoration-2 underline-offset-4"
      >
        Back to Insights
      </Link>
      <div className="mt-6">
        <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
          New Insight
        </p>
        <h1 className="text-navy mt-2 text-3xl font-extrabold">
          Create article
        </h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          Start as a draft or publish immediately when the content has been
          reviewed and approved.
        </p>
      </div>
      <div className="mt-8">
        <ArticleEditorForm />
      </div>
    </div>
  );
}
