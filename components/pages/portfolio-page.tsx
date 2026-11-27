import Link from "next/link";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";
import { CTASection } from "@/components/sections/cta-section";
import { Button } from "@/components/ui/button";
import { EmptyState, Tag } from "@/components/ui/primitives";
import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { PageHero } from "@/components/ui/page-hero";
import { ProjectCard } from "@/components/ui/project-card";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/data/portfolio";

export function PortfolioPage() {
  const featured = projects[0];
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Our Event Portfolio"
        title="Selected Events and Organisations We Have Supported"
        copy="Our event safety portfolio includes corporate gatherings, conferences, launches, festivals and large audience experiences supported through practical planning, coordination and on site safety management."
        image={featured.image}
        imageAlt={`${featured.title} event artwork`}
      />
      <Section>
        <SectionHeading eyebrow="Featured Project" title={featured.title} />
        <div className="border-line mt-10 grid overflow-hidden rounded-2xl border bg-white shadow-lg lg:grid-cols-[1.15fr_.85fr]">
          <div className="aspect-[4/3] lg:aspect-auto">
            <ImagePlaceholder
              src={featured.image}
              alt={`Event image for ${featured.title}`}
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <Tag>{featured.category}</Tag>
            <p className="text-muted mt-5 flex items-center justify-center gap-2 text-sm sm:justify-start">
              <MapPin size={16} />
              {featured.location}
            </p>
            <p className="text-muted mt-5 leading-7">
              This featured portfolio entry uses an approved event name and
              neutral project context while avoiding unverified delivery claims.
            </p>
            <Button href={featured.href} className="mt-7 self-start" arrow>
              View project
            </Button>
          </div>
        </div>
      </Section>
      <Section className="overflow-hidden bg-[#f6f4ec]">
        <SectionHeading
          align="center-all"
          eyebrow="Project Portfolio"
          title="Events and teams we have supported"
          copy="Each entry is structured for approved imagery and project specific detail."
        />
        <div className="portfolio-timeline relative mx-auto mt-14 max-w-5xl">
          <div
            aria-hidden="true"
            className="bg-navy/20 absolute top-3 bottom-3 left-4 w-px md:left-1/2 md:-translate-x-1/2"
          />
          <ol className="space-y-7 md:space-y-10">
            {projects.map((project, index) => {
              const isReversed = index % 2 === 1;
              return (
                <li
                  key={project.slug}
                  className={`portfolio-timeline-item relative grid grid-cols-[2rem_minmax(0,1fr)] items-center gap-3 md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1fr)] md:gap-0 ${
                    isReversed ? "portfolio-timeline-item-reversed" : ""
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="border-amber text-navy relative z-10 col-start-1 row-start-1 flex size-8 items-center justify-center rounded-full border-2 bg-[#f6f4ec] text-[10px] font-extrabold md:col-start-2 md:justify-self-center"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <article
                    data-scroll-reveal
                    className={`group border-navy/10 hover:border-amber/60 col-start-2 row-start-1 grid max-w-[85%] overflow-hidden rounded-2xl border bg-white/80 shadow-[0_14px_38px_rgba(16,35,63,0.07)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(16,35,63,0.12)] md:col-span-1 md:row-start-1 md:grid-cols-[.9fr_1.1fr] ${
                      isReversed
                        ? "md:col-start-1 md:mr-2 md:justify-self-end"
                        : "md:col-start-3 md:ml-1 md:justify-self-start"
                    }`}
                  >
                    <div
                      className={`bg-off-white relative aspect-[16/10] min-h-0 overflow-hidden md:aspect-auto md:min-h-56 ${
                        isReversed ? "md:order-2" : ""
                      }`}
                    >
                      <ImagePlaceholder
                        src={project.image}
                        alt={`${project.title} event artwork`}
                        className="absolute inset-0 min-h-0 transition-transform duration-700 group-hover:scale-105"
                        fit="cover"
                      />
                    </div>
                    <div
                      className={`flex flex-col justify-center p-5 sm:p-6 ${
                        isReversed ? "md:order-1" : ""
                      }`}
                    >
                      <p className="eyebrow text-[0.6rem]">
                        {project.category}
                      </p>
                      <h3 className="font-heading text-navy mt-2 text-xl leading-tight font-extrabold sm:text-2xl">
                        {project.title}
                      </h3>
                      <p className="text-muted mt-3 flex items-center gap-2 text-sm">
                        <MapPin size={15} aria-hidden="true" />
                        {project.location}
                      </p>
                      <Link
                        href={project.href}
                        className="text-navy hover:text-amber-hover mt-5 inline-flex w-fit items-center gap-2 text-sm font-bold transition-colors"
                      >
                        View project <ArrowRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>
      <CTASection />
    </main>
  );
}

export function ProjectDetailPage({ slug }: { slug: string }) {
  const project = projects.find((item) => item.slug === slug)!;
  const related = projects.filter((item) => item.slug !== slug).slice(0, 3);
  return (
    <main id="main-content">
      <PageHero
        eyebrow={project.category}
        title={project.title}
        copy={`Dune Consulting provided event safety support for ${project.title}. This portfolio entry uses approved event naming while preserving neutral project detail.`}
        image={project.image}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <SectionHeading
              eyebrow="Project Summary"
              title="Approved portfolio project structure"
            />
            <p className="text-muted mt-6 leading-7">
              Dune Consulting provided event safety support for {project.title}.
              The entry is part of our approved event safety portfolio and
              focuses on factual, neutral project context.
            </p>
          </div>
          <div className="border-line bg-off-white rounded-xl border p-6">
            <dl className="space-y-5">
              <div>
                <dt className="text-muted text-xs font-bold tracking-wider uppercase">
                  Project
                </dt>
                <dd className="text-navy mt-1 font-bold">{project.title}</dd>
              </div>
              <div>
                <dt className="text-muted text-xs font-bold tracking-wider uppercase">
                  Service category
                </dt>
                <dd className="text-navy mt-1 font-bold">{project.category}</dd>
              </div>
              <div className="text-center sm:text-left">
                <dt className="text-muted text-xs font-bold tracking-wider uppercase">
                  Location
                </dt>
                <dd className="text-navy mt-1 font-bold">{project.location}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>
      <Section className="bg-navy">
        <SectionHeading
          eyebrow="Services Provided"
          title="Service category is shown above"
          inverse
        />
        <div className="mt-8">
          <EmptyState
            title="Approved portfolio context"
            copy="This page highlights the verified project name, category and imagery while preserving discretion over detailed delivery information."
          />
        </div>
      </Section>
      <Section>
        <SectionHeading
          eyebrow="Project Summary"
          title="Neutral portfolio context"
        />
        <p className="text-muted mt-6 leading-7">
          Dune Consulting provided event safety support for {project.title}.
          This portfolio entry focuses on verified naming, imagery and category
          without adding unapproved delivery details.
        </p>
      </Section>
      <Section className="bg-off-white">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [
              "Challenge",
              "This section is reserved for approved factual details about the operational context.",
            ],
            [
              "Solution",
              "This section is reserved for approved factual details about the service delivery and coordination.",
            ],
            [
              "Outcome",
              "This section is reserved for approved factual details about the engagement result.",
            ],
          ].map(([title, copy]) => (
            <article
              key={title}
              className="border-line rounded-xl border bg-white p-7"
            >
              <span className="bg-amber text-deep-navy flex size-10 items-center justify-center rounded-full">
                <CheckCircle2 size={19} />
              </span>
              <h2 className="text-navy mt-5 text-2xl font-extrabold">
                {title}
              </h2>
              <p className="text-muted mt-3 text-sm leading-6">{copy}</p>
            </article>
          ))}
        </div>
      </Section>
      <Section>
        <div className="flex items-end justify-between gap-5">
          <SectionHeading
            eyebrow="Related Projects"
            title="Explore more of our work"
          />
          <Link
            href="/portfolio"
            className="text-navy hidden items-center gap-2 text-sm font-bold sm:flex"
          >
            All projects <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <ProjectCard key={item.slug} project={item} />
          ))}
        </div>
      </Section>
      <CTASection />
    </main>
  );
}
