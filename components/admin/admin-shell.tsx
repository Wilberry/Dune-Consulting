"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { Brand } from "@/components/layout/brand";
import { createClient } from "@/lib/supabase/client";
import type { StaffUser } from "@/lib/admin/types";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    label: "Insights",
    href: "/admin/insights",
    icon: BookOpen,
    adminOnly: false,
  },
  {
    label: "Contact Enquiries",
    href: "/admin/enquiries",
    icon: Mail,
    adminOnly: true,
  },
  {
    label: "Quote Requests",
    href: "/admin/quotes",
    icon: FileText,
    adminOnly: true,
  },
  {
    label: "Mentorship Applications",
    href: "/admin/mentorship",
    icon: Users,
    adminOnly: true,
  },
  {
    label: "Newsletter",
    href: "/admin/newsletter",
    icon: Mail,
    adminOnly: true,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    adminOnly: false,
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({
  user,
  children,
}: {
  user: StaffUser;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const visibleNavigation = navigation.filter(
    (item) => !item.adminOnly || user.role === "admin",
  );
  const displayName = user.fullName || "Dune Staff";
  const userInitial = (user.fullName || user.email || "D").charAt(0).toUpperCase();

  async function logout() {
    setLoggingOut(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const navigationList = (
    <nav className="mt-6 space-y-1.5" aria-label="Admin navigation">
      {visibleNavigation.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all ${
              active
                ? "bg-amber text-deep-navy shadow-sm"
                : "text-white/70 hover:bg-white/8 hover:text-white"
            }`}
          >
            <span
              className={`flex size-8 items-center justify-center rounded-lg transition ${
                active ? "bg-white/25" : "bg-white/5 group-hover:bg-white/10"
              }`}
            >
              <Icon size={17} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="bg-off-white min-h-screen lg:grid lg:grid-cols-[288px_1fr]">
      <aside className="bg-deep-navy sticky top-0 hidden h-screen flex-col border-r border-white/5 px-5 py-6 lg:flex">
        <div className="px-1">
          <Brand
            variant="footer"
            logoClassName="h-10 w-auto"
            textClassName="text-base"
          />
        </div>

        <div className="mt-9 px-2">
          <p className="text-[10px] font-extrabold tracking-[0.18em] text-white/35 uppercase">
            Workspace
          </p>
        </div>
        {navigationList}

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="bg-amber text-deep-navy flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold">
              {userInitial}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">
                {displayName}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/45">{user.email}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
            <span className="rounded-full bg-white/8 px-2.5 py-1 text-[10px] font-extrabold tracking-[0.1em] text-white/55 uppercase">
              {user.role}
            </span>
            <button
              type="button"
              disabled={loggingOut}
              onClick={logout}
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-bold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              <LogOut size={15} aria-hidden="true" />
              {loggingOut ? "Signing out…" : "Logout"}
            </button>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-line sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white/90 px-5 backdrop-blur-xl sm:h-[4.5rem] lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="border-line text-navy rounded-xl border bg-white p-2 shadow-sm lg:hidden"
              aria-label="Open admin navigation"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:block">
              <p className="text-navy text-sm font-extrabold">Admin Workspace</p>
              <p className="text-muted text-xs">Dune Consulting operations</p>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-navy max-w-48 truncate text-sm font-bold">
                {displayName}
              </p>
              <p className="text-muted max-w-48 truncate text-xs">{user.email}</p>
            </div>
            <div className="bg-navy text-amber flex size-9 items-center justify-center rounded-xl text-xs font-extrabold shadow-sm">
              {userInitial}
            </div>
          </div>
        </header>

        <main id="main-content" className="p-4 sm:p-7 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>

      <div
        className={`bg-deep-navy/55 fixed inset-0 z-50 backdrop-blur-sm transition-opacity lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`bg-deep-navy fixed inset-y-0 left-0 z-[60] w-[min(88vw,330px)] border-r border-white/10 p-5 shadow-2xl transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile admin navigation"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between">
          <Brand
            variant="footer"
            logoClassName="h-9 w-auto"
            textClassName="text-sm"
          />
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white"
            aria-label="Close admin navigation"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-8 px-2">
          <p className="text-[10px] font-extrabold tracking-[0.18em] text-white/35 uppercase">
            Workspace
          </p>
        </div>
        {navigationList}
        <button
          type="button"
          disabled={loggingOut}
          onClick={logout}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:opacity-50"
        >
          <LogOut size={18} aria-hidden="true" />
          {loggingOut ? "Signing out…" : "Logout"}
        </button>
      </aside>
    </div>
  );
}
