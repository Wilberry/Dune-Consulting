import Link from "next/link";
import { NewsletterCampaignForm } from "@/components/admin/newsletter-campaign-form";
import { requireAdminUser } from "@/lib/admin/auth";

export default async function NewNewsletterCampaignPage() {
  await requireAdminUser();

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        href="/admin/newsletter/campaigns"
        className="text-navy decoration-amber text-sm font-bold underline decoration-2 underline-offset-4"
      >
        Back to Campaigns
      </Link>
      <div className="mt-6">
        <p className="text-amber-text text-xs font-extrabold tracking-[0.16em] uppercase">
          New Campaign
        </p>
        <h1 className="text-navy mt-2 text-3xl font-extrabold">
          Create newsletter draft
        </h1>
        <p className="text-muted mt-3 max-w-3xl leading-7">
          Draft and review the email content first. Sending is available only
          after the campaign has been saved and the eligible audience is fully
          synchronized with the provider.
        </p>
      </div>
      <div className="mt-8">
        <NewsletterCampaignForm />
      </div>
    </div>
  );
}
