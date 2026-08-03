import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCheck,
  Eye,
  Headphones,
  Lightbulb,
  Route,
  Shield,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FeatureItem } from "@/components/ui/feature-item";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { ProcessStep } from "@/components/ui/process-step";
import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/ui/service-card";
import { StatCard } from "@/components/ui/stat-card";
import { projects } from "@/data/portfolio";
import { services } from "@/data/services";
import { statistics } from "@/data/statistics";
import { testimonials } from "@/data/testimonials";

const clients = [
  "Jameson",
  "TechCabal",
  "Africa Finance Corporation",
  "Martell",
  "Zedcrest",
  "Aproko Nation",
];
const process = [
  [
    "Consult",
    "We understand the event, venue, audience and operational requirements.",
  ],
  [
    "Assess",
    "We identify hazards, vulnerabilities and regulatory considerations.",
  ],
  [
    "Plan",
    "We prepare practical safety, emergency and stakeholder coordination plans.",
  ],
  ["Deploy", "We position qualified personnel, equipment and signage."],
  ["Monitor", "We conduct active supervision and dynamic risk assessments."],
  ["Report", "We document findings, incidents, outcomes and recommendations."],
] as const;

export function Clients() {
  return (
    <section
      aria-labelledby="clients-title"
      className="border-line border-b bg-white py-10"
    >
      <Container>
        <h2
          id="clients-title"
          className="text-muted text-center text-sm font-bold tracking-wide"
        >
          Trusted on Events and Projects Across Nigeria
        </h2>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {clients.map((client) => (
            <div
              key={client}
              className="border-line bg-off-white font-heading text-navy flex min-h-16 items-center justify-center rounded border px-3 text-center text-xs font-extrabold"
            >
              {client}
              <span className="sr-only"> logo placeholder</span>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="bg-off-white py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="What We Do"
          title="Complete HSE Support, From Planning to Execution"
          copy="We combine risk planning, trained personnel, practical education and on-site supervision to help clients protect people and maintain operational compliance."
        />
        <Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <ServiceCard key={service.href} service={service} />
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export function AboutPreview() {
  const points = [
    "Event and operational risk management",
    "Practical, client-specific solutions",
    "Experienced HSE personnel",
    "Clear reporting and accountability",
  ];
  return (
    <section className="py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <div className="aspect-[5/4] overflow-hidden rounded-xl">
            <ImagePlaceholder
              src="/images/hse-training-session.jpg"
              alt="A facilitator leading a practical Dune Consulting HSE training session"
            />
          </div>
          <div className="bg-navy absolute right-4 -bottom-6 max-w-56 rounded-lg p-5 text-white shadow-xl sm:right-[-16px]">
            <BadgeCheck className="text-amber mb-3" />
            <p className="font-heading text-lg font-bold">
              Practical support, designed around your operation.
            </p>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="About Dune Consulting"
            title="Practical Safety Systems That Work in the Real World"
          />
          <div className="text-muted mt-6 space-y-4 leading-7">
            <p>
              Dune Consulting is a Lagos-based Health, Safety and Environment
              consultancy supporting organisations, event producers and project
              teams with practical risk-management solutions.
            </p>
            <p>
              We believe effective safety should protect people without
              unnecessarily disrupting operations or the event experience. Our
              approach combines early planning, clear communication, trained
              personnel and responsive on-site supervision.
            </p>
          </div>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {points.map((point) => (
              <li
                key={point}
                className="text-ink flex items-start gap-2 text-sm font-semibold"
              >
                <Check className="text-success mt-0.5 shrink-0" size={18} />
                {point}
              </li>
            ))}
          </ul>
          <Button className="mt-8" href="/about" arrow>
            Learn About Dune
          </Button>
        </div>
      </Container>
    </section>
  );
}

export function WhyChooseUs() {
  const features = [
    {
      title: "End-to-End Delivery",
      copy: "We support clients from initial assessment and planning through deployment, monitoring and reporting.",
      icon: Route,
    },
    {
      title: "Practical Expertise",
      copy: "Our recommendations are designed for real operational environments, not merely for documents and checklists.",
      icon: Lightbulb,
    },
    {
      title: "Responsive Personnel",
      copy: "We deploy trained professionals who communicate clearly and respond appropriately as conditions change.",
      icon: Headphones,
    },
    {
      title: "Safety Without Disruption",
      copy: "We integrate safety into the operation or event experience without creating unnecessary obstacles.",
      icon: Shield,
    },
  ];
  return (
    <section className="bg-navy py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="The Dune Difference"
          title="Why Organisations Choose Dune"
          inverse
        />
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <FeatureItem key={feature.title} {...feature} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Process() {
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="How We Work"
          title="A Clear Process for Safer Events"
          copy="A structured, accountable approach that keeps safety aligned with the realities of your event."
        />
        <ol className="before:bg-line relative mt-14 grid gap-10 before:absolute before:top-0 before:bottom-0 before:left-5 before:w-px lg:grid-cols-6 lg:gap-6 lg:before:top-5 lg:before:right-0 lg:before:bottom-auto lg:before:left-0 lg:before:h-px lg:before:w-full">
          {process.map(([title, copy], index) => (
            <ProcessStep
              key={title}
              number={index + 1}
              title={title}
              copy={copy}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}

export function Impact() {
  return (
    <section className="bg-deep-navy py-14">
      <Container>
        <p className="text-amber mb-8 text-xs font-extrabold tracking-[.18em] uppercase">
          Our Impact
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((stat) => (
            <StatCard key={stat.label} stat={stat} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function FeaturedProjects() {
  return (
    <section className="bg-off-white py-20 sm:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Our Work"
            title="Selected Events and Projects"
            copy="A selection of events and organisations supported by Dune Consulting."
          />
          <Link
            href="/portfolio"
            className="text-navy inline-flex shrink-0 items-center gap-2 font-bold"
          >
            View all projects <ArrowRight size={17} />
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function Mentorship() {
  const benefits = [
    [UsersRound, "Professional guidance"],
    [Eye, "Practical industry insight"],
    [ClipboardCheck, "Career development support"],
  ] as const;
  return (
    <section className="py-20 sm:py-24">
      <Container>
        <div className="bg-navy overflow-hidden rounded-2xl text-white lg:grid lg:grid-cols-2">
          <div className="relative min-h-80">
            <ImagePlaceholder
              src="/images/hse-mentorship.jpg"
              alt="Emerging safety professionals participating in the Dune HSE Mentorship Programme"
              className="absolute inset-0"
            />
          </div>
          <div className="p-8 sm:p-12 lg:p-14">
            <p className="text-amber mb-3 text-xs font-extrabold tracking-[.18em] uppercase">
              HSE Mentorship Programme
            </p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Build Practical Skills for a Career in HSE
            </h2>
            <p className="mt-5 leading-7 text-white/70">
              The Dune HSE Mentorship Programme supports emerging safety
              professionals through structured guidance, practical learning and
              career-focused development.
            </p>
            <ul className="mt-7 space-y-4">
              {benefits.map(([Icon, label]) => (
                <li
                  key={label}
                  className="flex items-center gap-3 font-semibold"
                >
                  <Icon className="text-amber" size={20} />
                  {label}
                </li>
              ))}
            </ul>
            <Button href="/mentorship" className="mt-8">
              Explore the Mentorship Programme
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="border-line bg-off-white border-y py-16">
      <Container>
        <SectionHeading
          eyebrow="Client Feedback"
          title="Trusted Partnerships, Measurable Care"
          align="center"
        />
        {testimonials.length === 0 ? (
          <div className="border-navy/25 mx-auto mt-8 max-w-2xl rounded-xl border border-dashed bg-white p-8 text-center">
            <p className="font-heading text-navy text-lg font-bold">
              Client testimonials will be added after approval.
            </p>
            <p className="text-muted mt-2 text-sm">
              This space is ready for verified feedback from clients and project
              partners.
            </p>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
