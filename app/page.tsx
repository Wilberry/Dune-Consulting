import { CTASection } from "@/components/sections/cta-section";
import { Hero } from "@/components/sections/hero";
import {
  AboutPreview,
  Clients,
  FeaturedProjects,
  Mentorship,
  Process,
  ServicesSection,
  WhyChooseUs,
} from "@/components/sections/home-sections";
import { company } from "@/data/company";

const pageTitle = "HSE Consulting, Event Safety & Training | Dune Consulting";
const pageDescription =
  "Dune Consulting provides practical HSE training, event safety management, outsourced HSE personnel and professional mentorship for organisations and emerging HSE practitioners.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: pageTitle,
    description: pageDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
  },
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  url: company.websiteUrl,
  description: "Dune Consulting helps organisations manage HSE risk, prepare their people and deliver safer workplaces and events through practical training, specialist consulting and competent HSE personnel.",
  address: {
    "@type": "PostalAddress",
    addressLocality: company.addressLocality,
    addressCountry: company.addressCountry,
  },
  telephone: company.telephoneHref,
  email: company.email,
  sameAs: [company.linkedinUrl, company.instagramUrl],
};

export default function Home() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organisationSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Clients />
      <ServicesSection />
      <AboutPreview />
      <WhyChooseUs />
      <Process />
      <FeaturedProjects />
      <Mentorship />
      <CTASection />
    </main>
  );
}
import type { Metadata } from "next";
