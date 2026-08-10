import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
  createNewsletterBroadcastDraft,
  getNewsletterBroadcastStatus,
  sendNewsletterBroadcast,
  syncNewsletterSubscriber,
} from "../lib/newsletter/provider";
import { verifySvixWebhook } from "../lib/newsletter/webhook";
import { newsletterCampaignSchema } from "../lib/validations";

const segmentId = "78261eea-8f8b-4381-83c6-79fa7120f1cf";
const broadcastId = "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794";
const campaign = {
  name: "August HSE Update",
  subject: "Three practical HSE lessons for your team",
  previewText: "A concise safety briefing from Dune Consulting.",
  contentHtml:
    "<h1>Practical HSE lessons</h1><p>Use this campaign to share useful safety guidance with subscribed professionals.</p>",
  contentText:
    "Practical HSE lessons. Use this campaign to share useful safety guidance with subscribed professionals.",
};

function withProviderEnvironment<T>(run: () => Promise<T>) {
  const original = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NEWSLETTER_FROM_EMAIL: process.env.NEWSLETTER_FROM_EMAIL,
    NEWSLETTER_SEGMENT_ID: process.env.NEWSLETTER_SEGMENT_ID,
    VERCEL_ENV: process.env.VERCEL_ENV,
  };
  process.env.RESEND_API_KEY = "re_test_newsletter_key";
  process.env.NEWSLETTER_FROM_EMAIL = "Dune Consulting <insights@duneconsult.ng>";
  process.env.NEWSLETTER_SEGMENT_ID = segmentId;
  delete process.env.VERCEL_ENV;

  return run().finally(() => {
    for (const [key, value] of Object.entries(original)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });
}

test("newsletter campaign validation accepts useful content and rejects incomplete drafts", () => {
  assert.equal(newsletterCampaignSchema.safeParse(campaign).success, true);
  assert.equal(
    newsletterCampaignSchema.safeParse({ ...campaign, name: "x" }).success,
    false,
  );
  assert.equal(
    newsletterCampaignSchema.safeParse({ ...campaign, contentHtml: "<p>x</p>" })
      .success,
    false,
  );
});

test("newsletter subscriber provider sync creates a missing Resend contact in the configured segment", async () => {
  await withProviderEnvironment(async () => {
    const requests: { url: string; init?: RequestInit }[] = [];
    const fakeFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      requests.push({ url, init });
      if (init?.method === "PATCH") {
        return new Response(JSON.stringify({ message: "not found" }), {
          status: 404,
          headers: { "content-type": "application/json" },
        });
      }
      return new Response(
        JSON.stringify({
          object: "contact",
          id: "479e3145-dd38-476b-932c-529ceb705947",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    const result = await syncNewsletterSubscriber(
      {
        email: "subscriber@example.org",
        status: "subscribed",
      },
      fakeFetch,
    );

    assert.deepEqual(result, {
      status: "synced",
      externalContactId: "479e3145-dd38-476b-932c-529ceb705947",
    });
    assert.equal(requests.length, 2);
    assert.match(requests[0].url, /\/contacts\/subscriber%40example\.org$/);
    assert.equal(requests[0].init?.method, "PATCH");
    assert.equal(requests[1].url.endsWith("/contacts"), true);
    const body = JSON.parse(String(requests[1].init?.body));
    assert.equal(body.email, "subscriber@example.org");
    assert.equal(body.unsubscribed, false);
    assert.deepEqual(body.segments, [{ id: segmentId }]);
  });
});

test("a suppressed subscriber is removed from the newsletter Segment without changing consent", async () => {
  await withProviderEnvironment(async () => {
    const requests: { url: string; method: string }[] = [];
    const contactId = "479e3145-dd38-476b-932c-529ceb705947";
    const fakeFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      requests.push({ url, method });

      if (method === "PATCH") {
        return new Response(JSON.stringify({ object: "contact", id: contactId }), {
          status: 200,
          headers: { "content-type": "application/json" },
        });
      }
      if (method === "GET") {
        return new Response(
          JSON.stringify({ object: "list", data: [{ id: segmentId }] }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      }
      return new Response(JSON.stringify({ id: segmentId, deleted: true }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const result = await syncNewsletterSubscriber(
      {
        email: "subscriber@example.org",
        status: "subscribed",
        deliverabilityStatus: "bounced",
        externalContactId: contactId,
      },
      fakeFetch,
    );

    assert.equal(result.status, "synced");
    assert.deepEqual(
      requests.map((request) => request.method),
      ["PATCH", "GET", "DELETE"],
    );
    assert.match(requests[2].url, new RegExp(`/segments/${segmentId}$`));
  });
});

test("newsletter Broadcast is created as a draft before a separate send request", async () => {
  await withProviderEnvironment(async () => {
    const requests: { url: string; method: string; body: unknown }[] = [];
    const fakeFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      const body = init?.body ? JSON.parse(String(init.body)) : null;
      requests.push({ url, method, body });
      return new Response(JSON.stringify({ id: broadcastId }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }) as typeof fetch;

    const draft = await createNewsletterBroadcastDraft(campaign, fakeFetch);
    assert.deepEqual(draft, { status: "created", broadcastId });
    const draftBody = requests[0].body as Record<string, unknown>;
    assert.equal(requests[0].url.endsWith("/broadcasts"), true);
    assert.equal(requests[0].method, "POST");
    assert.equal(draftBody.segment_id, segmentId);
    assert.equal("send" in draftBody, false);
    assert.match(String(draftBody.html), /RESEND_UNSUBSCRIBE_URL/);

    const sent = await sendNewsletterBroadcast(broadcastId, fakeFetch);
    assert.deepEqual(sent, { status: "sent", broadcastId });
    assert.match(requests[1].url, new RegExp(`/broadcasts/${broadcastId}/send$`));
    assert.equal(requests[1].method, "POST");
  });
});

test("newsletter Broadcast status can be reconciled before a safe retry", async () => {
  await withProviderEnvironment(async () => {
    const fakeFetch = (async () =>
      new Response(JSON.stringify({ id: broadcastId, status: "queued" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })) as typeof fetch;

    const result = await getNewsletterBroadcastStatus(broadcastId, fakeFetch);
    assert.deepEqual(result, { status: "found", broadcastStatus: "queued" });
  });
});

test("Svix webhook verification accepts the signed raw body and rejects tampering or stale timestamps", () => {
  const key = Buffer.from("dune-webhook-test-secret");
  const secret = `whsec_${key.toString("base64")}`;
  const now = Date.now();
  const timestamp = String(Math.floor(now / 1000));
  const id = "msg_dune_newsletter_test";
  const payload = JSON.stringify({ type: "email.delivered", data: { id: 1 } });
  const signature = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${payload}`)
    .digest("base64");
  const headers = { id, timestamp, signature: `v1,${signature}` };

  assert.equal(verifySvixWebhook(payload, headers, secret, now), true);
  assert.equal(verifySvixWebhook(`${payload} `, headers, secret, now), false);
  assert.equal(
    verifySvixWebhook(payload, headers, secret, now + 6 * 60 * 1000),
    false,
  );
});
