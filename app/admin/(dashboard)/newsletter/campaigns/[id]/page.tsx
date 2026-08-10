import Link from "next/link";
import { notFound } from "next/navigation";
import { sendNewsletterCampaign } from "@/app/admin/(dashboard)/newsletter/campaigns/actions";
import { NewsletterCampaignForm } from "@/components/admin/newsletter-campaign-form";
import { requireAdminUser } from "@/lib/admin/auth";
import {
  getNewsletterAudienceReadiness,
  getNewsletterCampaign,
  getNewsletterCampaignEventSummary,
} from "@/lib/admin/newsletter";
import { getNewsletterProviderEnvironment } from "@/lib/server-env";

type Props = { params: Promise<{ id: string }> };

function formatDate(value: string | null) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function NewsletterCampaignPage({ params }: Props) {
  await requireAdminUser();
  const { id } = await params;
  const campaign = await getNewsletterCampaign(id);
  if (!campaign) notFound();

  const [readiness, events] = await Promise.all([
    getNewsletterAudienceReadiness(),
    getNewsletterCampaignEventSummary(campaign.id),
  ]);
  const provider = getNewsletterProviderEnvironment();
  const sendableStatus = campaign.status === "draft" || campaign.status === "failed";
  const canSend =
    sendableStatus &&
    provider.configured &&
    readiness.eligibleCount > 0 &&
    readiness.unsyncedCount === 0;

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href="/admin/newsletter/campaigns"
        className="text-navy decoration-amber text-sm font-bold underline decoration-2 underline-offset-4"
      >
        Back to Campaigns
      </Link>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
            Campaign
          </p>
          <h1 className="text-navy mt-2 text-3xl font-extrabold">
            {campaign.name}
          </h1>
          <p className="text-muted mt-3 max-w-3xl leading-7">
            Status: <strong className="capitalize">{campaign.status}</strong>
            {campaign.sentAt ? ` · Sent ${formatDate(campaign.sentAt)}` : ""}
          </p>
        </div>
        {campaign.providerBroadcastId && (
          <span className="border-line rounded-lg border bg-white px-4 py-3 text-xs text-muted">
            Provider broadcast {campaign.providerBroadcastId}
          </span>
        )}
      </div>

      {campaign.lastError && (
        <div
          role="alert"
          className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {campaign.lastError}
        </div>
      )}

      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Eligible now" value={readiness.eligibleCount} />
        <Stat label="Need provider sync" value={readiness.unsyncedCount} />
        <Stat label="Suppressed" value={readiness.suppressedCount} />
        <Stat label="Campaign recipients" value={campaign.recipientCount} />
      </div>

      {campaign.status === "sent" && (
        <section className="border-line mt-8 rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-navy text-xl font-extrabold">Delivery events</h2>
          <p className="text-muted mt-2 text-sm leading-6">
            Counts below are based on verified Resend webhook events stored in
            Supabase. They remain zero until the production webhook is connected.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Stat label="Delivered" value={events["email.delivered"] ?? 0} />
            <Stat label="Clicked" value={events["email.clicked"] ?? 0} />
            <Stat label="Bounced" value={events["email.bounced"] ?? 0} />
            <Stat label="Complaints" value={events["email.complained"] ?? 0} />
            <Stat label="Failed" value={events["email.failed"] ?? 0} />
          </div>
        </section>
      )}

      {sendableStatus && (
        <section className="border-line mt-8 rounded-xl border bg-white p-5 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
            <div>
              <h2 className="text-navy text-xl font-extrabold">Send campaign</h2>
              <p className="text-muted mt-2 text-sm leading-6">
                Sending targets all eligible newsletter subscribers in the
                configured provider segment. This action cannot be undone after
                the provider accepts the Broadcast.
              </p>
              {!provider.configured && (
                <p className="mt-3 text-sm text-red-700">
                  Newsletter provider configuration is incomplete.
                </p>
              )}
              {readiness.unsyncedCount > 0 && (
                <p className="mt-3 text-sm text-red-700">
                  {readiness.unsyncedCount} eligible subscriber(s) still need
                  provider synchronization.
                </p>
              )}
              {readiness.eligibleCount === 0 && (
                <p className="mt-3 text-sm text-red-700">
                  There are no eligible subscribed recipients.
                </p>
              )}
            </div>

            <form action={sendNewsletterCampaign} className="bg-off-white border-line rounded-lg border p-4">
              <input type="hidden" name="id" value={campaign.id} />
              <label className="flex items-start gap-3 text-sm leading-6">
                <input
                  type="checkbox"
                  name="confirm"
                  value="yes"
                  required
                  disabled={!canSend}
                  className="accent-navy mt-1 size-4"
                />
                <span>
                  I confirm this campaign is approved to send to{" "}
                  <strong>{readiness.eligibleCount}</strong> eligible recipient(s).
                </span>
              </label>
              <button
                type="submit"
                disabled={!canSend}
                className="bg-amber text-deep-navy hover:bg-amber-hover mt-4 w-full rounded-md px-5 py-3 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send campaign
              </button>
            </form>
          </div>
        </section>
      )}

      <div className="mt-8">
        <NewsletterCampaignForm campaign={campaign} />
      </div>
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
