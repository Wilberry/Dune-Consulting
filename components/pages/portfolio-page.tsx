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
        eyebrow="Selected Work"
        title="Safety support behind ambitious events and projects."
        copy="Explore selected engagements supported by Dune Consulting. Project descriptions remain factual and avoid unapproved performance claims."
        breadcrumbs={[{ label: "Portfolio" }]}
        image="/images/portfolio/portfolio-hero.jpg"
      />
      <Section>
        <SectionHeading eyebrow="Featured Project" title={featured.title} />
        <div className="border-line mt-10 grid overflow-hidden rounded-2xl border bg-white shadow-lg lg:grid-cols-[1.15fr_.85fr]">
          <div className="aspect-[4/3] lg:aspect-auto">
            <ImagePlaceholder
              src={featured.image}
              alt={`Project image placeholder for ${featured.title}`}
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <Tag>{featured.category}</Tag>
            <p className="text-muted mt-5 flex items-center gap-2 text-sm">
              <MapPin size={16} />
              {featured.location}
            </p>
            <p className="text-muted mt-5 leading-7">
              A detailed, approved project narrative—including scope,
              challenges, delivery and outcome—will be added after client
              review.
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
        copy="A selected Dune Consulting engagement. Detailed project information will be published only after client approval."
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
              title="Engagement details prepared for client-approved content"
            />
            <p className="text-muted mt-6 leading-7">
              This project page provides the final editorial structure while
              deliberately withholding unconfirmed scope, dates, locations and
              outcomes. Approved information can be inserted without redesigning
              the experience.
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
          title="Approved scope to be confirmed"
          inverse
        />
        <div className="mt-8">
          <EmptyState
            title="Service scope awaiting approval"
            copy="Specific services delivered on this engagement will be listed here once the client approves publication."
          />
        </div>
      </Section>
      <Section>
        <SectionHeading
          eyebrow="Project Gallery"
          title="A closer look at the engagement"
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              className="aspect-[4/3] overflow-hidden rounded-xl"
            >
              <ImagePlaceholder
                src={`/images/projects/${project.slug}-${number}.jpg`}
                alt={`Gallery placeholder ${number} for ${project.title}`}
              />
            </div>
          ))}
        </div>
      </Section>
      <Section className="bg-off-white">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [
              "Challenge",
              "The approved operational context and risk challenge will be documented here.",
            ],
            [
              "Solution",
              "Dune's approved response, coordination and service delivery will be described here.",
            ],
            [
              "Outcome",
              "Verified outcomes will be added after client approval; no result has been invented.",
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
