import { updateNewsletterStatus } from "@/app/admin/(dashboard)/newsletter/actions";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  getNewsletterSubscribers,
  type NewsletterSubscriberStatus,
} from "@/lib/admin/newsletter";

const statuses: { value: NewsletterSubscriberStatus; label: string }[] = [
  { value: "subscribed", label: "Subscribed" },
  { value: "unsubscribed", label: "Unsubscribed" },
];

function formatDate(value: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function AdminNewsletterPage() {
  await requireAdminUser();

  let subscribers: Awaited<ReturnType<typeof getNewsletterSubscribers>> = [];
  let loadError = false;

  try {
    subscribers = await getNewsletterSubscribers();
  } catch {
    loadError = true;
  }

  const activeCount = subscribers.filter(
    (subscriber) => subscriber.status === "subscribed",
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Audience
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">Newsletter</h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Review newsletter signups stored in Supabase and manage each
            subscriber&apos;s active status. External campaign delivery remains
            a separate integration step.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="border-line rounded-lg border bg-white px-4 py-3 text-sm">
            <span className="text-muted">Active subscribers</span>{" "}
            <strong className="text-navy">{activeCount}</strong>
          </div>
          <div className="border-line rounded-lg border bg-white px-4 py-3 text-sm">
            <span className="text-muted">Total records</span>{" "}
            <strong className="text-navy">{subscribers.length}</strong>
          </div>
        </div>
      </div>

      {loadError ? (
        <div
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          role="alert"
        >
          Newsletter subscribers could not be loaded. Check the Supabase
          connection and try again.
        </div>
      ) : subscribers.length === 0 ? (
        <div className="border-line mt-8 rounded-xl border bg-white p-8 text-center">
          <h2 className="text-navy text-lg font-bold">No subscribers yet</h2>
          <p className="text-muted mt-2 text-sm">
            Footer newsletter signups will appear here after they are safely
            recorded in Supabase.
          </p>
        </div>
      ) : (
        <div className="border-line mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="divide-line divide-y">
            {subscribers.map((subscriber) => (
              <article
                key={subscriber.id}
                className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        subscriber.status === "subscribed"
                          ? "bg-green-50 text-green-800"
                          : "bg-off-white text-muted"
                      }`}
                    >
                      {subscriber.status === "subscribed"
                        ? "Subscribed"
                        : "Unsubscribed"}
                    </span>
                    <span className="text-muted text-xs">
                      {subscriber.externalContactId
                        ? "Provider synced"
                        : "Provider not connected"}
                    </span>
                  </div>

                  <h2 className="text-navy mt-3 text-lg font-extrabold break-all">
                    {subscriber.email}
                  </h2>
                  {subscriber.firstName && (
                    <p className="text-muted mt-1 text-sm">
                      {subscriber.firstName}
                    </p>
                  )}
                  <dl className="text-muted mt-4 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <dt className="font-semibold">Subscribed</dt>
                      <dd className="mt-1">
                        {formatDate(subscriber.subscribedAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Unsubscribed</dt>
                      <dd className="mt-1">
                        {formatDate(subscriber.unsubscribedAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Created</dt>
                      <dd className="mt-1">
                        {formatDate(subscriber.createdAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Last updated</dt>
                      <dd className="mt-1">
                        {formatDate(subscriber.updatedAt)}
                      </dd>
                    </div>
                  </dl>
                </div>

                <form
                  action={updateNewsletterStatus}
                  className="border-line bg-off-white w-full rounded-lg border p-4 lg:w-56"
                >
                  <input type="hidden" name="id" value={subscriber.id} />
                  <label
                    htmlFor={`newsletter-status-${subscriber.id}`}
                    className="text-navy text-sm font-bold"
                  >
                    Subscriber status
                  </label>
                  <select
                    id={`newsletter-status-${subscriber.id}`}
                    name="status"
                    defaultValue={subscriber.status}
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
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
