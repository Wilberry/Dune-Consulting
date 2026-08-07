import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/site-shell";
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
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
