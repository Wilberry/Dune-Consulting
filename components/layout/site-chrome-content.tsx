"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { ReviewBanner } from "@/components/layout/review-banner";

export function SiteChromeContent({
  children,
  header,
  footer,
  whatsapp,
}: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
  whatsapp: ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isMentee =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  if (isAdmin || isMentee) return children;

  return (
    <>
      <ReviewBanner />
      {header}
      {whatsapp}
      <div key={pathname} className="page-motion">
        {children}
      </div>
      {footer}
    </>
  );
}
