import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
export function Hero() {
  return (
    <section className="bg-deep-navy relative overflow-hidden text-white">
      <div className="grid-pattern absolute inset-0" />
      <Container className="relative grid items-center gap-10 py-16 lg:grid-cols-[1.04fr_.96fr] lg:py-20">
        <div>
          <p className="text-amber mb-5 flex items-center gap-3 text-xs font-extrabold tracking-[.18em] uppercase">
            <span className="bg-amber h-px w-8" />
            Health, Safety & Environment
          </p>
          <h1 className="text-4xl leading-[1.08] font-extrabold text-balance sm:text-6xl xl:text-7xl">
            Protecting People.
            <br />
            <span className="text-amber">Protecting Your Business.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/72 sm:text-lg">
            Dune Consulting delivers practical Health, Safety and Environment
            solutions for events, workplaces and projects. From planning and
            training to personnel deployment and emergency coordination, we help
            organisations operate safely and confidently.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/contact#consultation">Request a Consultation</Button>
            <Button href="/services" variant="light">
              Explore Our Services
            </Button>
          </div>
          <ul className="mt-9 flex flex-col gap-3 text-sm font-semibold text-white/85 sm:flex-row sm:flex-wrap sm:gap-6">
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
        <div className="relative min-h-[380px] overflow-hidden rounded-xl border border-white/10 shadow-2xl lg:min-h-[540px]">
          <ImagePlaceholder
            src="/images/hero-event-safety.jpg"
            alt="Dune Consulting safety personnel supporting a live event"
            className="absolute inset-0 bg-[#aeb9c3]"
          />
          <div className="from-deep-navy/55 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent" />
          <div className="border-amber bg-deep-navy/90 absolute right-5 bottom-5 left-5 border-l-4 p-4 backdrop-blur">
            <p className="text-sm font-bold">Safety built into every stage</p>
            <p className="mt-1 text-xs text-white/65">
              Planning · Personnel · Supervision · Reporting
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
