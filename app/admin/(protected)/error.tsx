"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <section className="border-line rounded-xl border bg-white p-8 shadow-sm">
        <p className="text-amber-text text-xs font-extrabold tracking-[.18em] uppercase">Admin data</p>
        <h1 className="text-navy mt-2 text-2xl font-extrabold">We could not load this section</h1>
        <p className="text-muted mt-3 text-sm leading-6">
          The admin service could not retrieve the requested information. No changes were made.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-amber text-deep-navy hover:bg-amber-hover mt-6 rounded-md px-5 py-3 text-sm font-bold"
        >
          Try again
        </button>
      </section>
    </div>
  );
}
