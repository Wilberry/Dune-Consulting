import Link from "next/link";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Brand } from "./brand";
import { Container } from "@/components/ui/container";
import { serviceNavigation } from "@/data/navigation";
import { company } from "@/data/company";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-deep-navy text-white">
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_0.7fr_1fr_1.2fr] lg:py-14">
        {/* Brand Column */}
        <div>
          <Brand inverse variant="footer" />
          <p className="mt-4 max-w-xs leading-7 text-white/65 text-sm">
            Practical HSE training, consulting and personnel to help organisations manage risk and deliver safer operations.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={company.linkedinUrl}
              aria-label={`${company.name} on LinkedIn`}
              className="hover:border-amber hover:text-amber rounded border border-white/20 p-2 transition"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={company.instagramUrl}
              aria-label={`${company.name} on Instagram`}
              className="hover:border-amber hover:text-amber rounded border border-white/20 p-2 transition"
            >
              <Instagram size={18} />
            </a>
          </div>
        </div>

        {/* Company Column */}
        <div>
          <h3 className="text-amber text-xs font-bold tracking-wider uppercase">
            Company
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {[
              ["About", "/about"],
              ["Portfolio", "/portfolio"],
              ["Insights", "/insights"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link className="hover:text-white transition" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services Column */}
        <div>
          <h3 className="text-amber text-xs font-bold tracking-wider uppercase">
            Services
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            {serviceNavigation.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-white transition" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/mentorship" className="hover:text-white transition">
                HSE Mentorship
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact + Newsletter Column */}
        <div>
          {/* Contact Section */}
          <div className="mb-8">
            <h3 className="text-amber text-xs font-bold tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin className="text-amber shrink-0 mt-0.5" size={16} />
                <span>{company.location}</span>
              </li>
              <li>
                <a
                  className="flex items-start gap-3 hover:text-white transition"
                  href={`tel:${company.telephoneHref}`}
                >
                  <Phone className="text-amber shrink-0 mt-0.5" size={16} />
                  <span>{company.telephone}</span>
                </a>
              </li>
              <li>
                <a
                  className="flex items-start gap-3 hover:text-white transition"
                  href={`mailto:${company.email}`}
                >
                  <Mail className="text-amber shrink-0 mt-0.5" size={16} />
                  <span>{company.email}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-amber text-xs font-bold tracking-wider uppercase">
              Newsletter
            </h3>
            <p className="mt-2 text-xs text-white/60">
              Practical HSE insights delivered.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <input
                disabled
                type="email"
                placeholder="Work email"
                className="min-h-10 rounded-md border border-white/15 bg-white/5 px-3 text-xs text-white placeholder:text-white/40 transition"
              />
              <button
                disabled
                className="bg-amber text-deep-navy min-h-10 rounded-md text-xs font-bold opacity-70 transition"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-2 text-xs text-white/50">
              Coming soon
            </p>
          </div>
        </div>
      </Container>

      {/* Copyright Bar */}
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white/70 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/70 transition">
              Terms
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
