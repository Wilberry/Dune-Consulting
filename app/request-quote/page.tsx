import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { QuoteRequestForm } from "@/components/forms/quote-request-form";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/ui/page-hero";

const pageDescription =
  "Request a tailored quote from Dune Consulting for HSE training, event safety management, personnel outsourcing or other professional HSE support.";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: pageDescription,
  alternates: { canonical: "/request-quote" },
  openGraph: {
    url: "/request-quote",
    title: "Request a Quote | Dune Consulting",
    description: pageDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Request a Quote | Dune Consulting",
    description: pageDescription,
  },
};

export default function RequestQuotePage() {
  return (
    <main id="main-content">
      <PageHero
        eyebrow="Request a Quote"
        title="Tell us what you need and we will scope the right HSE support."
        copy="Share the service, location, timing and operational context. We will review the request and respond with the next commercial step."
        image="/images/contact_office.webp"
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <Container className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
              What happens next
            </p>
            <h2 className="text-navy mt-3 text-2xl font-bold">
              A clearer brief leads to a more useful quote
            </h2>
            <p className="text-muted mt-4 leading-7">
              Your request is stored securely with a unique Dune reference so
              our team can review it consistently and follow up without losing
              the project context.
            </p>
            <ul className="mt-7 space-y-4 text-sm leading-6">
              {[
                "We review the service requirement and project context.",
                "We contact you if scope, timing or operational details need clarification.",
                "We prepare the appropriate commercial response or next-step discussion.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2
                    className="text-success mt-0.5 shrink-0"
                    size={19}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <QuoteRequestForm />
        </Container>
      </section>
    </main>
  );
}
