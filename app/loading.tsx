export default function Loading() {
  return (
    <main
      id="main-content"
      className="bg-off-white min-h-[65vh] py-16"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="mx-auto max-w-7xl animate-pulse px-5 sm:px-8 lg:px-10">
        <div className="bg-navy/10 h-4 w-36 rounded" />
        <div className="bg-navy/10 mt-6 h-12 max-w-2xl rounded" />
        <div className="bg-navy/10 mt-4 h-5 max-w-xl rounded" />
        <div className="border-line mt-12 h-72 rounded-2xl border bg-white" />
        <span className="sr-only">Loading content…</span>
      </div>
    </main>
  );
}
