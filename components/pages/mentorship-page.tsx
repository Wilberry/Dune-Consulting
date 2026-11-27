import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ClipboardList,
  MessageCircle,
  Play,
  Route,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureGrid } from "@/components/ui/feature-grid";
import { PageHero } from "@/components/ui/page-hero";
import { Badge } from "@/components/ui/primitives";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { VideoShowcase } from "@/components/ui/video-showcase";
import { mentorshipTestimonials } from "@/data/mentorship-testimonials";
import { mentorshipBenefits } from "@/data/page-content";
import { extractYouTubeVideoId } from "@/lib/mentorship/youtube";

const learningAreas = [
  {
    title: "Who You Are as an HSE Professional",
    description: "Purpose, Identity & Legacy",
  },
  {
    title: "Speaking the Business Language",
    description: "Communicating and Making the Business Case for HSE",
  },
  {
    title: "Office Politics",
    description: "Influence, Relationships & Power",
  },
  {
    title: "Emotional Intelligence, Negotiation & Conflict Resolution",
  },
  {
    title: "Future Ready HSE Professional",
    description: "Core Technical Competencies and Career Positioning",
  },
];

const outcomes = [
  "Greater confidence discussing safety concerns and practical priorities",
  "A clearer understanding of your professional role and responsibilities",
  "Improved thinking around risk assessment, reporting and communication",
  "A stronger sense of direction for your next steps in HSE practice",
];

const mentorshipPackages = [
  {
    name: "Foundation",
    price: "Free",
    availability: "Unlimited spots",
    description:
      "A welcoming starting point for people looking to strengthen their HSE foundation through structured learning and mentor led discussions.",
    benefits: [
      "All five weekly live sessions",
      "Group Q&A with the mentor",
      "Weekly assignments",
      "Eligibility for HSE training scholarships",
      "Certificate of participation",
    ],
    href: "/mentorship/apply?package=Foundation#apply",
    highlighted: false,
  },
  {
    name: "Momentum",
    price: "₦40,000",
    availability: "20 spots only",
    description:
      "For mentees who want additional learning resources, continued engagement and a supportive coaching community.",
    benefits: [
      "Everything in Foundation",
      "Access to recordings of every session",
      "Access to a private coaching community",
      "Interactive coaching sessions and between session support",
    ],
    href: "/mentorship/apply?package=Momentum#apply",
    highlighted: true,
  },
  {
    name: "Elevation",
    price: "₦100,000",
    availability: "5 spots only",
    description:
      "A more personalised mentorship experience for participants seeking individual guidance and additional professional development support.",
    benefits: [
      "Everything in Momentum",
      "One to one mentor access throughout the five week programme and for one month afterwards",
      "Personal LinkedIn profile and CV review",
      "A LinkedIn recommendation from the mentor at the end of the programme",
      "First access to secure a spot when the next cohort opens",
      "A dedicated one to one Microsoft Teams follow up session 30 days after the programme",
    ],
    href: "/mentorship/apply?package=Elevation#apply",
    highlighted: false,
  },
] as const;

export function MentorshipPage() {
  const testimonials = mentorshipTestimonials.filter(
    (testimonial) => !!extractYouTubeVideoId(testimonial.url),
  );

  return (
    <main id="main-content">
      <PageHero
        eyebrow="Dune Consulting HSE Mentorship Program"
        title="Your next chapter in HSE starts here."
        copy="Strengthen your HSE knowledge, develop professional confidence and learn through a structured five week mentorship experience. With live Saturday sessions, weekly assignments and mentor led discussions, this programme is designed to support your professional growth."
        image="/images/site_safety_briefing.webp"
        cta={{ label: "View programme options", href: "#packages" }}
      />
      <div className="border-line bg-off-white border-b px-5 py-4 text-center text-sm">
        <span className="text-muted">Already an approved mentee? </span>
        <Link
          href="/dashboard/login"
          className="text-navy font-semibold underline underline-offset-2"
        >
          Sign in to your dashboard
        </Link>
      </div>
      <Section>
        <div className="mx-auto max-w-4xl text-center">
          <SectionHeading
            align="center-all"
            eyebrow="Programme Overview"
            title="A practical, structured path into stronger HSE thinking"
          />
        </div>
        <div className="mx-auto mt-12 max-w-4xl text-center">
          <p className="text-muted leading-7">
            The Dune Consulting HSE Mentorship Programme is built for aspiring
            and developing HSE professionals who want more than theory. Over
            five weeks, mentees explore key safety principles, professional
            responsibilities and practical decision making through live
            sessions, guided assignments and focused discussion.
          </p>
          <p className="text-muted mt-4 leading-7">
            Sessions are delivered live every Saturday through Microsoft Teams,
            with a group Q&A at the end of each session. Weekly assignments help
            participants apply learning to real workplace and event contexts,
            while the programme also supports eligibility for HSE training
            scholarship opportunities and includes a certificate of
            participation.
          </p>
        </div>
      </Section>
      <Section className="bg-off-white">
        <div className="bg-navy grid items-center gap-7 rounded-2xl border border-white/10 p-5 sm:p-7 lg:grid-cols-[.85fr_1.15fr] lg:gap-10">
          <div>
            <p className="eyebrow">Who Should Apply</p>
            <h2 className="section-title mt-3 text-white">
              For people ready to grow with intention
            </h2>
            <ul className="mt-6 grid gap-4">
              {[
                "Students and recent graduates exploring HSE careers",
                "Early career safety professionals seeking practical context",
                "Professionals transitioning into HSE responsibilities",
                "People preparing for broader operational safety roles",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-6 text-white/85"
                >
                  <CheckCircle2
                    className="text-success mt-0.5 shrink-0"
                    size={19}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <VideoShowcase
            src="/video/HSE MENTORSHIP PROGRAM.mp4"
            title="Dune Consulting HSE Mentorship Programme"
            autoPlay
          />
        </div>
      </Section>
      <Section>
        <SectionHeading
          align="center-all"
          eyebrow="Programme Benefits"
          title="Support that is practical, encouraging and relevant"
        />
        <div className="mt-10">
          <FeatureGrid items={mentorshipBenefits} />
        </div>
      </Section>
      <Section id="packages" className="bg-off-white">
        <SectionHeading
          align="center-all"
          eyebrow="Choose Your Package"
          title="Select the level of support that matches your goals"
        />
        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          {mentorshipPackages.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-2xl border p-6 shadow-sm transition-all duration-200 ${plan.highlighted ? "border-navy bg-navy text-white shadow-lg" : "border-line text-ink bg-white"}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-xs font-extrabold tracking-[.16em] uppercase ${plan.highlighted ? "text-amber" : "text-navy"}`}
                  >
                    {plan.name}
                  </p>
                  <h3
                    className={`mt-3 text-3xl font-extrabold ${plan.highlighted ? "text-white" : "text-navy"}`}
                  >
                    {plan.price}
                  </h3>
                </div>
                {plan.highlighted && (
                  <span className="bg-amber text-deep-navy rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[.12em] uppercase">
                    Popular
                  </span>
                )}
              </div>
              <p
                className={`mt-4 text-sm leading-6 ${plan.highlighted ? "text-white/80" : "text-muted"}`}
              >
                {plan.description}
              </p>
              <p
                className={`mt-5 text-xs font-bold tracking-[.12em] uppercase ${plan.highlighted ? "text-amber" : "text-navy/75"}`}
              >
                {plan.availability}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.benefits.map((item) => (
                  <li
                    key={item}
                    className={`flex gap-3 text-sm leading-6 ${plan.highlighted ? "text-white/90" : "text-ink/80"}`}
                  >
                    <Check
                      className={
                        plan.highlighted
                          ? "text-amber mt-0.5 shrink-0"
                          : "text-success mt-0.5 shrink-0"
                      }
                      size={18}
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button
                href={plan.href}
                variant={plan.highlighted ? "primary" : "secondary"}
                className={`mt-8 w-full justify-center ${plan.highlighted ? "bg-amber text-deep-navy hover:bg-amber-hover" : "border-navy/15 border"}`}
              >
                Choose {plan.name}
              </Button>
            </article>
          ))}
        </div>
      </Section>
      <Section className="bg-navy relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 -right-40 size-[30rem] rounded-full border border-white/5"
        />
        <div className="relative grid gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
          <div className="lg:pt-2">
            <Badge inverse>HSE Mentorship Curriculum</Badge>
            <h2 className="section-title mt-5 text-white">
              A practical curriculum for stronger foundations
            </h2>
            <p className="mt-5 leading-7 text-white/65">
              The programme is designed around the decisions, habits and
              communication expected of responsible HSE practitioners in real
              environments.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:gap-5">
            {learningAreas.map((area, index) => (
              <div
                key={area.title}
                className="group hover:border-amber/40 relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075] sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-amber/15 text-amber ring-amber/20 flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ring-1">
                    0{index + 1}
                  </span>
                  <span className="text-[10px] font-extrabold tracking-[.18em] text-white/45 uppercase">
                    Week
                  </span>
                </div>
                <h3 className="font-heading mt-5 text-lg leading-6 font-bold text-white sm:text-xl">
                  {area.title}
                </h3>
                {area.description && (
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    {area.description}
                  </p>
                )}
                <div className="bg-amber/70 mt-5 h-px w-10 transition-all duration-300 group-hover:w-16" />
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
              eyebrow="Why Learn With Dune Consulting"
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
                  copy: "Space for thoughtful questions, reflection and constructive feedback.",
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
      {testimonials.length > 0 && (
        <Section>
          <SectionHeading
            align="center-all"
            eyebrow="Student Voices"
            title="Hear it from our mentees"
          />
          <p className="text-muted mx-auto mt-4 max-w-2xl text-center text-sm leading-6">
            Prospective participants can hear directly from people who have
            experienced the programme and gained practical value from the
            experience.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => {
              const videoId = extractYouTubeVideoId(testimonial.url);
              if (!videoId) return null;

              return (
                <article
                  key={testimonial.url}
                  className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm"
                >
                  <a
                    href={testimonial.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={
                      testimonial.name
                        ? `Watch ${testimonial.name}'s mentorship testimonial on YouTube`
                        : "Watch the mentorship testimonial on YouTube"
                    }
                    className="group relative block"
                  >
                    <div className="aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                        alt={
                          testimonial.name
                            ? `${testimonial.name} mentorship testimonial thumbnail`
                            : "Mentorship testimonial thumbnail"
                        }
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
                      />
                    </div>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="text-navy flex size-14 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
                        <Play className="ml-1 fill-current" size={22} />
                      </span>
                    </span>
                  </a>
                  <div className="p-5">
                    {testimonial.name && (
                      <h3 className="text-navy text-lg font-bold">
                        {testimonial.name}
                      </h3>
                    )}
                    {testimonial.caption && (
                      <p className="text-muted mt-2 text-sm leading-6">
                        {testimonial.caption}
                      </p>
                    )}
                    {testimonial.cohort && (
                      <p className="text-amber mt-3 text-xs font-bold tracking-[.12em] uppercase">
                        {testimonial.cohort}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </Section>
      )}
      <section className="bg-amber py-16">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-10 xl:px-12">
          <div>
            <p className="text-deep-navy text-xs font-extrabold tracking-[.18em] uppercase">
              Ready to begin?
            </p>
            <h2 className="text-deep-navy mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">
              Ready to take the next step in your HSE journey?
            </h2>
            <p className="text-deep-navy/70 mt-3">
              Apply for the programme with the support, structure and guidance
              you need to keep moving forward.
            </p>
          </div>
          <Button
            href="/mentorship/apply?package=Foundation#apply"
            variant="secondary"
          >
            Apply for mentorship <ArrowRight size={17} />
          </Button>
        </div>
      </section>
    </main>
  );
}
