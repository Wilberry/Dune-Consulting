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

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dune Consulting",
  url: "https://www.duneconsulting.example",
  description: "A Lagos-based Health, Safety and Environment consultancy.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressCountry: "NG",
  },
  telephone: "+234-000-000-0000",
  email: "hello@duneconsulting.example",
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
