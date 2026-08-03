import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { navigation, serviceNavigation } from "@/data/navigation";

type Props = { params: Promise<{ slug: string[] }> };
const names: Record<string, string> = {
  about: "About Dune Consulting",
  services: "HSE Services",
  portfolio: "Events and Projects",
  mentorship: "HSE Mentorship Programme",
  insights: "HSE Insights",
  privacy: "Privacy Policy",
  terms: "Terms",
  "event-safety-management": "Event Safety Management",
  "hse-training": "Tailored HSE Training",
  "personnel-outsourcing": "HSE Personnel Outsourcing",
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = names[slug.at(-1) ?? ""] ?? "Page";
  return {
    title,
    description: `${title} from Dune Consulting, a Lagos-based Health, Safety and Environment consultancy.`,
  };
}
export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const key = slug.at(-1) ?? "";
  const title = names[key] ?? "Dune Consulting";
  const isService = slug[0] === "services" && slug.length > 1;
  return (
    <main id="main-content">
      <section className="bg-navy py-16 text-white">
        <Container>
          <p className="text-amber text-xs font-bold tracking-[.18em] uppercase">
            Dune Consulting
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-white/70">
            This supporting page is ready for approved long-form content. The
            complete service overview is available from the homepage.
          </p>
        </Container>
      </section>
      <Container className="py-16">
        <div className="border-line bg-off-white max-w-3xl rounded-xl border p-8">
          <h2 className="text-navy text-2xl font-bold">
            Content in preparation
          </h2>
          <p className="text-muted mt-4 leading-7">
            The initial release establishes this route so navigation is complete
            and future approved content can be added without restructuring the
            site.
          </p>
          <Link
            className="text-navy decoration-amber mt-7 inline-block font-bold underline decoration-2 underline-offset-4"
            href={isService ? "/services" : "/"}
          >
            Return to {isService ? "all services" : "homepage"}
          </Link>
        </div>
        {key === "services" && (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {serviceNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-line text-navy hover:border-amber rounded-lg border p-5 font-bold"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
        {key === "about" && (
          <nav className="sr-only" aria-label="Site pages">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </Container>
    </main>
  );
}
