import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { UnifiedEnquiryForm } from "@/components/forms/unified-enquiry-form";
import { PageHero } from "@/components/ui/page-hero";
import { Container } from "@/components/ui/container";
import { company } from "@/data/company";
const pageDescription =
  "Contact Dune Consulting or request a tailored quote for event safety, HSE training, personnel and professional safety services.";
export const metadata: Metadata = {
  title: "Contact & Quotes",
  description: pageDescription,
  alternates: { canonical: "/contact" },
  openGraph: {
    url: "/contact",
    title: "Contact & Request a Quote | Dune Consulting",
    description: pageDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact & Request a Quote | Dune Consulting",
    description: pageDescription,
  },
};
type ContactPageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { type } = await searchParams;
  const initialIntent = type === "quote" ? "quote" : "enquiry";
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Contact Dune"
        title="Let's talk about your HSE needs."
        copy="Have a question or need professional safety support? Send an enquiry or request a tailored quote in one place."
        image="/images/contact_office.webp"
      />
      <section className="py-16 sm:py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Contact details and the steps to a tailored proposal */}
          <div>
            <h2 className="text-navy text-2xl font-bold">Get in touch</h2>
            <p className="text-muted mt-4 leading-7">
              Questions, project briefs or training needs — choose the right
              purpose in the form and our team will take it from there.
            </p>
            <ul className="mt-8 space-y-5">
              <li className="flex items-start gap-3">
                <MapPin
                  className="text-amber-hover mt-0.5 shrink-0"
                  size={20}
                />
                <span className="text-navy text-sm">{company.location}</span>
              </li>
              <li>
                <a
                  className="hover:text-amber flex items-start gap-3 transition"
                  href={`tel:${company.telephoneHref}`}
                >
                  <Phone
                    className="text-amber-hover mt-0.5 shrink-0"
                    size={20}
                  />
                  <span className="text-navy text-sm">{company.telephone}</span>
                </a>
              </li>
              <li>
                <a
                  className="hover:text-amber flex items-start gap-3 transition"
                  href={`mailto:${company.email}`}
                >
                  <Mail
                    className="text-amber-hover mt-0.5 shrink-0"
                    size={20}
                  />
                  <span className="text-navy text-sm">{company.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* One adaptive form, retaining two separate API workflows */}
          <UnifiedEnquiryForm
            key={initialIntent}
            initialIntent={initialIntent}
          />
        </Container>
      </section>
    </main>
  );
}
