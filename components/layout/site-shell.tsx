"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ReviewBanner } from "@/components/layout/review-banner";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <a
        href="#main-content"
        className="bg-amber text-deep-navy fixed top-3 left-3 z-[100] -translate-y-24 rounded px-4 py-2 font-bold focus:translate-y-0"
      >
        Skip to content
      </a>
      {isAdmin ? (
        children
      ) : (
        <>
          <ReviewBanner />
          <Header />
          <WhatsAppButton />
          {children}
          <Footer />
        </>
      )}
    </>
  );
}
