import { Search } from "lucide-react";
import { ArticleCard } from "@/components/ui/article-card";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { PageHero } from "@/components/ui/page-hero";
import { Tag } from "@/components/ui/primitives";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { articles } from "@/data/page-content";

export function InsightsPage() {
  const [featured, ...rest] = articles;
  const categories = [
    "All insights",
    "Event Safety",
    "HSE Training",
    "Safety Leadership",
    "Emergency Planning",
    "Personnel",
  ];
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Insights"
        title="Practical thinking for safer work and events."
        copy="Clear perspectives on risk management, HSE learning, operational safety and professional development."
        image="/images/insights/insights-hero.jpg"
      />
      <Section>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Featured Article"
            title="Ideas worth putting into practice"
          />
          <div className="border-line text-muted flex min-w-64 items-center gap-2 rounded-md border bg-white px-4 py-3 text-sm">
            <Search size={17} />
            <span>Search insights</span>
            <span className="sr-only">Search is not yet available</span>
          </div>
        </div>
        <article className="border-line bg-off-white mt-10 grid overflow-hidden rounded-2xl border shadow-lg lg:grid-cols-[1.1fr_.9fr]">
          <div className="aspect-[16/10] lg:aspect-auto">
            <ImagePlaceholder
              src={featured.image}
              alt={`Editorial image placeholder for ${featured.title}`}
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <Tag>{featured.category}</Tag>
            <h2 className="text-navy mt-5 text-3xl font-extrabold">
              {featured.title}
            </h2>
            <p className="text-muted mt-4 leading-7">{featured.excerpt}</p>
            <p className="text-muted mt-5 text-xs">{featured.date}</p>
            <Button
              href={`#${featured.slug}`}
              className="mt-6 self-start"
              arrow
            >
              Read article
            </Button>
          </div>
        </article>
      </Section>
      <Section className="bg-off-white">
        <div className="flex flex-wrap gap-2" aria-label="Article categories">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              disabled
              className={`rounded-full border px-4 py-2 text-xs font-bold ${index === 0 ? "border-navy bg-navy text-white" : "border-line text-muted bg-white"}`}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        <nav
          aria-label="Insights pagination"
          className="mt-10 flex justify-center gap-2"
        >
          <span
            aria-current="page"
            className="bg-navy flex size-10 items-center justify-center rounded-md text-sm font-bold text-white"
          >
            1
          </span>
          <button
            type="button"
            disabled
            className="border-line text-muted flex size-10 items-center justify-center rounded-md border bg-white text-sm"
          >
            2
          </button>
          <button
            type="button"
            disabled
            className="border-line text-muted rounded-md border bg-white px-4 text-sm"
          >
            Next
          </button>
        </nav>
      </Section>
    </main>
  );
}
