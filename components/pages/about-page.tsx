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
            <div className="text-muted space-y-4 text-center leading-7">
              <p>
                Dune Consulting is a Health, Safety and Environment consultancy
                based in Lagos, Nigeria. We support organisations, event
                producers and project teams with practical risk management
                solutions.
              </p>
              <p>
                We combine early risk planning, practical education, qualified
                personnel and responsive on site supervision to help clients
                protect people, maintain compliance and operate confidently.
              </p>
              <p>
                Our work is guided by a simple belief: safety should enable
                operations, not become disconnected paperwork or an unnecessary
                obstacle.
              </p>
            </div>
            <Quote>Safer Workplaces. Safer Events. Stronger HSE Teams.</Quote>
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
                To be a trusted reference for dependable, human centred safety
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
          copy="Our values shape the details, from the questions we ask to the way our personnel show up on site."
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
                "End to end support rather than disconnected activities",
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
          title="Flexible support across people led environments"
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
          <div className="lg:sticky lg:top-28">
            <div className="mx-auto h-[260px] w-[260px] overflow-hidden rounded-[18px] border border-white/10 shadow-xl sm:h-[300px] sm:w-[300px] lg:h-[340px] lg:w-[340px]">
              <LeadConsultantPhoto
                src="/images/executive_portrait.webp"
                alt="Anthony O. Igbinosun, Founder and Lead Consultant"
              />
            </div>
            <div className="mx-auto mt-5 max-w-[340px] text-center lg:text-left">
              <h3 className="text-navy text-xl font-bold">
                Anthony O. Igbinosun
              </h3>
              <p className="text-navy mt-1 text-sm font-semibold">
                Founder &amp; Lead Consultant
              </p>
              <Link
                href="https://www.linkedin.com/in/anthonyigbinosun"
                target="_blank"
                rel="noreferrer"
                className="text-navy hover:text-deep-navy decoration-amber mt-3 inline-block text-sm font-semibold underline decoration-2 underline-offset-4 transition"
              >
                Connect with Anthony on LinkedIn
              </Link>
            </div>
          </div>
          <div className="text-muted space-y-5 text-sm leading-7 sm:text-base">
            <p>
              Anthony O. Igbinosun is an accomplished Health, Safety and
              Environment (HSE) professional, consultant, trainer and mentor
              with about 14 years of experience across passenger transport,
              logistics, construction and waste management. He is passionate
              about helping organisations manage risk, strengthen safety
              systems, protect people and achieve sustainable operational
              excellence.
            </p>
            <p>
              Anthony is the Founder and Lead Consultant of Dune Consulting,
              through which he leads the delivery of HSE consultancy, training,
              event safety management, HSE personnel outsourcing, risk
              assessment, emergency preparedness and advisory services to
              organisations across diverse sectors. His approach to consultancy
              is rooted in the belief that safety must be practical,
              commercially relevant and integrated into everyday business
              operations.
            </p>
            <p>
              Beyond corporate consultancy, Anthony is deeply committed to
              developing the next generation of safety professionals. He founded
              the Dune Consulting HSE Mentorship Programme, an initiative
              designed to equip early career HSE professionals with the
              knowledge, confidence, professional insight and practical skills
              needed to navigate the workplace, grow their careers and become
              impactful safety practitioners. Through structured mentorship,
              professional development sessions and candid conversations about
              the realities of the HSE profession, he seeks to bridge the gap
              between academic knowledge, professional certifications and real
              world practice.
            </p>
            <Callout title="Professional foundation">
              <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-start">
                <Award className="text-amber-hover shrink-0" />
                <p className="text-sm">
                  Anthony holds an MSc in Health, Safety and Environment from
                  the University of Sunderland and several professional
                  qualifications in occupational health and safety, management
                  systems auditing and risk assessment. He is also a member of
                  IOSH &amp; TRATSEDI.
                </p>
              </div>
            </Callout>
            <Quote attribution="Anthony O. Igbinosun">
              Safety should go beyond compliance. It should protect lives,
              strengthen businesses and create lasting impact.
            </Quote>
          </div>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
