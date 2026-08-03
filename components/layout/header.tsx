"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { Brand } from "./brand";
import { Container } from "@/components/ui/container";
import { navigation, serviceNavigation } from "@/data/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  return (
    <>
      <div className="bg-deep-navy text-white/75">
        <Container className="flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} aria-hidden="true" />
              Lagos, Nigeria
            </span>
            <a
              className="hidden items-center gap-1.5 hover:text-white sm:flex"
              href="tel:+2340000000000"
            >
              <Phone size={13} aria-hidden="true" />
              +234 (0) 000 000 0000
            </a>
            <a
              className="hidden items-center gap-1.5 hover:text-white md:flex"
              href="mailto:hello@duneconsulting.example"
            >
              <Mail size={13} aria-hidden="true" />
              hello@duneconsulting.example
            </a>
          </div>
          <Link
            className="text-amber font-bold hover:text-white"
            href="/contact#consultation"
          >
            Request a Quote
          </Link>
        </Container>
      </div>
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-transparent bg-white transition-shadow",
          scrolled && "border-line shadow-sm",
        )}
      >
        <Container className="flex h-[76px] items-center justify-between">
          <Brand />
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) =>
              item.label === "Services" ? (
                <div key={item.href} className="group relative">
                  <Link
                    className="text-ink hover:text-navy flex items-center gap-1 rounded px-3 py-3 text-sm font-semibold"
                    href={item.href}
                  >
                    Services
                    <ChevronDown size={14} aria-hidden="true" />
                  </Link>
                  <div className="border-line invisible absolute top-full left-0 w-72 translate-y-2 rounded-lg border bg-white p-2 opacity-0 shadow-xl transition-all group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    {serviceNavigation.map((sub) => (
                      <Link
                        key={sub.href}
                        className="hover:bg-off-white hover:text-navy block rounded px-4 py-3 text-sm font-semibold"
                        href={sub.href}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  className="text-ink hover:text-navy rounded px-3 py-3 text-sm font-semibold"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
          <Link
            href="/contact#consultation"
            className="bg-amber text-deep-navy hover:bg-amber-hover hidden rounded-md px-4 py-3 text-sm font-bold lg:block"
          >
            Request a Quote
          </Link>
          <button
            className="text-navy rounded p-2 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={open}
          >
            <Menu />
          </button>
        </Container>
      </header>
      <div
        className={cn(
          "bg-deep-navy/50 fixed inset-0 z-[60] transition-opacity lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-[min(90vw,390px)] bg-white p-6 shadow-2xl transition-transform lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mobile navigation"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button
            className="text-navy rounded p-2"
            onClick={() => setOpen(false)}
            aria-label="Close navigation menu"
          >
            <X />
          </button>
        </div>
        <nav
          className="mt-10 flex flex-col"
          aria-label="Mobile main navigation"
        >
          {navigation.map((item) =>
            item.label === "Services" ? (
              <div key={item.href}>
                <button
                  className="border-line text-navy flex w-full items-center justify-between border-b py-4 text-left font-bold"
                  onClick={() => setServicesOpen(!servicesOpen)}
                  aria-expanded={servicesOpen}
                >
                  Services
                  <ChevronDown
                    className={cn(
                      "transition-transform",
                      servicesOpen && "rotate-180",
                    )}
                    size={18}
                  />
                </button>
                {servicesOpen && (
                  <div className="border-line bg-off-white border-b px-4 py-2">
                    {serviceNavigation.map((sub) => (
                      <Link
                        key={sub.href}
                        onClick={() => setOpen(false)}
                        className="text-ink block py-3 text-sm font-semibold"
                        href={sub.href}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                onClick={() => setOpen(false)}
                className="border-line text-navy border-b py-4 font-bold"
                href={item.href}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
        <Link
          href="/contact#consultation"
          onClick={() => setOpen(false)}
          className="bg-amber text-deep-navy mt-8 block rounded-md px-5 py-4 text-center font-bold"
        >
          Request a Quote
        </Link>
      </aside>
    </>
  );
}
