import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/layout/brand";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="bg-off-white flex min-h-[65vh] items-center py-16"
    >
      <Container>
        <div className="border-line mx-auto max-w-2xl rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="flex justify-center">
            <Brand />
          </div>
          <p className="text-amber-hover font-heading mt-9 text-sm font-extrabold tracking-[.2em] uppercase">
            Error 404
          </p>
          <h1 className="text-navy mt-3 text-4xl font-extrabold sm:text-5xl">
            This page could not be found.
          </h1>
          <p className="text-muted mx-auto mt-5 max-w-lg leading-7">
            The address may be incorrect, or the page may have moved. Return to
            the homepage or contact our team if you need help finding safety
            information or support.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="bg-amber text-deep-navy hover:bg-amber-hover inline-flex min-h-12 items-center justify-center rounded-md px-5 py-3 text-sm font-bold"
            >
              Back to homepage
            </Link>
            <Link
              href="/contact"
              className="border-navy/20 text-navy hover:border-navy inline-flex min-h-12 items-center justify-center rounded-md border px-5 py-3 text-sm font-bold"
            >
              Contact our team
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
