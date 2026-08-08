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
          <Brand
            inverse
            variant="footer"
            logoClassName="h-12 w-auto sm:h-14"
            textClassName="text-base sm:text-lg"
          />
          <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
            Practical HSE training, consulting and personnel to help
            organisations manage risk and deliver safer operations.
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
                <Link className="transition hover:text-white" href={href}>
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
                <Link className="transition hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/mentorship" className="transition hover:text-white">
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
                <MapPin className="text-amber mt-0.5 shrink-0" size={16} />
                <span>{company.location}</span>
              </li>
              <li>
                <a
                  className="flex items-start gap-3 transition hover:text-white"
                  href={`tel:${company.telephoneHref}`}
                >
                  <Phone className="text-amber mt-0.5 shrink-0" size={16} />
                  <span>{company.telephone}</span>
                </a>
              </li>
              <li>
                <a
                  className="flex items-start gap-3 transition hover:text-white"
                  href={`mailto:${company.email}`}
                >
                  <Mail className="text-amber mt-0.5 shrink-0" size={16} />
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
                className="min-h-10 rounded-md border border-white/15 bg-white/5 px-3 text-xs text-white transition placeholder:text-white/40"
              />
              <button
                disabled
                className="bg-amber text-deep-navy min-h-10 rounded-md text-xs font-bold opacity-70 transition"
              >
                Subscribe
              </button>
            </div>
            <p className="mt-2 text-xs text-white/50">Coming soon</p>
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
            <Link href="/privacy" className="transition hover:text-white/70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition hover:text-white/70">
              Terms
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
