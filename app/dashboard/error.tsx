"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Do not print exceptions containing private profile or database values.
    void error;
  }, [error]);

  return (
    <main className="bg-off-white flex min-h-screen items-center justify-center p-6">
      <section role="alert" className="border-line w-full max-w-lg rounded-xl border bg-white p-8">
        <h1 className="text-navy text-2xl font-bold">Dashboard temporarily unavailable</h1>
        <p className="text-muted mt-3 text-sm leading-6">
          We could not safely load your enrolment data. No information has
          been changed. Please retry or contact Dune Consulting.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-navy mt-5 rounded-lg px-5 py-3 text-sm font-bold text-white"
        >
          Try again
        </button>
        <Link href="/" className="text-navy mt-5 block text-sm font-semibold underline">
          Return to Dune Consulting
        </Link>
      </section>
    </main>
  );
}
