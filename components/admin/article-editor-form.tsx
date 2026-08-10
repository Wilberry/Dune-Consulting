"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  saveArticle,
  type ArticleActionState,
} from "@/app/admin/(dashboard)/insights/actions";
import type { AdminArticle } from "@/lib/admin/articles";

const initialState: ArticleActionState = { status: "idle" };
const control =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-amber/30";

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ArticleEditorForm({ article }: { article?: AdminArticle }) {
  const [state, action, pending] = useActionState(saveArticle, initialState);
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article?.slug));

  function errorFor(field: string) {
    return state.fieldErrors?.[field]?.[0];
  }

  return (
    <form action={action} encType="multipart/form-data" className="space-y-7">
      {article && <input type="hidden" name="id" value={article.id} />}

      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Field
            label="Article title"
            htmlFor="article-title"
            error={errorFor("title")}
          >
            <input
              id="article-title"
              name="title"
              className={control}
              defaultValue={article?.title}
              required
              maxLength={160}
              onChange={(event) => {
                if (!slugTouched) setSlug(toSlug(event.currentTarget.value));
              }}
            />
          </Field>

          <Field label="Slug" htmlFor="article-slug" error={errorFor("slug")}>
            <input
              id="article-slug"
              name="slug"
              className={control}
              value={slug}
              required
              maxLength={160}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(toSlug(event.currentTarget.value));
              }}
            />
            <p className="text-muted mt-2 text-xs">
              Public URL: /insights/{slug || "your-article-slug"}
            </p>
          </Field>

          <Field
            label="Excerpt"
            htmlFor="article-excerpt"
            error={errorFor("excerpt")}
          >
            <textarea
              id="article-excerpt"
              name="excerpt"
              className={control}
              rows={4}
              defaultValue={article?.excerpt}
              required
              maxLength={320}
            />
          </Field>

          <Field
            label="Article body"
            htmlFor="article-content"
            error={errorFor("content")}
          >
            <textarea
              id="article-content"
              name="content"
              className={`${control} min-h-[420px] font-mono text-sm leading-7`}
              defaultValue={article?.content}
              required
              maxLength={50000}
            />
            <p className="text-muted mt-2 text-xs">
              Separate paragraphs with a blank line. The public article
              preserves paragraph breaks and line spacing.
            </p>
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="SEO title"
              htmlFor="article-seo-title"
              error={errorFor("seoTitle")}
            >
              <input
                id="article-seo-title"
                name="seoTitle"
                className={control}
                defaultValue={article?.seoTitle}
                maxLength={70}
              />
            </Field>
            <Field
              label="SEO description"
              htmlFor="article-seo-description"
              error={errorFor("seoDescription")}
            >
              <textarea
                id="article-seo-description"
                name="seoDescription"
                className={control}
                rows={3}
                defaultValue={article?.seoDescription}
                maxLength={160}
              />
            </Field>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border-line rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-navy font-extrabold">Publishing</h2>
            <Field
              label="Status"
              htmlFor="article-status"
              error={errorFor("status")}
            >
              <select
                id="article-status"
                name="status"
                className={control}
                defaultValue={article?.status ?? "draft"}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </Field>
            <label className="mt-5 flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={article?.featured}
                className="accent-navy mt-1 size-4"
              />
              <span>
                <strong className="text-navy block">Featured article</strong>
                <span className="text-muted mt-1 block leading-5">
                  Featuring this article automatically removes the featured flag
                  from other articles.
                </span>
              </span>
            </label>
          </div>

          <div className="border-line rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-navy font-extrabold">Article details</h2>
            <Field
              label="Category"
              htmlFor="article-category"
              error={errorFor("category")}
            >
              <input
                id="article-category"
                name="category"
                className={control}
                defaultValue={article?.category ?? "Safety Leadership"}
                required
                maxLength={100}
              />
            </Field>
            <Field
              label="Author"
              htmlFor="article-author"
              error={errorFor("authorName")}
            >
              <input
                id="article-author"
                name="authorName"
                className={control}
                defaultValue={article?.authorName ?? "Dune Consulting"}
                required
                maxLength={120}
              />
            </Field>
          </div>

          <div className="border-line rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-navy font-extrabold">Cover image</h2>
            <input
              type="file"
              name="cover"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="text-ink file:bg-off-white mt-4 block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-2 file:font-semibold"
            />
            <p className="text-muted mt-2 text-xs leading-5">
              JPEG, PNG, WebP or AVIF. Maximum 5 MB.
              {article?.coverImagePath
                ? " Uploading a new file replaces the current cover."
                : " A default Insights image is used until a cover is uploaded."}
            </p>
          </div>

          <button
            type="submit"
            disabled={pending}
            className="bg-amber text-deep-navy hover:bg-amber-hover min-h-12 w-full rounded-md px-5 py-3 font-extrabold disabled:cursor-wait disabled:opacity-60"
          >
            {pending
              ? "Saving article…"
              : article
                ? "Save article"
                : "Create article"}
          </button>

          {article?.status === "published" && (
            <Link
              href={`/insights/${article.slug}`}
              target="_blank"
              rel="noopener"
              className="border-line text-navy block rounded-md border bg-white px-5 py-3 text-center text-sm font-bold"
            >
              View published article
            </Link>
          )}
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 first:mt-0">
      <label htmlFor={htmlFor} className="text-navy text-sm font-bold">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-700">{error}</p>}
    </div>
  );
}
