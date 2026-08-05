import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutPage } from "@/components/pages/about-page";
import { InsightsPage } from "@/components/pages/insights-page";
import { LegalPage } from "@/components/pages/legal-page";
import { MentorshipPage } from "@/components/pages/mentorship-page";
import {
  PortfolioPage,
  ProjectDetailPage,
} from "@/components/pages/portfolio-page";
import {
  ServiceDetailPage,
  ServicesOverviewPage,
} from "@/components/pages/services-page";
import { StructuredData } from "@/components/seo/structured-data";
import { company } from "@/data/company";
import { serviceDetails } from "@/data/page-content";
import { getSupportedRoute, supportedRoutes } from "@/data/routes";

type Props = { params: Promise<{ slug: string[] }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.values(supportedRoutes).map((route) => ({
    slug: route.path.split("/").filter(Boolean),
  }));
}
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
    twitter: {
      card: "summary_large_image",
      title: route.title,
      description: route.description,
    },
  };
}

export default async function ContentPage({ params }: Props) {
  const { slug } = await params;
  const route = getSupportedRoute(slug);
  if (!route) notFound();
  const key = slug.join("/");
  let content: React.ReactNode;
  if (key === "about") content = <AboutPage />;
  else if (key === "services") content = <ServicesOverviewPage />;
  else if (key.startsWith("services/"))
    content = <ServiceDetailPage slug={slug[1]} />;
  else if (key === "portfolio") content = <PortfolioPage />;
  else if (key.startsWith("portfolio/"))
    content = <ProjectDetailPage slug={slug[1]} />;
  else if (key === "mentorship") content = <MentorshipPage />;
  else if (key === "insights") content = <InsightsPage />;
  else if (key === "privacy" || key === "terms")
    content = <LegalPage type={key} />;
  else notFound();

  const service = key.startsWith("services/")
    ? serviceDetails[slug[1]]
    : undefined;
  const pageSchema: Record<string, unknown> | undefined = service
    ? {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.summary,
        provider: {
          "@type": "Organization",
          name: company.name,
          url: company.websiteUrl,
        },
        areaServed: { "@type": "Country", name: "Nigeria" },
        url: `${company.websiteUrl}${route.path}`,
      }
    : key === "insights"
      ? {
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Dune Consulting HSE Insights",
          url: `${company.websiteUrl}/insights`,
          description: route.description,
        }
      : undefined;
  return (
    <>
      {pageSchema && <StructuredData data={pageSchema} />}
      {content}
    </>
  );
}
