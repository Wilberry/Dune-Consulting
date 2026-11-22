import type { Metadata } from "next";
import { CTASection } from "@/components/sections/cta-section";
import { Hero } from "@/components/sections/hero";
import {
  AboutPreview,
  Clients,
  FeaturedProjects,
  FAQSection,
  Mentorship,
  ServicesSection,
  Testimonials,
  WhyChooseUs,
} from "@/components/sections/home-sections";
import { company } from "@/data/company";
import { getCompanyContactDetails } from "@/lib/company-contact";

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

function getOrganisationSchema(
  contactDetails: Awaited<ReturnType<typeof getCompanyContactDetails>>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.websiteUrl,
    description:
      "Dune Consulting helps organisations manage HSE risk, prepare their people and deliver safer workplaces and events through practical training, specialist consulting and competent HSE personnel.",
    address: {
      "@type": "PostalAddress",
      addressLocality: company.addressLocality,
      addressCountry: company.addressCountry,
    },
    telephone: contactDetails.telephoneHref,
    email: contactDetails.email,
    sameAs: [company.linkedinUrl, company.instagramUrl],
  };
}

export default async function Home() {
  const contactDetails = await getCompanyContactDetails();
  const organisationSchema = getOrganisationSchema(contactDetails);
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
      <FeaturedProjects />
      <Mentorship />
      <Testimonials />
      <FAQSection />
      <CTASection />
    </main>
  );
}
