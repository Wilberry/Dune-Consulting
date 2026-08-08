export function SectionFoundation({
  eyebrow,
  title,
  description,
  count,
  countLabel,
  error,
}: {
  eyebrow: string;
  title: string;
  description: string;
  count: number | null;
  countLabel: string;
  error?: boolean;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
        {eyebrow}
      </p>
      <h1 className="text-navy mt-2 text-3xl font-extrabold sm:text-4xl">
        {title}
      </h1>
      <p className="text-muted mt-3 max-w-2xl leading-7">{description}</p>

      <section className="border-line mt-8 rounded-xl border bg-white p-6">
        {error ? (
          <>
            <h2 className="text-navy text-lg font-bold">Data unavailable</h2>
            <p className="text-muted mt-2 text-sm leading-6">
              This section is ready, but Supabase could not return its data.
              Check the environment variables and database migration.
            </p>
          </>
        ) : (
          <>
            <p className="text-muted text-sm font-semibold">{countLabel}</p>
            <p className="text-navy mt-2 text-4xl font-extrabold">
              {count ?? 0}
            </p>
            <div className="bg-off-white mt-6 rounded-lg p-5">
              <p className="text-navy font-bold">
                Management workflow arrives in Phase Two
              </p>
              <p className="text-muted mt-2 text-sm leading-6">
                Phase One establishes secure routing, permissions and live
                database awareness without introducing incomplete CRUD controls.
              </p>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
