import Link from "next/link";
import {
  syncNewsletterSubscribers,
  updateNewsletterStatus,
} from "@/app/admin/(dashboard)/newsletter/actions";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  getNewsletterSubscribers,
  type NewsletterSubscriberStatus,
} from "@/lib/admin/newsletter";
import { getNewsletterProviderEnvironment } from "@/lib/server-env";

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

  const provider = getNewsletterProviderEnvironment();
  const activeCount = subscribers.filter(
    (subscriber) => subscriber.status === "subscribed",
  ).length;
  const suppressedCount = subscribers.filter(
    (subscriber) => subscriber.deliverabilityStatus !== "ok",
  ).length;
  const syncPendingCount = subscribers.filter(
    (subscriber) =>
      !subscriber.externalContactId || Boolean(subscriber.providerSyncError),
  ).length;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Audience
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">Newsletter</h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Supabase remains the source of truth for consent and deliverability.
            Resend contact synchronization is secondary and powers approved
            Broadcast campaigns.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/newsletter/campaigns"
            className="bg-navy hover:bg-deep-navy inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-extrabold text-white"
          >
            Campaigns
          </Link>
          <form action={syncNewsletterSubscribers}>
            <button
              type="submit"
              disabled={!provider.configured || syncPendingCount === 0}
              className="bg-amber text-deep-navy hover:bg-amber-hover min-h-11 rounded-md px-5 py-3 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sync next 10
            </button>
          </form>
        </div>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Active subscribers" value={activeCount} />
        <Stat label="Total records" value={subscribers.length} />
        <Stat label="Suppressed" value={suppressedCount} />
        <Stat label="Need provider sync" value={syncPendingCount} />
        <div className="border-line rounded-lg border bg-white px-4 py-3 text-sm">
          <span className="text-muted">Provider</span>{" "}
          <strong className={provider.configured ? "text-green-800" : "text-red-700"}>
            {provider.configured ? "Configured" : "Not configured"}
          </strong>
        </div>
      </div>

      {!provider.configured && (
        <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
          Resend newsletter delivery is not configured yet. Subscriber storage
          continues to work, but provider synchronization and campaign sending
          remain disabled.
        </div>
      )}

      {loadError ? (
        <div
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          role="alert"
        >
          Newsletter subscribers could not be loaded. Apply the Phase Two
          newsletter campaign migration and check the Supabase connection.
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
                    <DeliverabilityBadge status={subscriber.deliverabilityStatus} />
                    <span className="text-muted text-xs">
                      {subscriber.providerSyncError
                        ? "Provider sync failed"
                        : subscriber.externalContactId
                          ? "Provider synced"
                          : "Provider pending"}
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
                  {subscriber.providerSyncError && (
                    <p className="mt-2 text-xs text-red-700">
                      Sync state: {subscriber.providerSyncError}
                    </p>
                  )}
                  <dl className="text-muted mt-4 grid gap-x-6 gap-y-2 text-xs sm:grid-cols-2 xl:grid-cols-5">
                    <DateItem label="Subscribed" value={subscriber.subscribedAt} />
                    <DateItem label="Unsubscribed" value={subscriber.unsubscribedAt} />
                    <DateItem label="Provider synced" value={subscriber.providerSyncedAt} />
                    <DateItem
                      label="Deliverability updated"
                      value={subscriber.deliverabilityUpdatedAt}
                    />
                    <DateItem label="Last updated" value={subscriber.updatedAt} />
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

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-line rounded-lg border bg-white px-4 py-3 text-sm">
      <span className="text-muted">{label}</span>{" "}
      <strong className="text-navy">{value}</strong>
    </div>
  );
}

function DateItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="font-semibold">{label}</dt>
      <dd className="mt-1">{formatDate(value)}</dd>
    </div>
  );
}

function DeliverabilityBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
        status === "ok" ? "bg-blue-50 text-blue-800" : "bg-red-50 text-red-800"
      }`}
    >
      {status === "ok" ? "Deliverable" : status}
    </span>
  );
}
