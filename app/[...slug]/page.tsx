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
  if (key === "about") return <AboutPage />;
  if (key === "services") return <ServicesOverviewPage />;
  if (key.startsWith("services/")) return <ServiceDetailPage slug={slug[1]} />;
  if (key === "portfolio") return <PortfolioPage />;
  if (key.startsWith("portfolio/")) return <ProjectDetailPage slug={slug[1]} />;
  if (key === "mentorship") return <MentorshipPage />;
  if (key === "insights") return <InsightsPage />;
  if (key === "privacy" || key === "terms") return <LegalPage type={key} />;
  notFound();
}
