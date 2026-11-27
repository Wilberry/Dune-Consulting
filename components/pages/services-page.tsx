import Link from "next/link";
import {
  ArrowRight,
  Check,
  Headphones,
  Layers3,
  ShieldCheck,
} from "lucide-react";
import { CTASection } from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/ui/feature-grid";
import { PageHero } from "@/components/ui/page-hero";
import { Badge, Callout, IconBox } from "@/components/ui/primitives";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/ui/service-card";
import { VideoShowcase } from "@/components/ui/video-showcase";
import { serviceDetails } from "@/data/page-content";
import { services } from "@/data/services";

export function ServicesOverviewPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="What We Do"
        title="Connected HSE support for safer delivery"
        copy="From planning and education to qualified personnel and live supervision, Dune Consulting helps clients manage risk without losing sight of the operation."
        image="/images/dune_insights_hero.webp"
        imageAlt="Dune Consulting professionals delivering practical HSE support"
        cta={{ label: "Request a consultation", href: "/contact#consultation" }}
      />
      <Section>
        <SectionHeading
          align="center-all"
          eyebrow="Our Services"
          title="Expert support shaped around your requirements"
          copy="Choose a focused service or combine capabilities into an end to end HSE solution."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7">
          {services.map((service) => (
            <ServiceCard key={service.href} service={service} />
          ))}
        </div>
      </Section>
      <Section className="bg-off-white">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              align="center-all"
              eyebrow="Integrated Delivery"
              title="One partner from risk definition to reporting"
            />
            <p className="text-muted mt-5 leading-7">
              Complex environments rarely need a single isolated intervention.
              We can connect assessments, planning, training, deployed
              personnel, emergency coordination and reporting into a clear
              programme of work.
            </p>
            <Button href="/contact#consultation" className="mt-7">
              Discuss your requirements
            </Button>
          </div>
          <FeatureGrid
            items={[
              {
                title: "Proportionate",
                copy: "Support matched to the real risk and complexity of the assignment.",
                icon: Layers3,
              },
              {
                title: "Responsive",
                copy: "Clear communication before, during and after delivery.",
                icon: Headphones,
              },
              {
                title: "Accountable",
                copy: "Defined responsibilities and useful records throughout.",
                icon: ShieldCheck,
              },
            ]}
          />
        </div>
      </Section>
      <CTASection />
    </main>
  );
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const service = serviceDetails[slug];
  return (
    <main id="main-content">
      <PageHero
        eyebrow={service.eyebrow}
        eyebrowMobile={service.eyebrowMobile}
        title={service.title}
        copy={service.summary}
        image={service.slug === "hse-training" ? undefined : service.image}
        video={
          service.slug === "hse-training"
            ? "/video/Bespoke%20training.mp4"
            : undefined
        }
        imageAlt={`${service.title} hero image showing practical HSE operations`}
        cta={{ label: "Discuss this service", href: "/contact#consultation" }}
      />
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            align="center-all"
            eyebrow="Overview"
            title={
              service.overviewHeading ??
              `Practical ${service.title.toLowerCase()} that supports confident delivery`
            }
          />
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <div className="text-muted space-y-4 text-center leading-7 lg:text-left">
              {service.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <Callout title="Designed around your context">
            <p>
              Scope, resourcing and delivery are agreed around the environment,
              audience, schedule and level of risk, never copied from an
              unrelated assignment.
            </p>
          </Callout>
        </div>
        {service.slug === "hse-training" && (
          <div className="mt-10 rounded-3xl border border-[#e7e4da] bg-[#f7f6f1] p-5 sm:p-8 lg:p-10">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                {
                  src: "/video/VID-20261115-WA0013.mp4",
                  title: "Workplace training session",
                },
                {
                  src: "/video/Training%2001.mp4",
                  title: "Student practical session",
                },
                {
                  src: "/video/CFG%20%20class.mp4",
                  title: "Classroom session",
                },
              ].map((video, index) => (
                <article
                  key={video.src}
                  className="group rounded-2xl border border-white/80 bg-white p-3 shadow-[0_14px_38px_rgba(16,35,63,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(16,35,63,0.13)] sm:p-4"
                >
                  <div className="overflow-hidden rounded-xl bg-[#08172b]">
                    <VideoShowcase
                      src={video.src}
                      title={video.title}
                      autoPlay={false}
                    />
                  </div>
                  <div className="flex items-center gap-3 px-1 pt-4 pb-1">
                    <span className="text-amber-text bg-amber/15 flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold tracking-wide">
                      0{index + 1}
                    </span>
                    <h4 className="font-heading text-navy text-base font-bold sm:text-lg">
                      {video.title}
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </Section>
      <Section className="bg-off-white">
        <SectionHeading
          align="center-all"
          eyebrow="Who It Is For"
          title="Support for teams with real responsibility"
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {service.audiences.map((audience) => (
            <div
              key={audience}
              className="border-line text-navy flex items-center gap-3 rounded-lg border bg-white p-4 text-sm font-bold"
            >
              <Check className="text-success" size={18} />
              {audience}
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeading
          align="center-all"
          eyebrow="Benefits"
          title="What this service helps you achieve"
        />
        <div className="mt-10">
          <FeatureGrid items={service.benefits} />
        </div>
      </Section>
      <Section className="bg-navy">
        <SectionHeading
          align="center-all"
          eyebrow="Service Features"
          title="Support configured around your priorities"
          inverse
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {service.features.map((feature) => (
            <div
              key={feature}
              className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm font-semibold text-white/85"
            >
              <Check className="text-amber mt-0.5 shrink-0" size={18} />
              {feature}
            </div>
          ))}
        </div>
        {service.slug === "hse-training" && (
          <div className="mt-12 grid items-center gap-7 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-7 lg:grid-cols-[.72fr_1.28fr] lg:gap-10">
            <div>
              <p className="eyebrow">Training in action</p>
              <h3 className="section-title mt-3 text-white">
                Practical learning, delivered in the workplace
              </h3>
            </div>
            <VideoShowcase
              src="/video/ZEDCREST BOOTCAMP HIGHLIGHTS.mp4"
              title="Zedcrest bootcamp HSE training highlights"
              autoPlay
            />
          </div>
        )}
      </Section>
      <Section>
        <SectionHeading
          align="center-all"
          eyebrow="Related Services"
          title="Build a more complete HSE solution"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {service.related.map((relatedSlug) => {
            const related = serviceDetails[relatedSlug];
            return (
              <Link
                key={related.slug}
                href={`/services/${related.slug}`}
                className="group border-line hover:border-amber rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <Badge>Related service</Badge>
                    <h3 className="text-navy mt-4 text-xl font-extrabold">
                      {related.title}
                    </h3>
                    <p className="text-muted mt-2 text-sm leading-6">
                      {related.summary}
                    </p>
                  </div>
                  <IconBox
                    icon={
                      services.find((item) => item.href.endsWith(related.slug))
                        ?.icon ?? ShieldCheck
                    }
                  />
                </div>
                <span className="text-navy mt-5 inline-flex items-center gap-2 text-sm font-bold">
                  Explore service <ArrowRight size={16} />
                </span>
              </Link>
            );
          })}
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
