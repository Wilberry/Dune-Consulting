import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/data/services";
export function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return (
    <article className="group border-line hover:border-amber hover:shadow-navy/8 flex min-h-72 flex-col items-center text-center rounded-xl border bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl sm:items-start sm:text-left">
      <div className="bg-navy text-amber mb-6 flex size-12 items-center justify-center rounded-lg">
        <Icon aria-hidden="true" />
      </div>
      <h3 className="text-navy text-xl font-extrabold">{service.title}</h3>
      <p className="text-muted mt-3 flex-1 text-sm leading-6">
        {service.description}
      </p>
      <Link
        className="text-navy group-hover:text-amber-hover mt-6 inline-flex items-center gap-2 text-sm font-bold"
        href={service.href}
      >
        Explore service <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
