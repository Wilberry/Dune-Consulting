"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ReviewBanner } from "@/components/layout/review-banner";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdmin) return children;

  return (
    <>
      <ReviewBanner />
      <Header />
      <WhatsAppButton />
      {children}
      <Footer />
    </>
  );
}
