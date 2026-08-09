import { updateQuoteStatus } from "@/app/admin/(dashboard)/quotes/actions";
import { requireAdminUser } from "@/lib/admin/auth";
import { getQuoteRequests, type QuoteRequestStatus } from "@/lib/admin/quotes";

const statuses: { value: QuoteRequestStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "contacted", label: "Contacted" },
  { value: "converted", label: "Converted" },
  { value: "closed", label: "Closed" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatProjectDate(value: string | null) {
  if (!value) return "Not provided";
  return new Intl.DateTimeFormat("en-NG", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
}

export default async function AdminQuotesPage() {
  await requireAdminUser();

  let quotes: Awaited<ReturnType<typeof getQuoteRequests>> = [];
  let loadError = false;

  try {
    quotes = await getQuoteRequests();
  } catch {
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Commercial Requests
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">
            Quote Requests
          </h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Review commercial requests submitted through the public quote form
            and keep each opportunity&apos;s response status current.
          </p>
        </div>
        <div className="border-line rounded-lg border bg-white px-4 py-3 text-sm">
          <span className="text-muted">Stored quote requests</span>{" "}
          <strong className="text-navy">{quotes.length}</strong>
        </div>
      </div>

      {loadError ? (
        <div
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          role="alert"
        >
          Quote requests could not be loaded. Check the Supabase connection and
          try again.
        </div>
      ) : quotes.length === 0 ? (
        <div className="border-line mt-8 rounded-xl border bg-white p-8 text-center">
          <h2 className="text-navy text-lg font-bold">No quote requests yet</h2>
          <p className="text-muted mt-2 text-sm">
            New commercial requests will appear here after the public quote form
            records them in Supabase.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {quotes.map((quote) => (
            <article
              key={quote.id}
              className="border-line rounded-xl border bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="bg-navy rounded-full px-3 py-1 text-xs font-extrabold tracking-wide text-white">
                      {quote.referenceNumber}
                    </span>
                    <span className="bg-off-white text-navy rounded-full px-3 py-1 text-xs font-bold capitalize">
                      {quote.status}
                    </span>
                  </div>

                  <h2 className="text-navy mt-4 text-xl font-extrabold">
                    {quote.name}
                  </h2>
                  <p className="text-muted mt-1 text-sm">
                    {quote.service} · Received {formatDate(quote.createdAt)}
                  </p>

                  <dl className="mt-5 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <dt className="text-muted font-semibold">Email</dt>
                      <dd className="mt-1">
                        <a
                          href={`mailto:${quote.email}`}
                          className="text-navy decoration-amber font-semibold underline decoration-2 underline-offset-4"
                        >
                          {quote.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Phone</dt>
                      <dd className="text-navy mt-1 font-semibold">
                        {quote.phone}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Company</dt>
                      <dd className="text-navy mt-1">
                        {quote.company || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Location</dt>
                      <dd className="text-navy mt-1">
                        {quote.location || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">
                        Expected start date
                      </dt>
                      <dd className="text-navy mt-1">
                        {formatProjectDate(quote.expectedStartDate)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">
                        Participants / people
                      </dt>
                      <dd className="text-navy mt-1">
                        {quote.participantCount ?? "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted font-semibold">Last updated</dt>
                      <dd className="text-navy mt-1">
                        {formatDate(quote.updatedAt)}
                      </dd>
                    </div>
                  </dl>

                  <div className="bg-off-white mt-5 rounded-lg p-4">
                    <h3 className="text-navy text-sm font-bold">
                      Project or event description
                    </h3>
                    <p className="text-ink mt-2 text-sm leading-6 whitespace-pre-wrap">
                      {quote.projectDescription}
                    </p>
                  </div>

                  {quote.additionalRequirements && (
                    <div className="border-line mt-4 rounded-lg border p-4">
                      <h3 className="text-navy text-sm font-bold">
                        Additional requirements
                      </h3>
                      <p className="text-ink mt-2 text-sm leading-6 whitespace-pre-wrap">
                        {quote.additionalRequirements}
                      </p>
                    </div>
                  )}
                </div>

                <form
                  action={updateQuoteStatus}
                  className="border-line bg-off-white w-full rounded-lg border p-4 xl:w-60"
                >
                  <input type="hidden" name="id" value={quote.id} />
                  <label
                    htmlFor={`quote-status-${quote.id}`}
                    className="text-navy text-sm font-bold"
                  >
                    Commercial status
                  </label>
                  <select
                    id={`quote-status-${quote.id}`}
                    name="status"
                    defaultValue={quote.status}
                    className="border-line text-ink mt-2 w-full rounded-md border bg-white px-3 py-2.5 text-sm"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="bg-navy hover:bg-deep-navy mt-3 w-full rounded-md px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Save status
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
