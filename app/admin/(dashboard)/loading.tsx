export default function AdminLoading() {
  return (
    <div className="mx-auto max-w-7xl" aria-live="polite" aria-busy="true">
      <div className="bg-line/70 h-3 w-28 animate-pulse rounded" />
      <div className="bg-line/70 mt-4 h-10 w-64 max-w-full animate-pulse rounded" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="border-line h-32 animate-pulse rounded-xl border bg-white" />
        ))}
      </div>
      <span className="sr-only">Loading admin data</span>
    </div>
  );
}
