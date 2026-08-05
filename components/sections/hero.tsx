import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
export function Hero() {
  return (
    <section className="bg-deep-navy relative overflow-hidden text-white">
      <div className="grid-pattern absolute inset-0" />
      <Container className="relative grid items-center gap-12 py-20 lg:items-start lg:grid-cols-[1.1fr_.9fr] lg:gap-20 lg:py-28">
        <div className="flex flex-col justify-center items-center lg:items-start">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <p className="text-amber mb-5 flex flex-col items-center gap-3 text-xs font-extrabold tracking-[.18em] uppercase sm:flex-row sm:items-center">
              <span className="hidden sm:block bg-amber h-px w-8" />
              Health, Safety and Environment Consulting
            </p>
            <h1 className="text-4xl leading-[1.08] font-extrabold text-balance sm:text-6xl xl:text-7xl max-w-3xl mx-auto lg:mx-0">
              Safer Workplaces.
              <br />
              Safer Events.
              <br />
              <span className="text-amber">Stronger HSE Teams.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg mx-auto lg:mx-0">
              Dune Consulting helps organisations protect people, reduce risk and strengthen safety performance through practical HSE training, event safety management and competent outsourced professionals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
              <Button href="/contact#consultation">Discuss Your HSE Needs</Button>
              <Button href="/services" variant="light">
                Explore Our Services
              </Button>
            </div>
            <ul className="mt-9 flex flex-col gap-3 text-sm font-semibold text-white/85 sm:flex-row sm:flex-wrap sm:gap-6 justify-center lg:justify-start">
              {[
                "Practical HSE Expertise",
                "Qualified Safety Personnel",
                "End-to-End Support",
              ].map((point) => (
                <li className="flex items-center gap-2" key={point}>
                  <CheckCircle2 className="text-amber" size={18} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-0">
          <div className="relative h-[400px] overflow-hidden rounded-t-2xl border border-white/10 shadow-2xl">
            <ImagePlaceholder
              src="/images/Hero.png"
              alt="Dune Consulting safety personnel supporting a live event"
              className="absolute inset-0 bg-[#aeb9c3]"
              imgClassName="object-top"
            />
            <div className="from-deep-navy/55 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          </div>

          <div className="hidden sm:block rounded-b-2xl border border-amber bg-deep-navy/90 p-4 shadow-2xl backdrop-blur">
            <p className="text-sm font-bold sm:text-base">Practical support, designed around your operation</p>
            <p className="mt-1 text-xs leading-snug text-white/65 sm:text-sm">
              Planning · Personnel · Supervision · Reporting
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
