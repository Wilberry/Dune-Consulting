import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { company } from "@/data/company";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(company.websiteUrl),
  title: {
    default: "Dune Consulting | HSE Training and Event Safety Management",
    template: `%s | ${company.name}`,
  },
  description:
    "Dune Consulting provides event safety management, tailored HSE training, safety personnel outsourcing and professional HSE mentorship in Nigeria.",
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/apple-icon" },
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: company.name,
    title: `${company.name} | HSE Training and Event Safety Management`,
    description:
      "Practical HSE solutions for events, workplaces and projects across Nigeria.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dune Consulting | HSE Training and Event Safety Management",
    description:
      "Practical HSE solutions for events, workplaces and projects across Nigeria.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main-content"
          className="bg-amber text-deep-navy fixed top-3 left-3 z-[100] -translate-y-24 rounded px-4 py-2 font-bold focus:translate-y-0"
        >
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
