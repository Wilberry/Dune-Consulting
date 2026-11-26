import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
export function Hero() {
  return (
    <section className="bg-deep-navy relative overflow-hidden text-white">
      <div className="grid-pattern absolute inset-0" />
      <Container className="relative grid items-center gap-12 pt-36 pb-20 lg:grid-cols-[1.1fr_.9fr] lg:items-start lg:gap-20 lg:pb-28">
        <div className="flex flex-col items-center justify-center lg:items-start">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <p className="eyebrow hero-enter hero-enter-delay-1 mb-6 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:items-center lg:justify-start lg:text-left">
              Health, Safety and Environment Consulting
            </p>
            <h1 className="page-title mx-auto max-w-3xl text-white lg:mx-0">
              <span className="hero-enter hero-enter-delay-2 block">
                Safer Workplaces.
              </span>
              <span className="hero-enter hero-enter-delay-3 block">
                Safer Events.
              </span>
              <span className="text-amber hero-enter hero-enter-delay-4 block">
                Stronger HSE Teams.
              </span>
            </h1>
            <p className="hero-enter hero-enter-delay-5 mx-auto mt-6 max-w-2xl text-base leading-7 text-white/72 lg:mx-0">
              Dune Consulting helps organisations protect people, reduce risk
              and strengthen safety performance through practical HSE training,
              event safety management and competent outsourced professionals.
            </p>
            <div className="hero-enter hero-enter-delay-6 mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button href="/contact#consultation">
                Discuss Your HSE Needs
              </Button>
              <Button href="/services" variant="light">
                Explore Our Services
              </Button>
            </div>
            <ul className="hero-enter hero-enter-delay-6 mt-9 flex flex-col justify-center gap-3 text-sm font-semibold text-white/85 sm:flex-row sm:flex-wrap sm:gap-6 lg:justify-start">
              {[
                "Practical HSE Expertise",
                "Qualified Safety Personnel",
                "End to End Support",
              ].map((point) => (
                <li className="flex items-center gap-2" key={point}>
                  <CheckCircle2 className="text-amber" size={18} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hero-media-enter flex flex-col gap-0">
          <div className="relative h-[400px] overflow-hidden rounded-t-2xl border border-white/10 shadow-2xl">
            <ImagePlaceholder
              src="/images/Hero.webp"
              alt="Dune Consulting safety personnel supporting a live event"
              className="absolute inset-0 bg-[#aeb9c3]"
              imgClassName="object-top"
            />
            <div className="from-deep-navy/55 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          </div>

          <div className="border-amber bg-deep-navy/90 w-full rounded-b-2xl border p-4 text-center shadow-2xl backdrop-blur">
            <p className="text-sm font-bold sm:text-base">
              Practical support, designed around your operation
            </p>
            <p className="mt-1 text-xs leading-snug text-white/65 sm:text-sm">
              Planning · Personnel · Supervision · Reporting
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
