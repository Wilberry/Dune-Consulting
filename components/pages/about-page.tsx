import { Award, CheckCircle2, Eye, Flag } from "lucide-react";
import Link from "next/link";
import { CTASection } from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/ui/feature-grid";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { LeadConsultantPhoto } from "@/components/ui/lead-consultant-photo";
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
        title="Health, Safety and Environment Consulting for Confident Operations"
        copy="At Dune Consulting, we believe safety is more than a compliance requirement. It is a business discipline that protects people, strengthens operations and supports sustainable performance."
        image="/images/dune_team_high_quality.webp"
        imageAlt="Dune Consulting team collaborating on HSE strategy for safe operations"
        cta={{ label: "Discuss Your HSE Needs", href: "/contact#consultation" }}
      />
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            align="center-all"
            eyebrow="Our Story"
            title="Built to make safety useful, visible and workable"
          />
        </div>
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-[.45fr_.55fr] lg:gap-12">
          <div>
            <div className="text-muted space-y-4 leading-7 text-center">
              <p>
                Dune Consulting is a Health, Safety and Environment consultancy
                based in Lagos, Nigeria. We support organisations, event producers
                and project teams with practical risk-management solutions.
              </p>
              <p>
                We combine early risk planning, practical education, qualified
                personnel and responsive on-site supervision to help clients
                protect people, maintain compliance and operate confidently.
              </p>
              <p>
                Our work is guided by a simple belief: safety should enable
                operations, not become disconnected paperwork or an unnecessary
                obstacle.
              </p>
            </div>
            <Quote attribution="Dune Consulting positioning">
              Safer Workplaces. Safer Events. Stronger HSE Teams.
            </Quote>
          </div>
          <div className="aspect-[5/4] overflow-hidden rounded-2xl shadow-xl">
            <ImagePlaceholder
              src="/images/ambulance_paramedic.webp"
              alt="Ambulance paramedic and safety team preparing for an emergency response"
            />
          </div>
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
          align="center-all"
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
          align="center-all"
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
              src="/images/dune_training_outdoor_high_quality.webp"
              alt="Outdoor Dune Consulting training session with safety team"
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
          align="center-all"
          eyebrow="Industries We Serve"
          title="Flexible support across people-led environments"
        />
        <div className="mt-10">
          <FeatureGrid items={industries} columns={4} />
        </div>
      </Section>
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            align="center-all"
            eyebrow="Leadership"
            title="Responsible guidance from experienced practitioners"
            copy="Dune Consulting is led by health, safety and environment professionals committed to sound judgement, clear communication and dependable client support."
          />
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[340px_1fr] lg:items-start">
          <div className="mx-auto h-[260px] w-[260px] overflow-hidden rounded-[18px] border border-white/10 shadow-xl sm:h-[300px] sm:w-[300px] lg:h-[340px] lg:w-[340px]">
            <LeadConsultantPhoto
              src="/images/executive_portrait.webp"
              alt="Anthony Igbinosun, Lead Consultant"
            />
          </div>
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4 leading-7">
              <h3 className="text-navy text-lg font-bold">Anthony Igbinosun</h3>
              <p className="text-sm font-semibold text-amber">Lead Consultant</p>
              <p>
                <Link
                  href="https://www.linkedin.com/in/anthonyigbinosun"
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-hover text-sm font-semibold hover:text-white transition"
                >
                  Connect with Anthony on LinkedIn
                </Link>
              </p>
              <p className="text-muted text-sm">
                Anthony is a Health, Safety and Environment professional, corporate trainer, mentor and professional-development advocate. His work focuses on helping organisations improve safety performance through practical HSE training, event safety coordination and professional development.
              </p>
            </div>
            <Callout title="About leadership">
              <div className="flex flex-col items-center gap-3 text-left sm:text-center lg:flex-row lg:items-start lg:text-left">
                <Award className="text-amber-hover shrink-0" />
                <p className="text-sm">
                  Dune&apos;s leadership demonstrates commitment through consistent delivery of practical HSE results, professional development support and dependable client partnerships.
                </p>
              </div>
            </Callout>
          </div>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
