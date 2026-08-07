import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { ImagePlaceholder } from "./image-placeholder";
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group border-line overflow-hidden rounded-xl border bg-white text-center transition hover:-translate-y-1 hover:shadow-xl sm:text-left h-full flex flex-col">
      <div className="overflow-hidden bg-off-white h-[220px] sm:h-[240px] lg:h-[280px] w-full">
        <ImagePlaceholder
          src={project.image}
          alt={`${project.title} event artwork`}
          className="min-h-0 transition duration-300 group-hover:scale-105 h-full"
          fit="cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <p className="text-amber-text text-xs font-bold tracking-wider uppercase">
          {project.category}
        </p>
        <h3 className="text-navy mt-2 text-xl font-extrabold">
          {project.title}
        </h3>
        <p className="text-muted mt-3 flex items-center justify-center gap-2 text-sm sm:justify-start">
          <MapPin size={15} aria-hidden="true" />
          {project.location}
        </p>
        <div className="mt-5 self-center sm:self-start">
          <Link
            href={project.href}
            className="text-navy inline-flex items-center gap-2 text-sm font-bold"
          >
            View Project <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
