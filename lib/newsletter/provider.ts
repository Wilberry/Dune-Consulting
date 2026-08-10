import { getNewsletterProviderEnvironment } from "@/lib/server-env";

const RESEND_API_BASE = "https://api.resend.com";
const RATE_LIMIT_RETRY_MS = 650;

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

function delay(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
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
  const execute = async () => {
    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${apiKey}`);
    headers.set("Content-Type", "application/json");
    return fetchImpl(`${RESEND_API_BASE}${path}`, { ...init, headers });
  };

  let response = await execute();
  if (response.status === 429) {
    await delay(RATE_LIMIT_RETRY_MS);
    response = await execute();
  }

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
  deliverabilityStatus?:
    | "ok"
    | "bounced"
    | "complained"
    | "suppressed"
    | "failed";
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

async function listContactSegments(
  identifier: string,
  apiKey: string,
  fetchImpl: FetchLike,
) {
  const { response, data } = await providerRequest(
    `/contacts/${encodeURIComponent(identifier)}/segments`,
    { method: "GET" },
    apiKey,
    fetchImpl,
  );
  if (!response.ok) {
    throw new NewsletterProviderError(
      "Newsletter provider could not inspect contact segments.",
      response.status,
    );
  }
  const segments = Array.isArray(data.data) ? data.data : [];
  return segments
    .map((segment) =>
      segment && typeof segment === "object"
        ? providerId(segment as ResendObject)
        : null,
    )
    .filter((id): id is string => Boolean(id));
}

async function setSegmentMembership(
  contactId: string,
  segmentId: string,
  shouldBelong: boolean,
  apiKey: string,
  fetchImpl: FetchLike,
) {
  const currentSegments = await listContactSegments(
    contactId,
    apiKey,
    fetchImpl,
  );
  const belongs = currentSegments.includes(segmentId);
  if (belongs === shouldBelong) return;

  const { response } = await providerRequest(
    `/contacts/${encodeURIComponent(contactId)}/segments/${encodeURIComponent(segmentId)}`,
    { method: shouldBelong ? "POST" : "DELETE" },
    apiKey,
    fetchImpl,
  );
  if (!response.ok) {
    throw new NewsletterProviderError(
      shouldBelong
        ? "Newsletter provider could not add the contact to the configured segment."
        : "Newsletter provider could not remove the contact from the configured segment.",
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
  const deliverable = (subscriber.deliverabilityStatus ?? "ok") === "ok";
  const active = subscriber.status === "subscribed";
  const shouldBelongToSegment = active && deliverable;
  const globalUnsubscribed = subscriber.status === "unsubscribed";

  let result = await patchContact(
    subscriber.externalContactId || subscriber.email,
    globalUnsubscribed,
    RESEND_API_KEY,
    fetchImpl,
  );

  if (result.response.status === 404 && subscriber.externalContactId) {
    result = await patchContact(
      subscriber.email,
      globalUnsubscribed,
      RESEND_API_KEY,
      fetchImpl,
    );
  }

  if (result.response.status === 404) {
    const created = await providerRequest(
      "/contacts",
      {
        method: "POST",
        body: JSON.stringify({
          email: subscriber.email,
          unsubscribed: globalUnsubscribed,
          ...(subscriber.firstName ? { first_name: subscriber.firstName } : {}),
          ...(shouldBelongToSegment
            ? { segments: [{ id: NEWSLETTER_SEGMENT_ID }] }
            : {}),
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

  await setSegmentMembership(
    contactId,
    NEWSLETTER_SEGMENT_ID,
    shouldBelongToSegment,
    RESEND_API_KEY,
    fetchImpl,
  );

  return { status: "synced", externalContactId: contactId };
}

export type NewsletterBroadcastInput = {
  name: string;
  subject: string;
  previewText?: string | null;
  contentHtml: string;
  contentText?: string | null;
};

export type NewsletterBroadcastDraftResult =
  | { status: "unconfigured"; missing: string[] }
  | { status: "created"; broadcastId: string };

export type NewsletterBroadcastSendResult =
  | { status: "unconfigured"; missing: string[] }
  | { status: "sent"; broadcastId: string };

function withUnsubscribeFooter(html: string) {
  if (html.includes("RESEND_UNSUBSCRIBE_URL")) return html;
  return `${html}\n<hr><p style="font-size:12px;color:#667085">You are receiving this email because you subscribed to Dune Consulting HSE insights. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a>.</p>`;
}

export async function createNewsletterBroadcastDraft(
  campaign: NewsletterBroadcastInput,
  fetchImpl: FetchLike = fetch,
): Promise<NewsletterBroadcastDraftResult> {
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
      }),
    },
    RESEND_API_KEY,
    fetchImpl,
  );

  if (!response.ok) {
    throw new NewsletterProviderError(
      "Newsletter provider could not create the Broadcast draft.",
      response.status,
    );
  }

  const broadcastId = providerId(data);
  if (!broadcastId) {
    throw new NewsletterProviderError(
      "Newsletter provider returned an invalid Broadcast response.",
    );
  }
  return { status: "created", broadcastId };
}

export async function sendNewsletterBroadcast(
  broadcastId: string,
  fetchImpl: FetchLike = fetch,
): Promise<NewsletterBroadcastSendResult> {
  const environment = getNewsletterProviderEnvironment();
  if (!environment.configured) {
    return { status: "unconfigured", missing: environment.missing };
  }

  const { RESEND_API_KEY } = environment.values;
  const { response, data } = await providerRequest(
    `/broadcasts/${encodeURIComponent(broadcastId)}/send`,
    { method: "POST", body: JSON.stringify({}) },
    RESEND_API_KEY,
    fetchImpl,
  );

  if (!response.ok) {
    throw new NewsletterProviderError(
      "Newsletter provider could not send the Broadcast.",
      response.status,
    );
  }

  return {
    status: "sent",
    broadcastId: providerId(data) || broadcastId,
  };
}

export async function deleteNewsletterBroadcastDraft(
  broadcastId: string,
  fetchImpl: FetchLike = fetch,
) {
  const environment = getNewsletterProviderEnvironment();
  if (!environment.configured) return;
  const { response } = await providerRequest(
    `/broadcasts/${encodeURIComponent(broadcastId)}`,
    { method: "DELETE" },
    environment.values.RESEND_API_KEY,
    fetchImpl,
  );
  if (!response.ok && response.status !== 404) {
    throw new NewsletterProviderError(
      "Newsletter provider could not clean up the Broadcast draft.",
      response.status,
    );
  }
}
