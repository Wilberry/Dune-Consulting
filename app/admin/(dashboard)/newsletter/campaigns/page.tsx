import Link from "next/link";
import { deleteNewsletterCampaign } from "@/app/admin/(dashboard)/newsletter/campaigns/actions";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  getNewsletterAudienceReadiness,
  getNewsletterCampaigns,
} from "@/lib/admin/newsletter";

function formatDate(value: string | null) {
  if (!value) return "Not sent";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function NewsletterCampaignsPage() {
  await requireAdminUser();

  let campaigns: Awaited<ReturnType<typeof getNewsletterCampaigns>> = [];
  let readiness: Awaited<ReturnType<typeof getNewsletterAudienceReadiness>> = {
    activeCount: 0,
    eligibleCount: 0,
    suppressedCount: 0,
    unsyncedCount: 0,
  };
  let loadError = false;

  try {
    [campaigns, readiness] = await Promise.all([
      getNewsletterCampaigns(),
      getNewsletterAudienceReadiness(),
    ]);
  } catch {
    loadError = true;
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/newsletter"
            className="text-navy decoration-amber text-sm font-bold underline decoration-2 underline-offset-4"
          >
            Back to Newsletter
          </Link>
          <p className="text-amber-text mt-6 text-xs font-extrabold tracking-[0.16em] uppercase">
            Delivery
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">Campaigns</h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Prepare HSE newsletter campaigns in Supabase, verify audience
            readiness, then hand approved sends to the configured Resend
            Broadcast segment.
          </p>
        </div>
        <Link
          href="/admin/newsletter/campaigns/new"
          className="bg-amber text-deep-navy hover:bg-amber-hover inline-flex min-h-11 items-center justify-center rounded-md px-5 py-3 text-sm font-extrabold"
        >
          New campaign
        </Link>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Active subscribers" value={readiness.activeCount} />
        <Stat label="Eligible recipients" value={readiness.eligibleCount} />
        <Stat label="Suppressed" value={readiness.suppressedCount} />
        <Stat label="Need provider sync" value={readiness.unsyncedCount} />
      </div>

      {loadError ? (
        <div
          className="mt-8 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800"
          role="alert"
        >
          Newsletter campaign data could not be loaded. Apply the Phase Two
          newsletter campaign migration and check the Supabase connection.
        </div>
      ) : campaigns.length === 0 ? (
        <div className="border-line mt-8 rounded-xl border bg-white p-8 text-center">
          <h2 className="text-navy text-lg font-bold">No campaigns yet</h2>
          <p className="text-muted mt-2 text-sm">
            Create a draft, review the content and audience readiness, then send
            it when the provider configuration is ready.
          </p>
        </div>
      ) : (
        <div className="border-line mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="divide-line divide-y">
            {campaigns.map((campaign) => (
              <article
                key={campaign.id}
                className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={campaign.status} />
                    {campaign.providerStatus && (
                      <span className="text-muted text-xs">
                        Provider: {campaign.providerStatus}
                      </span>
                    )}
                  </div>
                  <h2 className="text-navy mt-3 text-xl font-extrabold">
                    {campaign.name}
                  </h2>
                  <p className="text-muted mt-2 text-sm leading-6">
                    {campaign.subject}
                  </p>
                  <div className="text-muted mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                    <span>{campaign.recipientCount} recipient(s)</span>
                    <span>Sent {formatDate(campaign.sentAt)}</span>
                    <span>Updated {formatDate(campaign.updatedAt)}</span>
                  </div>
                  {campaign.lastError && (
                    <p className="mt-3 text-sm text-red-700">
                      {campaign.lastError}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href={`/admin/newsletter/campaigns/${campaign.id}`}
                    className="bg-navy hover:bg-deep-navy rounded-md px-4 py-2 text-sm font-bold text-white"
                  >
                    {campaign.status === "sent" ? "View" : "Edit"}
                  </Link>
                  {(campaign.status === "draft" ||
                    campaign.status === "failed") && (
                    <form action={deleteNewsletterCampaign}>
                      <input type="hidden" name="id" value={campaign.id} />
                      <button
                        type="submit"
                        className="rounded-md border border-red-200 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </form>
                  )}
                </div>
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

function StatusBadge({ status }: { status: string }) {
  const className =
    status === "sent"
      ? "bg-green-50 text-green-800"
      : status === "failed"
        ? "bg-red-50 text-red-800"
        : status === "sending"
          ? "bg-amber/20 text-deep-navy"
          : "bg-off-white text-navy";
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${className}`}
    >
      {status}
    </span>
  );
}
