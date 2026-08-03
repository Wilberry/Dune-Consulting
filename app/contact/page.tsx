import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ConsultationForm } from "@/components/forms/consultation-form";
import { Container } from "@/components/ui/container";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Speak with Dune Consulting about event safety, HSE training, safety personnel or mentorship support.",
};
export default function ContactPage() {
  return (
    <main id="main-content">
      <section className="bg-navy py-16 text-white">
        <Container>
          <p className="text-amber text-xs font-bold tracking-[.18em] uppercase">
            Contact Dune
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold sm:text-5xl">
            Let’s plan the right safety support for your organisation.
          </h1>
        </Container>
      </section>
      <Container className="grid gap-12 py-16 lg:grid-cols-[.7fr_1.3fr]">
        <div>
          <h2 className="text-navy text-2xl font-bold">Start a conversation</h2>
          <p className="text-muted mt-4 leading-7">
            Share your event, training or personnel requirements and our team
            will help define the next step.
          </p>
          <ul className="mt-8 space-y-5 text-sm">
            <li className="flex gap-3">
              <MapPin className="text-amber-hover" />
              Lagos, Nigeria
            </li>
            <li>
              <a className="flex gap-3" href="tel:+2340000000000">
                <Phone className="text-amber-hover" />
                +234 (0) 000 000 0000
              </a>
            </li>
            <li>
              <a
                className="flex gap-3"
                href="mailto:hello@duneconsulting.example"
              >
                <Mail className="text-amber-hover" />
                hello@duneconsulting.example
              </a>
            </li>
          </ul>
          <p className="border-amber/40 bg-amber/10 text-muted mt-8 rounded border p-4 text-xs leading-5">
            Contact details are editable placeholders pending client
            confirmation.
          </p>
        </div>
        <ConsultationForm />
      </Container>
    </main>
  );
}
