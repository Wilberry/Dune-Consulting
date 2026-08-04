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
      <Container className="grid gap-10 text-center sm:text-left py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.15fr]">
        <div>
          <Brand inverse variant="footer" />
          <p className="mt-5 max-w-sm leading-7 text-white/65">
            Dune Consulting helps organisations manage HSE risk, prepare their people and deliver safer workplaces and events through practical training, specialist consulting and competent HSE personnel.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              href={company.linkedinUrl}
              aria-label={`${company.name} on LinkedIn`}
              className="hover:border-amber hover:text-amber rounded border border-white/20 p-2"
            >
              <Linkedin size={19} />
            </a>
            <a
              href={company.instagramUrl}
              aria-label={`${company.name} on Instagram`}
              className="hover:border-amber hover:text-amber rounded border border-white/20 p-2"
            >
              <Instagram size={19} />
            </a>
          </div>
        </div>
        <div>
          <h2 className="text-amber text-sm font-bold tracking-wider uppercase">
            Company
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {[
              ["About", "/about"],
              ["Portfolio", "/portfolio"],
              ["Insights", "/insights"],
              ["Contact", "/contact"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link className="hover:text-white" href={href}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-amber text-sm font-bold tracking-wider uppercase">
            Services
          </h2>
          <ul className="mt-5 space-y-3 text-sm text-white/70">
            {serviceNavigation.map((item) => (
              <li key={item.href}>
                <Link className="hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/mentorship" className="hover:text-white">
                HSE Mentorship Program
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="text-amber text-sm font-bold tracking-wider uppercase">
            Contact
          </h2>
          <ul className="mt-5 space-y-4 text-sm text-white/70">
            <li className="flex gap-3">
              <MapPin className="text-amber shrink-0" size={18} />
              {company.location}
            </li>
            <li>
              <a
                className="flex gap-3 hover:text-white"
                href={`tel:${company.telephoneHref}`}
              >
                <Phone className="text-amber shrink-0" size={18} />
                {company.telephone}
              </a>
            </li>
            <li>
              <a
                className="flex gap-3 hover:text-white"
                href={`mailto:${company.email}`}
              >
                <Mail className="text-amber shrink-0" size={18} />
                {company.email}
              </a>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-5 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
