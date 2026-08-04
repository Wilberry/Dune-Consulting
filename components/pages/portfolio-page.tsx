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
        copy="Our event safety portfolio includes corporate gatherings, conferences, launches, festivals and large-audience experiences supported through practical planning, coordination and on-site safety management."
        breadcrumbs={[{ label: "Portfolio" }]}
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
            <p className="text-muted mt-5 flex items-center gap-2 text-sm">
              <MapPin size={16} />
              {featured.location}
            </p>
            <p className="text-muted mt-5 leading-7">
              This featured portfolio entry uses an approved event name and neutral project context while avoiding unverified delivery claims.
            </p>
            <Button href={featured.href} className="mt-7 self-start" arrow>
              View project
            </Button>
          </div>
        </div>
      </Section>
      <Section className="bg-off-white">
        <SectionHeading
          eyebrow="Project Portfolio"
          title="Events and teams we have supported"
          copy="Each entry is structured for approved imagery and project-specific detail."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
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
        breadcrumbs={[
          { label: "Portfolio", href: "/portfolio" },
          { label: project.title },
        ]}
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
              Dune Consulting provided event safety support for {project.title}. The entry is part of our approved event safety portfolio and focuses on factual, neutral project context.
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
              <div>
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
        <p className="mt-6 text-muted leading-7">
          Dune Consulting provided event safety support for {project.title}. This portfolio entry focuses on verified naming, imagery and category without adding unapproved delivery details.
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
