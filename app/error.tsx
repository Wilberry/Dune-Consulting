"use client";
import Link from "next/link";
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main
      id="main-content"
      className="bg-off-white flex min-h-[65vh] items-center px-5 py-16"
    >
      <div className="border-line mx-auto max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm">
        <p className="text-amber-hover text-xs font-extrabold tracking-[.18em] uppercase">
          Something went wrong
        </p>
        <h1 className="text-navy mt-3 text-3xl font-extrabold">
          We could not load this page.
        </h1>
        <p className="text-muted mt-4 leading-7">
          Please try again. If the problem continues, return to the homepage and
          contact our team.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="bg-amber text-deep-navy rounded-md px-5 py-3 text-sm font-bold"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border-line text-navy rounded-md border px-5 py-3 text-sm font-bold"
          >
            Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
