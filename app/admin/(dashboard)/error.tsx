"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="border-line rounded-xl border bg-white p-6 sm:p-8">
        <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
          Admin Error
        </p>
        <h1 className="text-navy mt-3 text-2xl font-extrabold">
          This admin view could not be loaded
        </h1>
        <p className="text-muted mt-3 leading-7">
          Try the request again. If the problem continues, check the Supabase
          environment configuration and migration status.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-amber text-deep-navy hover:bg-amber-hover mt-6 rounded-lg px-5 py-3 font-bold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
