import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/primitives";
import { StructuredData } from "@/components/seo/structured-data";
import { company } from "@/data/company";
import {
  formatArticleDate,
  getArticleCoverUrl,
  getPublishedArticleBySlug,
} from "@/lib/insights/articles";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return {};

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.excerpt;
  const path = `/insights/${article.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title,
      description,
      publishedTime: article.publishedAt,
      authors: [article.authorName],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function InsightArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Person",
      name: article.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: company.name,
      url: company.websiteUrl,
    },
    mainEntityOfPage: `${company.websiteUrl}/insights/${article.slug}`,
  };

  return (
    <main id="main-content">
      <StructuredData data={schema} />
      <section className="bg-off-white py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <Link
              href="/insights"
              className="text-navy decoration-amber text-sm font-bold underline decoration-2 underline-offset-4"
            >
              Back to Insights
            </Link>
            <div className="mt-6 flex justify-center">
              <Tag>{article.category}</Tag>
            </div>
            <h1 className="text-navy mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {article.title}
            </h1>
            <p className="text-muted mx-auto mt-5 max-w-3xl text-lg leading-8">
              {article.excerpt}
            </p>
            <div className="text-muted mt-6 flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
              <span>{formatArticleDate(article.publishedAt)}</span>
              <span>By {article.authorName}</span>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl shadow-lg">
            <div className="aspect-[16/9]">
              <ImagePlaceholder
                src={getArticleCoverUrl(article)}
                alt={`Cover image for ${article.title}`}
              />
            </div>
          </div>

          <article className="mx-auto max-w-3xl py-12 sm:py-16">
            <div className="text-ink space-y-6 text-[1.05rem] leading-8">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${article.id}-${index}`}
                  className="whitespace-pre-line"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        </Container>
      </section>
    </main>
  );
}
