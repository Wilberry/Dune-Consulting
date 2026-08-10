import Link from "next/link";
import { deleteArticle } from "@/app/admin/(dashboard)/insights/actions";
import { requireStaffUser } from "@/lib/admin/auth";
import { getAdminArticles } from "@/lib/admin/articles";

function formatDate(value: string | null) {
  if (!value) return "Not published";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminInsightsPage() {
  await requireStaffUser();

  let articles: Awaited<ReturnType<typeof getAdminArticles>> = [];
  let loadError = false;

  try {
    articles = await getAdminArticles();
  } catch {
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Content
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">Insights</h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Create, edit, feature and publish practical HSE articles for the
            public Insights library.
          </p>
        </div>
        <Link
          href="/admin/insights/new"
          className="bg-amber text-deep-navy hover:bg-amber-hover inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-extrabold"
        >
          New article
        </Link>
      </div>

      <div className="border-line mt-7 inline-flex rounded-lg border bg-white px-4 py-3 text-sm">
        <span className="text-muted">Article records</span>{" "}
        <strong className="text-navy ml-1">{articles.length}</strong>
      </div>

      {loadError ? (
        <div
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          role="alert"
        >
          Articles could not be loaded. Check the Supabase connection and try
          again.
        </div>
      ) : articles.length === 0 ? (
        <div className="border-line mt-8 rounded-xl border bg-white p-8 text-center">
          <h2 className="text-navy text-lg font-bold">No articles yet</h2>
          <p className="text-muted mt-2 text-sm">
            Create the first Dune Insight as a draft, review it, then publish it
            when ready.
          </p>
        </div>
      ) : (
        <div className="border-line mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="divide-line divide-y">
            {articles.map((article) => (
              <article
                key={article.id}
                className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        article.status === "published"
                          ? "bg-green-50 text-green-800"
                          : "bg-off-white text-navy"
                      }`}
                    >
                      {article.status}
                    </span>
                    {article.featured && (
                      <span className="bg-amber/20 text-deep-navy rounded-full px-3 py-1 text-xs font-bold">
                        Featured
                      </span>
                    )}
                    <span className="text-muted text-xs">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-navy mt-3 text-xl font-extrabold">
                    {article.title}
                  </h2>
                  <p className="text-muted mt-2 line-clamp-2 text-sm leading-6">
                    {article.excerpt}
                  </p>
                  <div className="text-muted mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                    <span>/insights/{article.slug}</span>
                    <span>Updated {formatDate(article.updatedAt)}</span>
                    <span>Published {formatDate(article.publishedAt)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  {article.status === "published" && (
                    <Link
                      href={`/insights/${article.slug}`}
                      target="_blank"
                      rel="noopener"
                      className="border-line text-navy rounded-md border px-4 py-2 text-sm font-bold"
                    >
                      View
                    </Link>
                  )}
                  <Link
                    href={`/admin/insights/${article.id}`}
                    className="bg-navy hover:bg-deep-navy rounded-md px-4 py-2 text-sm font-bold text-white"
                  >
                    Edit
                  </Link>
                  <form action={deleteArticle}>
                    <input type="hidden" name="id" value={article.id} />
                    <button
                      type="submit"
                      className="rounded-md border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
