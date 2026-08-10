import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import {
  createAndSendNewsletterBroadcast,
  syncNewsletterSubscriber,
} from "../lib/newsletter/provider";
import { verifySvixWebhook } from "../lib/newsletter/webhook";
import { newsletterCampaignSchema } from "../lib/validations";

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
  process.env.NEWSLETTER_SEGMENT_ID = "78261eea-8f8b-4381-83c6-79fa7120f1cf";
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
    assert.deepEqual(body.segments, [
      { id: "78261eea-8f8b-4381-83c6-79fa7120f1cf" },
    ]);
  });
});

test("newsletter Broadcast uses the configured segment, immediate send and unsubscribe footer", async () => {
  await withProviderEnvironment(async () => {
    let body: Record<string, unknown> | null = null;
    const fakeFetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
      body = JSON.parse(String(init?.body)) as Record<string, unknown>;
      return new Response(
        JSON.stringify({ id: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794" }),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }) as typeof fetch;

    const result = await createAndSendNewsletterBroadcast(campaign, fakeFetch);

    assert.deepEqual(result, {
      status: "sent",
      broadcastId: "49a3999c-0ce1-4ea6-ab68-afcd6dc2e794",
    });
    assert.equal(body?.segment_id, "78261eea-8f8b-4381-83c6-79fa7120f1cf");
    assert.equal(body?.send, true);
    assert.match(String(body?.html), /RESEND_UNSUBSCRIBE_URL/);
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
