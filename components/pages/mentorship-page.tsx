import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Route,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/ui/feature-grid";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { PageHero } from "@/components/ui/page-hero";
import { Badge, Callout } from "@/components/ui/primitives";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { mentorshipBenefits } from "@/data/page-content";

const learningAreas = [
  "The role and mindset of an HSE professional",
  "Hazard identification and practical risk assessment",
  "Clear reporting and safety documentation",
  "Communication, briefings and stakeholder engagement",
  "Event and workplace safety fundamentals",
  "Career planning and professional development",
];
const outcomes = [
  "Greater confidence discussing practical HSE challenges",
  "A clearer understanding of professional responsibilities",
  "Improved approach to risk assessment and reporting",
  "Stronger awareness of career pathways and development gaps",
];

export function MentorshipPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Dune HSE Mentorship Programme"
        title="Build practical judgement for a meaningful career in safety."
        copy="A learning-focused programme for emerging HSE professionals who want guidance, industry context and greater confidence applying what they know."
        breadcrumbs={[{ label: "HSE Mentorship" }]}
        image="/images/mentorship/mentorship-hero.jpg"
        cta={{ label: "Express your interest", href: "/contact#consultation" }}
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Programme Overview"
              title="Move from knowing concepts to thinking like a practitioner"
            />
            <p className="text-muted mt-6 leading-7">
              The Dune HSE Mentorship Programme is designed to help emerging
              professionals connect foundational safety knowledge with the
              judgement, communication and accountability required in real work
              environments.
            </p>
            <p className="text-muted mt-4 leading-7">
              The final programme format, schedule and application cycle will be
              published after approval. No unconfirmed certification or
              placement outcome is implied.
            </p>
          </div>
          <Callout title="Programme details awaiting confirmation">
            <p>
              Approved dates, delivery format, fees, eligibility criteria and
              cohort size will be added before applications open.
            </p>
          </Callout>
        </div>
      </Section>
      <Section className="bg-off-white">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="aspect-[5/4] overflow-hidden rounded-2xl shadow-lg">
            <ImagePlaceholder
              src="/images/mentorship/who-should-apply.jpg"
              alt="Emerging HSE professionals learning together"
            />
          </div>
          <div>
            <SectionHeading
              eyebrow="Who Should Apply"
              title="For people ready to learn with intention"
            />
            <ul className="mt-7 space-y-4">
              {[
                "Students and recent graduates exploring HSE careers",
                "Early-career safety professionals seeking practical context",
                "Professionals transitioning into HSE responsibilities",
                "People preparing for broader operational safety roles",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6">
                  <CheckCircle2
                    className="text-success mt-0.5 shrink-0"
                    size={19}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section>
        <SectionHeading
          eyebrow="Programme Benefits"
          title="Development that supports the person and the profession"
        />
        <div className="mt-10">
          <FeatureGrid items={mentorshipBenefits} />
        </div>
      </Section>
      <Section className="bg-navy overflow-hidden">
        <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <div>
            <Badge inverse>Learning Areas</Badge>
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              A practical curriculum for stronger foundations
            </h2>
            <p className="mt-5 leading-7 text-white/65">
              Learning areas are structured around the decisions, habits and
              communication expected of responsible HSE practitioners.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {learningAreas.map((area, index) => (
              <div
                key={area}
                className="rounded-xl border border-white/10 bg-white/5 p-5"
              >
                <span className="font-heading text-amber text-sm font-extrabold">
                  0{index + 1}
                </span>
                <h3 className="font-heading mt-3 font-bold text-white">
                  {area}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Expected Outcomes"
              title="Progress you should be able to recognise"
            />
            <ul className="mt-7 space-y-4">
              {outcomes.map((outcome) => (
                <li
                  key={outcome}
                  className="border-line flex gap-3 border-b pb-4 text-sm leading-6"
                >
                  <Target className="text-amber-hover shrink-0" size={19} />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading
              eyebrow="Why Learn With Dune"
              title="Insight informed by practical delivery"
            />
            <FeatureGrid
              columns={2}
              items={[
                {
                  title: "Real context",
                  copy: "Examples grounded in event, workplace and project environments.",
                  icon: Route,
                },
                {
                  title: "Human guidance",
                  copy: "Space for questions, reflection and constructive professional direction.",
                  icon: MessageCircle,
                },
                {
                  title: "Applied learning",
                  copy: "Focus on how safety knowledge translates into responsible action.",
                  icon: ClipboardList,
                },
                {
                  title: "Career awareness",
                  copy: "A clearer view of roles, expectations and areas for further growth.",
                  icon: BookOpen,
                },
              ]}
            />
          </div>
        </div>
      </Section>
      <section className="bg-amber py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-10">
          <div>
            <p className="text-deep-navy text-xs font-extrabold tracking-[.18em] uppercase">
              Applications
            </p>
            <h2 className="text-deep-navy mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">
              Ready to take your next professional step?
            </h2>
            <p className="text-deep-navy/70 mt-3">
              Register your interest and receive approved programme details when
              the next cohort is confirmed.
            </p>
          </div>
          <Button href="/contact#consultation" variant="secondary">
            Express your interest <ArrowRight size={17} />
          </Button>
        </div>
      </section>
    </main>
  );
}
