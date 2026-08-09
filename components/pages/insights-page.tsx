import { ArticleCard } from "@/components/ui/article-card";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { PageHero } from "@/components/ui/page-hero";
import { Tag } from "@/components/ui/primitives";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  formatArticleDate,
  getArticleCoverUrl,
  getPublishedArticles,
} from "@/lib/insights/articles";

export async function InsightsPage() {
  let articles: Awaited<ReturnType<typeof getPublishedArticles>> = [];
  let unavailable = false;

  try {
    articles = await getPublishedArticles();
  } catch {
    unavailable = true;
  }

  const [featured, ...rest] = articles;
  const categories = Array.from(
    new Set(articles.map((article) => article.category).filter(Boolean)),
  );

  return (
    <main id="main-content">
      <PageHero
        eyebrow="Insights"
        title="Practical thinking for safer work and events."
        copy="Clear perspectives on risk management, HSE learning, operational safety and professional development."
        image="/images/insights/insights-hero.jpg"
      />

      {unavailable ? (
        <Section>
          <div className="border-line mx-auto max-w-3xl rounded-xl border bg-white p-8 text-center">
            <h2 className="text-navy text-2xl font-extrabold">
              Insights are temporarily unavailable
            </h2>
            <p className="text-muted mt-3 leading-7">
              Please check back shortly. Dune Consulting&apos;s published safety
              guidance will appear here once the content service is available.
            </p>
          </div>
        </Section>
      ) : articles.length === 0 ? (
        <Section>
          <div className="mx-auto max-w-3xl text-center">
            <SectionHeading
              align="center-all"
              eyebrow="Insights"
              title="New practical guidance is being prepared"
            />
            <p className="text-muted mx-auto mt-5 max-w-2xl leading-7">
              Dune Consulting is preparing practical HSE articles for safer
              workplaces, events and professional development.
            </p>
          </div>
        </Section>
      ) : (
        <>
          <Section>
            <SectionHeading
              eyebrow="Featured Article"
              title="Ideas worth putting into practice"
            />
            <article className="border-line bg-off-white mt-10 grid overflow-hidden rounded-2xl border shadow-lg lg:grid-cols-[1.1fr_.9fr]">
              <div className="aspect-[16/10] lg:aspect-auto">
                <ImagePlaceholder
                  src={getArticleCoverUrl(featured)}
                  alt={`Cover image for ${featured.title}`}
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <Tag>{featured.category}</Tag>
                <h2 className="text-navy mt-5 text-3xl font-extrabold">
                  {featured.title}
                </h2>
                <p className="text-muted mt-4 leading-7">{featured.excerpt}</p>
                <div className="text-muted mt-5 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span>{formatArticleDate(featured.publishedAt)}</span>
                  <span>By {featured.authorName}</span>
                </div>
                <Button
                  href={`/insights/${featured.slug}`}
                  className="mt-6 self-start"
                  arrow
                >
                  Read article
                </Button>
              </div>
            </article>
          </Section>

          <Section className="bg-off-white">
            {categories.length > 0 && (
              <div
                className="flex flex-wrap justify-center gap-2"
                aria-label="Published article categories"
              >
                {categories.map((category) => (
                  <span
                    key={category}
                    className="border-line text-navy rounded-full border bg-white px-4 py-2 text-xs font-bold"
                  >
                    {category}
                  </span>
                ))}
              </div>
            )}
            {rest.length > 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={{
                      slug: article.slug,
                      title: article.title,
                      excerpt: article.excerpt,
                      category: article.category,
                      date: formatArticleDate(article.publishedAt),
                      image: getArticleCoverUrl(article),
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-muted mt-8 text-center text-sm">
                More published Insights will appear here as the library grows.
              </p>
            )}
          </Section>
        </>
      )}
    </main>
  );
}
