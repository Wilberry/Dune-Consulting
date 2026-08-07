import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { company } from "@/data/company";
const pageDescription =
  "Speak with Dune Consulting about event safety, HSE training, safety personnel or mentorship support.";
export const metadata: Metadata = {
  title: "Contact",
  description: pageDescription,
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: "Contact Dune Consulting",
    description: pageDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Dune Consulting",
    description: pageDescription,
  },
};
export default function ContactPage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Contact Dune"
        title="Let's plan the right safety support for your organisation."
        copy="Share your event, training or personnel requirements and our team will help define the next step."
        image="/images/contact_office.webp"
      />
      <section className="py-16 sm:py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact Info Column */}
          <div>
            <h2 className="text-navy text-2xl font-bold">Get in touch</h2>
            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-3">
                <MapPin className="text-amber-hover shrink-0 mt-0.5" size={20} />
                <span className="text-sm text-navy">{company.location}</span>
              </li>
              <li>
                <a
                  className="flex items-start gap-3 hover:text-amber transition"
                  href={`tel:${company.telephoneHref}`}
                >
                  <Phone className="text-amber-hover shrink-0 mt-0.5" size={20} />
                  <span className="text-sm text-navy">{company.telephone}</span>
                </a>
              </li>
              <li>
                <a
                  className="flex items-start gap-3 hover:text-amber transition"
                  href={`mailto:${company.email}`}
                >
                  <Mail className="text-amber-hover shrink-0 mt-0.5" size={20} />
                  <span className="text-sm text-navy">{company.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Form Column */}
          <ConsultationForm />
        </Container>
      </section>
    </main>
  );
}
