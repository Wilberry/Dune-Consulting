import { Button } from "./button";
import { Container } from "./container";
import { ImagePlaceholder } from "./image-placeholder";

export function PageHero({
  eyebrow,
  eyebrowMobile,
  title,
  copy,
  image,
  imageAlt,
  cta,
}: {
  eyebrow: string;
  eyebrowMobile?: string;
  title: string;
  copy: string;
  image?: string;
  imageAlt?: string;
  cta?: { label: string; href: string };
}) {
  const altText = imageAlt || `${eyebrow} image`;
  return (
    <section className="grid-pattern bg-deep-navy overflow-hidden text-white">
      <Container
        className={`grid items-center gap-10 py-14 sm:py-18 lg:gap-14 ${image ? "lg:grid-cols-[1.12fr_.88fr]" : ""}`}
      >
        <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
          <p className="text-amber text-xs font-extrabold tracking-[.18em] uppercase">
            {eyebrowMobile ? (
              <>
                <span className="inline lg:hidden">{eyebrowMobile}</span>
                <span className="hidden lg:inline">{eyebrow}</span>
              </>
            ) : (
              eyebrow
            )}
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl leading-[1.08] font-extrabold text-balance sm:text-5xl lg:mx-0 lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg lg:mx-0">
            {copy}
          </p>
          {cta && (
            <div className="mt-7 flex w-full justify-center gap-3 lg:justify-start">
              <Button href={cta.href}>{cta.label}</Button>
            </div>
          )}
        </div>
        {image && (
          <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <ImagePlaceholder
              src={image}
              alt={altText}
              imgClassName="object-top sm:object-center"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
