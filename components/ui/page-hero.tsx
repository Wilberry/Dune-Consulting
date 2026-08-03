import { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";
import { Button } from "./button";
import { Container } from "./container";
import { ImagePlaceholder } from "./image-placeholder";

export function PageHero({
  eyebrow,
  title,
  copy,
  breadcrumbs,
  image,
  cta,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  breadcrumbs: BreadcrumbItem[];
  image?: string;
  cta?: { label: string; href: string };
}) {
  return (
    <section className="grid-pattern bg-deep-navy overflow-hidden text-white">
      <Container
        className={`grid items-center gap-10 py-14 sm:py-18 ${image ? "lg:grid-cols-[1.08fr_.92fr]" : ""}`}
      >
        <div>
          <Breadcrumb items={breadcrumbs} inverse />
          <p className="text-amber mt-8 text-xs font-extrabold tracking-[.18em] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-extrabold text-balance sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
            {copy}
          </p>
          {cta && (
            <Button className="mt-7" href={cta.href}>
              {cta.label}
            </Button>
          )}
        </div>
        {image && (
          <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <ImagePlaceholder
              src={image}
              alt={`Image placeholder for ${title}`}
            />
          </div>
        )}
      </Container>
    </section>
  );
}
