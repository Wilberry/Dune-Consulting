import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ReviewBanner } from "@/components/layout/review-banner";
import { company } from "@/data/company";
import { deploymentEnv } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.websiteUrl),
  title: {
    default: "HSE Consulting, Event Safety & Training | Dune Consulting",
    template: `%s | ${company.name}`,
  },
  description:
    "Dune Consulting provides practical HSE training, event safety management and outsourced HSE personnel for organisations and events.",
  robots: deploymentEnv.isVercelPreview
    ? { index: false, follow: false, nocache: true }
    : { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/images/mainlogo.png",
    shortcut: "/images/mainlogo.png",
    apple: "/images/mainlogo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.name,
    title: "HSE Consulting, Event Safety & Training | Dune Consulting",
    description:
      "Practical HSE training, event safety management and outsourced HSE personnel for organisations and events.",
  },
  twitter: {
    card: "summary_large_image",
    title: "HSE Consulting, Event Safety & Training | Dune Consulting",
    description:
      "Practical HSE training, event safety management and outsourced HSE personnel for organisations and events.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a
          href="#main-content"
          className="bg-amber text-deep-navy fixed top-3 left-3 z-[100] -translate-y-24 rounded px-4 py-2 font-bold focus:translate-y-0"
        >
          Skip to content
        </a>
        <ReviewBanner />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
