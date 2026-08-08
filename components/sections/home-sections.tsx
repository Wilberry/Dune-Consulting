import Image from "next/image";
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
  Star,
  UsersRound,
} from "lucide-react";
import { Accordion, type AccordionItem } from "@/components/ui/accordion";
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

const portfolioItems = [
  "Jameson Distillery on Tour Lagos",
  "Moonshot by TechCabal",
  "Africa Finance Corporation Annual Staff Retreat 2026",
  "Aproko Nation Fiesta",
  "Martell x Davido Launch",
  "Zedcrest Launchpad 2.0",
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

const faqItems: AccordionItem[] = [
  {
    question: "What does Dune Consulting do?",
    answer:
      "Dune Consulting is a Health, Safety, Environment, Quality, and Risk Management consultancy. We help organisations create safer workplaces through professional training, event safety management, HSE personnel outsourcing, compliance support, and strategic safety consulting.",
  },
  {
    question: "Which industries do you serve?",
    answer:
      "We work with organisations across multiple sectors, including construction, oil and gas, manufacturing, education, healthcare, hospitality, logistics, government agencies, and event management.",
  },
  {
    question: "What HSE training programmes do you offer?",
    answer:
      "We provide industry-relevant HSE training programmes ranging from introductory safety awareness to advanced professional development. Training may be delivered on-site, online, or at a designated training location, depending on the client’s needs.",
  },
  {
    question: "What is the HSE Mentorship Programme?",
    answer:
      "The HSE Mentorship Programme supports aspiring and early-career safety professionals through practical guidance, career coaching, industry insights, and real-world knowledge from experienced HSE professionals.",
  },
  {
    question: "Do you provide HSE personnel for companies?",
    answer:
      "Yes. We recruit, train, and deploy qualified HSE professionals for short-term, long-term, and project-based assignments, helping organisations access competent safety personnel when needed.",
  },
  {
    question: "What is Event Safety Management?",
    answer:
      "Event Safety Management involves planning and coordinating the safety requirements of an event. This includes risk assessment, crowd safety, emergency planning, incident prevention, and compliance with relevant safety standards.",
  },
  {
    question: "Can you customise training for our organisation?",
    answer:
      "Yes. We develop customised training programmes based on an organisation’s operations, workforce, industry risks, regulatory requirements, and learning objectives.",
  },
  {
    question: "Do you support regulatory compliance?",
    answer:
      "Yes. We help organisations understand applicable HSE requirements, conduct risk assessments, improve workplace safety systems, and implement practical measures that support compliance and operational excellence.",
  },
  {
    question: "How can I register for a training programme?",
    answer:
      "You can register through the website contact form, phone, email, or the company’s official social media channels. The Dune Consulting team will guide you through the available programmes and registration process.",
  },
  {
    question: "Why should I choose Dune Consulting?",
    answer:
      "Dune Consulting combines technical expertise, practical industry experience, and a strong commitment to safety excellence. Our solutions are designed to reduce risk, strengthen compliance, improve workforce competence, and support sustainable organisational performance.",
  },
];

export function Clients() {
  return (
    <section
      aria-labelledby="portfolio-preview-title"
      className="border-line border-b bg-white py-16 sm:py-20"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-amber mb-3 text-xs font-extrabold tracking-[.18em] uppercase">
            Our Event Portfolio
          </p>
          <h2
            id="portfolio-preview-title"
            className="text-navy text-2xl font-extrabold sm:text-3xl"
          >
            Selected Events and Organisations We Have Supported
          </h2>
          <p className="text-muted mt-4 text-sm leading-7">
            Our event safety portfolio includes corporate gatherings,
            conferences, launches, festivals and large audience experiences
            supported through practical planning, coordination and on-site
            safety management.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {portfolioItems.map((item) => (
            <div
              key={item}
              className="border-line bg-off-white text-navy rounded-xl border px-4 py-4 text-sm font-semibold"
            >
              {item}
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
          align="center-all"
          eyebrow="What We Do"
          title="Complete HSE Support, From Planning to Execution"
          copy="We combine risk planning, trained personnel, practical education and on-site supervision to help clients protect people and maintain operational compliance."
        />
        <Reveal>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
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
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            align="center-all"
            eyebrow="About Dune Consulting"
            title="Practical Safety Systems That Work in the Real World"
          />
        </div>
        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="aspect-[5/4] overflow-hidden rounded-xl">
              <ImagePlaceholder
                src="/images/Practical_Safety.webp"
                alt="A facilitator leading a practical Dune Consulting HSE training session"
              />
            </div>
            <div className="bg-navy absolute right-4 -bottom-6 hidden max-w-56 rounded-lg p-5 text-white shadow-xl sm:right-[-16px] md:block">
              <BadgeCheck className="text-amber mb-3" />
              <p className="font-heading text-lg font-bold">
                Practical support, designed around your operation.
              </p>
            </div>
          </div>
          <div>
            <div className="text-muted mt-6 space-y-4 text-center leading-7 lg:text-left">
              <p>
                Dune Consulting is a Lagos-based Health, Safety and Environment
                consultancy supporting organisations, event producers and
                project teams with practical risk-management solutions.
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
            <Button className="mx-auto mt-8 lg:mx-0" href="/about" arrow>
              Learn About Dune
            </Button>
          </div>
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
          align="center-all"
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
          align="center-all"
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
    <section className="bg-deep-navy py-16 sm:py-20">
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
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end lg:grid lg:grid-cols-[1.35fr_.65fr] lg:items-end">
          <SectionHeading
            eyebrow="Our Work"
            title="Selected Events and Projects"
            copy="A selection of events and organisations supported by Dune Consulting."
          />
          <div className="flex w-full justify-center lg:justify-end">
            <Link
              href="/portfolio"
              className="text-navy inline-flex shrink-0 items-center gap-2 font-bold"
            >
              View all projects <ArrowRight size={17} />
            </Link>
          </div>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
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
              src="/images/first_aid_training.webp"
              alt="First aid and HSE mentorship training in progress"
              className="absolute inset-0"
            />
          </div>
          <div className="p-8 sm:p-12 lg:p-14">
            <p className="text-amber mb-3 text-xs font-extrabold tracking-[.18em] uppercase">
              HSE Mentorship Program
            </p>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Build Practical Skills for a Career in HSE
            </h2>
            <p className="mt-5 leading-7 text-white/70">
              The Dune HSE Mentorship Program supports emerging safety
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
              Explore the Mentorship Program
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FAQSection() {
  return (
    <section className="bg-off-white py-20 sm:py-24">
      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            align="center-all"
            eyebrow="Frequently Asked Questions"
            title="Answers to Common Questions"
            copy="Learn more about our HSE training, consulting services, personnel outsourcing, event safety management, and mentorship programmes."
          />
        </div>
        <div className="mx-auto mt-12 w-full max-w-[1120px] px-0 sm:px-2 lg:px-0">
          <Accordion items={faqItems} />
        </div>
        <div className="bg-navy mx-auto mt-10 max-w-[920px] rounded-3xl border border-white/10 p-8 text-white shadow-xl sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-extrabold">Still have questions?</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70">
                Our team is ready to help you choose the right HSE solution,
                training programme, or professional support service.
              </p>
            </div>
            <Button href="/contact#consultation">Contact Our Team</Button>
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
          align="center-all"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[2rem] border border-white/10 bg-white p-8 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full bg-slate-100">
                  {testimonial.image ? (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-amber text-deep-navy flex h-full w-full items-center justify-center font-semibold">
                      {testimonial.name
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-navy font-semibold">{testimonial.name}</p>
                  <p className="text-muted text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center gap-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={16}
                    className={
                      index < testimonial.rating
                        ? "text-amber"
                        : "text-slate-300"
                    }
                  />
                ))}
              </div>
              <p className="text-ink mt-6 text-sm leading-7">
                “{testimonial.quote}”
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section className="bg-navy py-16 sm:py-20 lg:py-24 xl:py-28">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-5 py-0 text-white sm:px-8 lg:grid-cols-[1fr_.8fr] lg:px-10 xl:px-12">
        <div>
          <p className="text-amber text-xs font-extrabold tracking-[.18em] uppercase">
            Newsletter
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Practical HSE insight, delivered when it is ready.
          </h2>
          <p className="mt-3 text-white/70">
            Newsletter signup will be enabled once mailing platform and privacy
            terms are configured.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <label
            className="text-sm font-bold text-white"
            htmlFor="newsletter-email"
          >
            Work email
          </label>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              id="newsletter-email"
              disabled
              type="email"
              placeholder="Newsletter configuration pending"
              className="min-h-12 flex-1 rounded-lg border border-white/15 bg-white/10 px-4 text-sm text-white placeholder:text-white/40"
            />
            <button
              disabled
              className="bg-amber text-deep-navy min-h-12 rounded-lg px-5 text-sm font-bold opacity-80"
            >
              Subscribe soon
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
