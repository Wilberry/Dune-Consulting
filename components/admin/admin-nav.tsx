"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, FileText, GraduationCap, Mail, Menu, Settings, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/insights", label: "Insights", icon: BookOpen },
  { href: "/admin/enquiries", label: "Contact Enquiries", icon: Mail },
  { href: "/admin/quotes", label: "Quote Requests", icon: FileText },
  { href: "/admin/mentorship", label: "Mentorship Applications", icon: GraduationCap },
  { href: "/admin/newsletter", label: "Newsletter", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = (
    <nav aria-label="Admin navigation" className="space-y-1">
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition", active ? "bg-amber text-deep-navy" : "text-white/80 hover:bg-white/10 hover:text-white")}>
            <Icon size={18} aria-hidden="true" />{label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="border-line rounded-md border bg-white p-2 lg:hidden" aria-label="Open admin navigation"><Menu size={22} /></button>
      <aside className="bg-deep-navy hidden min-h-screen w-72 shrink-0 p-5 lg:block">{nav}</aside>
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <button className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} aria-label="Close admin navigation overlay" />
          <aside className="bg-deep-navy relative z-10 h-full w-[min(86vw,320px)] p-5 shadow-2xl">
            <div className="mb-6 flex justify-end"><button type="button" onClick={() => setOpen(false)} className="rounded-md p-2 text-white" aria-label="Close admin navigation"><X /></button></div>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
