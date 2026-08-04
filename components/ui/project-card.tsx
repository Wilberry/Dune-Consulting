import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/data/portfolio";
import { ImagePlaceholder } from "./image-placeholder";
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group border-line overflow-hidden rounded-xl border bg-white text-center transition hover:-translate-y-1 hover:shadow-xl sm:text-left">
      <div className="aspect-[4/3] overflow-hidden bg-off-white">
        <ImagePlaceholder
          src={project.image}
          alt={`${project.title} event artwork`}
          className="min-h-0 transition duration-300 group-hover:scale-105"
          fit="contain"
        />
      </div>
      <div className="p-6">
        <p className="text-amber-text text-xs font-bold tracking-wider uppercase">
          {project.category}
        </p>
        <h3 className="text-navy mt-2 text-xl font-extrabold">
          {project.title}
        </h3>
        <p className="text-muted mt-3 flex items-center gap-2 text-sm">
          <MapPin size={15} aria-hidden="true" />
          {project.location}
        </p>
        <Link
          href={project.href}
          className="text-navy mt-5 inline-flex items-center gap-2 text-sm font-bold"
        >
          View Project <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
