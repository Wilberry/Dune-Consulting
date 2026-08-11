import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { ImagePlaceholder } from "./image-placeholder";
import { Tag } from "./primitives";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
};

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <article className="group border-line hover:border-amber overflow-hidden rounded-xl border bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div className="aspect-[16/10] overflow-hidden">
        <ImagePlaceholder
          src={article.image}
          alt={`Cover image for ${article.title}`}
          className="min-h-0 transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-6">
        <Tag>{article.category}</Tag>
        <h2 className="text-navy mt-4 text-xl font-extrabold">
          {article.title}
        </h2>
        <p className="text-muted mt-3 text-sm leading-6">{article.excerpt}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-muted flex items-center gap-1.5 text-xs">
            <CalendarDays size={14} />
            {article.date}
          </span>
          <Link
            href={`/insights/${article.slug}`}
            className="text-navy inline-flex items-center gap-1 text-sm font-bold"
            aria-label={`Read ${article.title}`}
          >
            Read <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
