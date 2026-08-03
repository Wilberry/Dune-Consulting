import { CTASection } from "@/components/sections/cta-section";
import { Hero } from "@/components/sections/hero";
import {
  AboutPreview,
  Clients,
  FeaturedProjects,
  Impact,
  Mentorship,
  Process,
  ServicesSection,
  Testimonials,
  WhyChooseUs,
} from "@/components/sections/home-sections";
import { company } from "@/data/company";

const pageTitle = "Dune Consulting | HSE Training and Event Safety Management";
const pageDescription =
  "Dune Consulting provides event safety management, tailored HSE training, safety personnel outsourcing and professional HSE mentorship in Nigeria.";

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: "/" },
  openGraph: {
    url: "/",
    title: pageTitle,
    description: pageDescription,
  },
};

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.name,
  url: company.websiteUrl,
  description: "A Lagos-based Health, Safety and Environment consultancy.",
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
      <Impact />
      <FeaturedProjects />
      <Mentorship />
      <Testimonials />
      <CTASection />
    </main>
  );
}
import type { Metadata } from "next";
