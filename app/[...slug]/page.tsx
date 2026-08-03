import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { serviceNavigation } from "@/data/navigation";
import { getSupportedRoute } from "@/data/routes";

type Props = { params: Promise<{ slug: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = getSupportedRoute(slug);
  if (!route) notFound();
  return {
    title: route.title,
    description: route.description,
    alternates: { canonical: route.path },
    openGraph: {
      url: route.path,
      title: route.title,
      description: route.description,
    },
  };
}
export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const route = getSupportedRoute(slug);
  if (!route) notFound();
  const isService = route.path.startsWith("/services/");
  return (
    <main id="main-content">
      <section className="bg-navy py-16 text-white">
        <Container>
          <p className="text-amber text-xs font-bold tracking-[.18em] uppercase">
            Dune Consulting
          </p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
            {route.title}
          </h1>
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
        {route.path === "/services" && (
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
      </Container>
    </main>
  );
}
