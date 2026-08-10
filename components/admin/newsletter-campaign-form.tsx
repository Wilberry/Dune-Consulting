"use client";

import { useActionState } from "react";
import {
  saveNewsletterCampaign,
  type NewsletterCampaignActionState,
} from "@/app/admin/(dashboard)/newsletter/campaigns/actions";
import type { NewsletterCampaign } from "@/lib/admin/newsletter";

const initialState: NewsletterCampaignActionState = { status: "idle" };
const control =
  "mt-2 w-full rounded-md border border-line bg-white px-4 py-3 text-ink placeholder:text-muted/70 focus:border-navy focus:outline-none focus:ring-2 focus:ring-amber/30 disabled:cursor-not-allowed disabled:bg-off-white disabled:text-muted";

export function NewsletterCampaignForm({
  campaign,
}: {
  campaign?: NewsletterCampaign;
}) {
  const [state, action, pending] = useActionState(
    saveNewsletterCampaign,
    initialState,
  );
  const locked = campaign?.status === "sending" || campaign?.status === "sent";

  function errorFor(field: string) {
    return state.fieldErrors?.[field]?.[0];
  }

  return (
    <form action={action} className="space-y-7">
      {campaign && <input type="hidden" name="id" value={campaign.id} />}

      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {state.message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <Field
            label="Internal campaign name"
            htmlFor="newsletter-campaign-name"
            error={errorFor("name")}
          >
            <input
              id="newsletter-campaign-name"
              name="name"
              className={control}
              defaultValue={campaign?.name}
              required
              maxLength={120}
              disabled={locked}
            />
          </Field>

          <Field
            label="Email subject"
            htmlFor="newsletter-campaign-subject"
            error={errorFor("subject")}
          >
            <input
              id="newsletter-campaign-subject"
              name="subject"
              className={control}
              defaultValue={campaign?.subject}
              required
              maxLength={160}
              disabled={locked}
            />
          </Field>

          <Field
            label="Preview text"
            htmlFor="newsletter-campaign-preview"
            error={errorFor("previewText")}
          >
            <input
              id="newsletter-campaign-preview"
              name="previewText"
              className={control}
              defaultValue={campaign?.previewText ?? ""}
              maxLength={160}
              disabled={locked}
            />
          </Field>

          <Field
            label="HTML body"
            htmlFor="newsletter-campaign-html"
            error={errorFor("contentHtml")}
          >
            <textarea
              id="newsletter-campaign-html"
              name="contentHtml"
              className={`${control} min-h-[420px] font-mono text-sm leading-6`}
              defaultValue={campaign?.contentHtml}
              required
              maxLength={100000}
              disabled={locked}
            />
            <p className="text-muted mt-2 text-xs leading-5">
              Write the email body as trusted HTML. Dune&apos;s unsubscribe footer
              is appended automatically when the campaign is sent.
            </p>
          </Field>

          <Field
            label="Plain-text body"
            htmlFor="newsletter-campaign-text"
            error={errorFor("contentText")}
          >
            <textarea
              id="newsletter-campaign-text"
              name="contentText"
              className={`${control} min-h-48 font-mono text-sm leading-6`}
              defaultValue={campaign?.contentText ?? ""}
              maxLength={50000}
              disabled={locked}
            />
            <p className="text-muted mt-2 text-xs leading-5">
              Optional. Resend can derive text from HTML when this is left empty.
            </p>
          </Field>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border-line rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-navy font-extrabold">Audience</h2>
            <p className="text-muted mt-2 text-sm leading-6">
              Campaigns send to the configured Dune Newsletter segment. Supabase
              subscribers must be active, deliverable and synchronized before
              the send action is enabled operationally.
            </p>
          </div>

          <div className="border-line rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-navy font-extrabold">Unsubscribe protection</h2>
            <p className="text-muted mt-2 text-sm leading-6">
              An unsubscribe link is added automatically. Provider unsubscribe
              events are synchronized back into the Supabase subscriber record.
            </p>
          </div>

          {!locked && (
            <button
              type="submit"
              disabled={pending}
              className="bg-navy hover:bg-deep-navy w-full rounded-md px-5 py-3 text-sm font-extrabold text-white disabled:cursor-wait disabled:opacity-60"
            >
              {pending ? "Saving…" : campaign ? "Save draft" : "Create draft"}
            </button>
          )}
        </aside>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="text-navy text-sm font-bold">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
