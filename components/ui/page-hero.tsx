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
        className={`grid items-center gap-10 pt-36 pb-14 lg:gap-14 lg:pb-20 ${image ? "lg:grid-cols-[1.12fr_.88fr]" : ""}`}
      >
        <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
          <p className="eyebrow hero-enter hero-enter-delay-1">
            {eyebrowMobile ? (
              <>
                <span className="inline lg:hidden">{eyebrowMobile}</span>
                <span className="hidden lg:inline">{eyebrow}</span>
              </>
            ) : (
              eyebrow
            )}
          </p>
          <h1 className="page-title hero-enter hero-enter-delay-2 mx-auto mt-4 max-w-3xl lg:mx-0">
            {title}
          </h1>
          <p className="hero-enter hero-enter-delay-3 mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70 lg:mx-0">
            {copy}
          </p>
          {cta && (
            <div className="hero-enter hero-enter-delay-4 mt-7 flex w-full justify-center gap-3 lg:justify-start">
              <Button href={cta.href}>{cta.label}</Button>
            </div>
          )}
        </div>
        {image && (
          <div className="hero-media-enter aspect-[4/3] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
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
