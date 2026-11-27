"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { Brand } from "./brand";
import { Container } from "@/components/ui/container";
import { navigation, serviceNavigation } from "@/data/navigation";
import { cn } from "@/lib/utils";

function isNavigationItemActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "#") {
    return pathname === "/services" || pathname.startsWith("/services/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLElement>(null);
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
  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
      if (event.key === "Tab") {
        const focusable =
          mobileDialogRef.current?.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          );
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);
  return (
    <>
      <header
        className={cn(
          "site-header-enter sticky top-0 z-50 -mb-[80px] px-3 pt-4 sm:-mb-[92px] sm:px-5 sm:pt-5",
          scrolled && "pt-2",
        )}
      >
        <Container
          className={cn(
            "mx-auto flex h-16 max-w-[1280px] items-center justify-between rounded-xl border border-white/20 bg-gradient-to-r from-[#29445f]/95 via-[#1b3551]/95 to-[#28435e]/95 px-4 shadow-[0_12px_36px_rgba(3,12,25,0.28)] ring-1 ring-white/10 backdrop-blur-2xl transition-all duration-300 sm:h-[4.5rem] sm:rounded-xl sm:px-6",
            scrolled &&
              "from-[#1e3854]/96 via-[#142d49]/96 to-[#233f5b]/96 shadow-[0_8px_28px_rgba(3,12,25,0.34)]",
          )}
        >
          <Brand
            variant="footer"
            logoClassName="h-10 w-auto sm:h-11"
            textClassName="text-sm font-semibold text-white sm:text-base md:text-lg"
          />
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Main navigation"
          >
            {navigation.map((item) => {
              const active = isNavigationItemActive(pathname, item.href);
              return item.label === "Services" ? (
                <div key={item.href} className="group relative">
                  <button
                    type="button"
                    className={cn(
                      "flex items-center gap-1 rounded-md border px-3 py-3 text-sm font-semibold text-white/90 transition-colors hover:text-white",
                      active
                        ? "border-amber bg-amber/10 text-navy"
                        : "border-transparent",
                    )}
                    aria-label="Services menu"
                    aria-current={active ? "page" : undefined}
                  >
                    Services
                    <ChevronDown size={14} aria-hidden="true" />
                  </button>
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
                  className={cn(
                    "rounded-md border px-3 py-3 text-sm font-semibold text-white/90 transition-colors hover:text-white",
                    active
                      ? "border-amber bg-amber/10 text-navy"
                      : "border-transparent",
                  )}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <MembershipAccess
            mode={authMode}
            onModeChange={setAuthMode}
            className="hidden w-44 lg:flex"
          />
          <button
            ref={menuButtonRef}
            className="flex h-10 w-10 items-center justify-center rounded p-2 text-white lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={open}
          >
            <Menu size={24} />
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
        ref={mobileDialogRef}
        className={cn(
          "fixed inset-y-0 right-0 z-[70] w-[min(90vw,390px)] border border-white/20 bg-white/75 p-6 shadow-[0_8px_30px_rgba(15,35,68,0.08)] backdrop-blur-xl transition-transform lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
        aria-label="Mobile navigation"
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        inert={!open}
      >
        <div className="flex items-center justify-between">
          <Brand
            logoClassName="h-10 w-auto"
            textClassName="text-sm font-semibold"
          />
          <button
            ref={closeButtonRef}
            className="text-navy rounded p-2"
            onClick={() => {
              setOpen(false);
              menuButtonRef.current?.focus();
            }}
            aria-label="Close navigation menu"
          >
            <X />
          </button>
        </div>
        <nav
          className="mt-10 flex flex-col"
          aria-label="Mobile main navigation"
        >
          {navigation.map((item) => {
            const active = isNavigationItemActive(pathname, item.href);
            return item.label === "Services" ? (
              <div key={item.href}>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-3 py-4 text-left font-bold",
                    active
                      ? "border-amber bg-amber/10 text-navy"
                      : "text-navy border-transparent",
                  )}
                  onClick={() => setServicesOpen(!servicesOpen)}
                  aria-expanded={servicesOpen}
                  aria-current={active ? "page" : undefined}
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
                  <div className="mt-3 overflow-hidden rounded-xl border border-white/30 bg-white/45 shadow-[0_10px_30px_rgba(15,35,68,0.10)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/35">
                    {serviceNavigation.map((sub) => (
                      <Link
                        key={sub.href}
                        onClick={() => setOpen(false)}
                        className="block border-b border-white/30 px-5 py-4 text-base font-medium text-[#0F2344] transition-colors last:border-b-0 hover:bg-white/35 focus:bg-white/35"
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
                className={cn(
                  "rounded-md border px-3 py-4 font-bold",
                  active
                    ? "border-amber bg-amber/10 text-navy"
                    : "text-navy border-transparent",
                )}
                href={item.href}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <MembershipAccess
          mode={authMode}
          onModeChange={setAuthMode}
          className="mx-auto mt-8 flex w-full max-w-[342px]"
          onNavigate={() => setOpen(false)}
        />
      </aside>
    </>
  );
}

function MembershipAccess({
  mode,
  onModeChange,
  className,
  onNavigate,
}: {
  mode: "register" | "login";
  onModeChange: (mode: "register" | "login") => void;
  className?: string;
  onNavigate?: () => void;
}) {
  const isLogin = mode === "login";
  const label = isLogin ? "Login" : "Register";

  return (
    <div
      role="group"
      aria-label="Membership access"
      className={cn(
        "to-amber/25 hover:to-amber/30 relative h-12 items-center rounded-full border border-white/35 bg-gradient-to-br from-white/25 via-white/10 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_8px_24px_rgba(3,12,25,0.2)] backdrop-blur-2xl transition-all hover:border-white/50 hover:from-white/30 hover:via-white/15",
        className,
      )}
    >
      <Link
        href={isLogin ? "/dashboard/login" : "/dashboard/login?mode=signup"}
        onClick={onNavigate}
        className="hover:text-amber absolute inset-y-1 flex items-center justify-center rounded-full text-sm font-extrabold text-white transition-colors"
        style={
          isLogin
            ? { left: "44px", right: "4px" }
            : { left: "4px", right: "44px" }
        }
      >
        {label}
      </Link>
      <button
        type="button"
        role="switch"
        aria-label={`Switch to ${isLogin ? "register" : "login"}`}
        aria-checked={isLogin}
        onClick={() => onModeChange(isLogin ? "register" : "login")}
        className="border-amber-hover absolute top-1 flex size-10 items-center justify-center rounded-full border-2 bg-white/90 shadow-[0_2px_8px_rgba(3,12,25,0.24)] backdrop-blur-md transition-[left,transform] duration-300 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        style={{
          left: isLogin ? "4px" : "calc(100% - 44px)",
        }}
      >
        <Image
          src="/images/mainlogo.svg"
          alt=""
          aria-hidden="true"
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
      </button>
    </div>
  );
}
