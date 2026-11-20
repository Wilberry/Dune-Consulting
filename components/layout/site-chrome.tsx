"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ReviewBanner } from "@/components/layout/review-banner";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { company } from "@/data/company";
import type { CompanyContactDetails } from "@/lib/company-contact";

const defaultContactDetails: CompanyContactDetails = {
  telephone: company.telephone,
  telephoneHref: company.telephoneHref,
  email: company.email,
};

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [contactDetails, setContactDetails] = useState(defaultContactDetails);
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  const isMentee =
    pathname === "/dashboard" || pathname.startsWith("/dashboard/");

  useEffect(() => {
    if (isAdmin || isMentee) return;

    const controller = new AbortController();
    fetch("/api/company-contact", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(
            `Public contact details request failed with status ${response.status}.`,
          );
        }
        return (await response.json()) as CompanyContactDetails;
      })
      .then(setContactDetails)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.error(
            "Unable to refresh public company contact details",
            error,
          );
        }
      });

    return () => controller.abort();
  }, [isAdmin, isMentee]);

  if (isAdmin || isMentee) return children;

  return (
    <>
      <ReviewBanner />
      <Header />
      <WhatsAppButton phone={contactDetails.telephone} />
      <div key={pathname} className="page-motion">
        {children}
      </div>
      <Footer contactDetails={contactDetails} />
    </>
  );
}
