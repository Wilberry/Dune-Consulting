export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse" aria-live="polite" aria-busy="true">
      <span className="sr-only">Loading admin data</span>
      <div className="h-3 w-28 rounded bg-slate-200" />
      <div className="mt-3 h-9 w-64 rounded bg-slate-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border-line h-32 rounded-xl border bg-white p-5 shadow-sm">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="mt-5 h-8 w-20 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
