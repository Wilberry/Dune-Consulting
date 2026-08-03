import { Award, CheckCircle2, Eye, Flag } from "lucide-react";
import { CTASection } from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/ui/feature-grid";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { PageHero } from "@/components/ui/page-hero";
import { Callout, Quote } from "@/components/ui/primitives";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Timeline } from "@/components/ui/timeline";
import { aboutApproach, industries, values } from "@/data/page-content";

const process = [
  {
    title: "Consult",
    copy: "Understand the people, operation and priorities.",
  },
  { title: "Assess", copy: "Identify material hazards and requirements." },
  {
    title: "Plan",
    copy: "Build practical controls and clear responsibilities.",
  },
  { title: "Deploy", copy: "Place the right people and resources." },
  { title: "Monitor", copy: "Stay responsive as conditions change." },
  { title: "Report", copy: "Capture learning and accountable next steps." },
];

export function AboutPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="About Dune Consulting"
        title="Safety expertise grounded in the realities of your operation."
        copy="We help organisations protect people, strengthen compliance and move forward confidently through practical HSE support."
        breadcrumbs={[{ label: "About" }]}
        image="/images/about/about-hero.jpg"
        cta={{ label: "Talk to our team", href: "/contact#consultation" }}
      />
      <Section containerClassName="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Our Story"
            title="Built to make safety useful, visible and workable"
          />
          <div className="text-muted mt-6 space-y-4 leading-7">
            <p>
              Dune Consulting is a Lagos-based Health, Safety and Environment
              consultancy created to close the gap between safety documentation
              and safe delivery.
            </p>
            <p>
              We support event producers, organisations and project teams with a
              combination of early risk planning, practical education, qualified
              personnel and responsive on-site supervision.
            </p>
            <p>
              Our work is guided by a simple belief: safety should enable
              confident operations, not become disconnected paperwork or an
              unnecessary obstacle.
            </p>
          </div>
          <Quote attribution="Dune Consulting positioning">
            Protecting People. Protecting Your Business.
          </Quote>
        </div>
        <div className="aspect-[5/4] overflow-hidden rounded-2xl shadow-xl">
          <ImagePlaceholder
            src="/images/about/our-story.jpg"
            alt="Dune Consulting team collaborating on an HSE plan"
          />
        </div>
      </Section>
      <Section className="bg-off-white">
        <div className="grid gap-6 lg:grid-cols-2">
          <Callout title="Our Mission">
            <div className="flex gap-4">
              <Flag className="text-amber-hover shrink-0" />
              <p>
                To provide practical HSE solutions that protect people, support
                compliance and help organisations deliver work and experiences
                confidently.
              </p>
            </div>
          </Callout>
          <Callout title="Our Vision">
            <div className="flex gap-4">
              <Eye className="text-amber-hover shrink-0" />
              <p>
                To be a trusted reference for dependable, human-centred safety
                delivery across Nigeria and beyond.
              </p>
            </div>
          </Callout>
        </div>
      </Section>
      <Section>
        <SectionHeading
          eyebrow="What Guides Us"
          title="Values reflected in how we work"
          copy="Our values shape the details—from the questions we ask to the way our personnel show up on site."
        />
        <div className="mt-10">
          <FeatureGrid items={values} columns={4} />
        </div>
      </Section>
      <Section className="bg-navy">
        <SectionHeading
          eyebrow="Our Approach"
          title="Clear thinking from first conversation to final report"
          inverse
          copy="A disciplined process keeps risk management proportionate, understandable and accountable."
        />
        <div className="mt-12 rounded-2xl bg-white p-7 sm:p-10">
          <Timeline items={process} />
        </div>
        <div className="mt-12">
          <FeatureGrid items={aboutApproach} columns={4} inverse />
        </div>
      </Section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="aspect-square overflow-hidden rounded-2xl">
            <ImagePlaceholder
              src="/images/about/why-dune.jpg"
              alt="Dune Consulting safety professional reviewing operations on site"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Why Dune Consulting"
              title="Professional standards. Practical delivery. Human awareness."
            />
            <ul className="mt-7 space-y-4">
              {[
                "End-to-end support rather than disconnected activities",
                "Recommendations designed for real operational environments",
                "Responsive personnel who communicate with clarity",
                "Safety integration that respects the audience and operation",
                "Useful reporting that supports accountability and improvement",
              ].map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-6">
                  <CheckCircle2
                    className="text-success mt-0.5 shrink-0"
                    size={19}
                  />
                  {point}
                </li>
              ))}
            </ul>
            <Button href="/services" className="mt-8" arrow>
              Explore our services
            </Button>
          </div>
        </div>
      </Section>
      <Section className="bg-off-white">
        <SectionHeading
          eyebrow="Industries We Serve"
          title="Flexible support across people-led environments"
        />
        <div className="mt-10">
          <FeatureGrid items={industries} columns={4} />
        </div>
      </Section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Leadership"
              title="Responsible leadership, demonstrated through delivery"
              copy="Dune Consulting is led with a commitment to sound judgement, clear communication and dependable client support."
            />
            <p className="text-muted mt-5 max-w-2xl leading-7">
              Approved leadership profiles, portraits and professional
              biographies will be added after client confirmation. The section
              is intentionally structured without inventing names, credentials
              or experience claims.
            </p>
          </div>
          <Callout title="Leadership profiles awaiting approval">
            <div className="flex items-start gap-3">
              <Award className="text-amber-hover shrink-0" />
              <p>
                Supply approved names, roles, biographies and portraits to
                complete this section.
              </p>
            </div>
          </Callout>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
