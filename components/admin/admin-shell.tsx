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
    <nav className="mt-8 space-y-1" aria-label="Admin navigation">
      {visibleNavigation.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-colors ${
              active
                ? "bg-amber text-deep-navy"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="bg-off-white min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="bg-deep-navy sticky top-0 hidden h-screen flex-col p-6 lg:flex">
        <Brand
          className="[&_span]:text-white"
          logoClassName="h-10 w-auto"
          textClassName="text-base"
        />
        {navigationList}
        <div className="mt-auto border-t border-white/10 pt-5">
          <p className="truncate text-sm font-semibold text-white">
            {user.fullName || user.email}
          </p>
          <p className="mt-1 text-xs font-bold tracking-[0.12em] text-white/50 uppercase">
            {user.role}
          </p>
          <button
            type="button"
            disabled={loggingOut}
            onClick={logout}
            className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-semibold text-white/75 hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <LogOut size={18} aria-hidden="true" />
            {loggingOut ? "Signing out…" : "Logout"}
          </button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-line sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-5 lg:px-8">
          <button
            type="button"
            className="text-navy rounded-md p-2 lg:hidden"
            aria-label="Open admin navigation"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="ml-auto text-right">
            <p className="text-navy text-sm font-bold">
              {user.fullName || "Dune Staff"}
            </p>
            <p className="text-muted text-xs">{user.email}</p>
          </div>
        </header>

        <main id="main-content" className="p-5 sm:p-7 lg:p-10">
          {children}
        </main>
      </div>

      <div
        className={`bg-deep-navy/50 fixed inset-0 z-50 transition-opacity lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <aside
        className={`bg-deep-navy fixed inset-y-0 left-0 z-[60] w-[min(88vw,320px)] p-6 shadow-2xl transition-transform lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile admin navigation"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between">
          <Brand
            className="[&_span]:text-white"
            logoClassName="h-9 w-auto"
            textClassName="text-sm"
          />
          <button
            type="button"
            className="rounded p-2 text-white"
            aria-label="Close admin navigation"
            onClick={() => setOpen(false)}
          >
            <X size={22} />
          </button>
        </div>
        {navigationList}
        <button
          type="button"
          disabled={loggingOut}
          onClick={logout}
          className="mt-8 flex w-full items-center gap-3 rounded-lg border border-white/10 px-3 py-3 text-sm font-semibold text-white/80 disabled:opacity-50"
        >
          <LogOut size={18} aria-hidden="true" />
          {loggingOut ? "Signing out…" : "Logout"}
        </button>
      </aside>
    </div>
  );
}
