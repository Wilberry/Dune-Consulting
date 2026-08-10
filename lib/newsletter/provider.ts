import { getNewsletterProviderEnvironment } from "@/lib/server-env";

const RESEND_API_BASE = "https://api.resend.com";

type FetchLike = typeof fetch;

type ResendObject = Record<string, unknown>;

export class NewsletterProviderError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "NewsletterProviderError";
  }
}

async function readJson(response: Response): Promise<ResendObject> {
  try {
    const value = (await response.json()) as unknown;
    return value && typeof value === "object" ? (value as ResendObject) : {};
  } catch {
    return {};
  }
}

async function providerRequest(
  path: string,
  init: RequestInit,
  apiKey: string,
  fetchImpl: FetchLike,
) {
  const response = await fetchImpl(`${RESEND_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const data = await readJson(response);
  return { response, data };
}

function providerId(data: ResendObject) {
  return typeof data.id === "string" && data.id ? data.id : null;
}

export type NewsletterSubscriberSyncInput = {
  email: string;
  firstName?: string | null;
  status: "subscribed" | "unsubscribed";
  externalContactId?: string | null;
};

export type NewsletterSubscriberSyncResult =
  | { status: "unconfigured"; missing: string[] }
  | { status: "synced"; externalContactId: string };

async function patchContact(
  identifier: string,
  unsubscribed: boolean,
  apiKey: string,
  fetchImpl: FetchLike,
) {
  return providerRequest(
    `/contacts/${encodeURIComponent(identifier)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ unsubscribed }),
    },
    apiKey,
    fetchImpl,
  );
}

async function addContactToSegment(
  contactId: string,
  segmentId: string,
  apiKey: string,
  fetchImpl: FetchLike,
) {
  const { response } = await providerRequest(
    `/contacts/${encodeURIComponent(contactId)}/segments/${encodeURIComponent(segmentId)}`,
    { method: "POST" },
    apiKey,
    fetchImpl,
  );
  if (!response.ok) {
    throw new NewsletterProviderError(
      "Newsletter provider could not add the contact to the configured segment.",
      response.status,
    );
  }
}

export async function syncNewsletterSubscriber(
  subscriber: NewsletterSubscriberSyncInput,
  fetchImpl: FetchLike = fetch,
): Promise<NewsletterSubscriberSyncResult> {
  const environment = getNewsletterProviderEnvironment();
  if (!environment.configured) {
    return { status: "unconfigured", missing: environment.missing };
  }

  const { RESEND_API_KEY, NEWSLETTER_SEGMENT_ID } = environment.values;
  const unsubscribed = subscriber.status === "unsubscribed";
  let recoveredExistingContact = false;

  let result = await patchContact(
    subscriber.externalContactId || subscriber.email,
    unsubscribed,
    RESEND_API_KEY,
    fetchImpl,
  );

  if (result.response.status === 404 && subscriber.externalContactId) {
    result = await patchContact(
      subscriber.email,
      unsubscribed,
      RESEND_API_KEY,
      fetchImpl,
    );
    recoveredExistingContact = result.response.ok;
  } else if (!subscriber.externalContactId && result.response.ok) {
    recoveredExistingContact = true;
  }

  if (result.response.status === 404) {
    const created = await providerRequest(
      "/contacts",
      {
        method: "POST",
        body: JSON.stringify({
          email: subscriber.email,
          unsubscribed,
          ...(subscriber.firstName ? { first_name: subscriber.firstName } : {}),
          segments: [{ id: NEWSLETTER_SEGMENT_ID }],
        }),
      },
      RESEND_API_KEY,
      fetchImpl,
    );

    if (!created.response.ok) {
      throw new NewsletterProviderError(
        "Newsletter provider could not create the contact.",
        created.response.status,
      );
    }

    const createdId = providerId(created.data);
    if (!createdId) {
      throw new NewsletterProviderError(
        "Newsletter provider returned an invalid contact response.",
      );
    }
    return { status: "synced", externalContactId: createdId };
  }

  if (!result.response.ok) {
    throw new NewsletterProviderError(
      "Newsletter provider could not update the contact.",
      result.response.status,
    );
  }

  const contactId = providerId(result.data) || subscriber.externalContactId;
  if (!contactId) {
    throw new NewsletterProviderError(
      "Newsletter provider returned an invalid contact response.",
    );
  }

  if (subscriber.status === "subscribed" && recoveredExistingContact) {
    await addContactToSegment(
      contactId,
      NEWSLETTER_SEGMENT_ID,
      RESEND_API_KEY,
      fetchImpl,
    );
  }

  return { status: "synced", externalContactId: contactId };
}

export type NewsletterBroadcastInput = {
  name: string;
  subject: string;
  previewText?: string | null;
  contentHtml: string;
  contentText?: string | null;
};

export type NewsletterBroadcastResult =
  | { status: "unconfigured"; missing: string[] }
  | { status: "sent"; broadcastId: string };

function withUnsubscribeFooter(html: string) {
  if (html.includes("RESEND_UNSUBSCRIBE_URL")) return html;
  return `${html}\n<hr><p style="font-size:12px;color:#667085">You are receiving this email because you subscribed to Dune Consulting HSE insights. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>.</p>`;
}

export async function createAndSendNewsletterBroadcast(
  campaign: NewsletterBroadcastInput,
  fetchImpl: FetchLike = fetch,
): Promise<NewsletterBroadcastResult> {
  const environment = getNewsletterProviderEnvironment();
  if (!environment.configured) {
    return { status: "unconfigured", missing: environment.missing };
  }

  const { RESEND_API_KEY, NEWSLETTER_FROM_EMAIL, NEWSLETTER_SEGMENT_ID } =
    environment.values;
  const { response, data } = await providerRequest(
    "/broadcasts",
    {
      method: "POST",
      body: JSON.stringify({
        segment_id: NEWSLETTER_SEGMENT_ID,
        from: NEWSLETTER_FROM_EMAIL,
        name: campaign.name,
        subject: campaign.subject,
        preview_text: campaign.previewText || undefined,
        html: withUnsubscribeFooter(campaign.contentHtml),
        text: campaign.contentText || undefined,
        send: true,
      }),
    },
    RESEND_API_KEY,
    fetchImpl,
  );

  if (!response.ok) {
    throw new NewsletterProviderError(
      "Newsletter provider could not create or send the broadcast.",
      response.status,
    );
  }

  const broadcastId = providerId(data);
  if (!broadcastId) {
    throw new NewsletterProviderError(
      "Newsletter provider returned an invalid broadcast response.",
    );
  }

  return { status: "sent", broadcastId };
}
