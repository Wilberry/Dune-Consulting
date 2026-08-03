import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../app/api/contact/route";

const basePayload = {
  name: "Ada <Example>",
  email: "ada@example.org",
  phone: "+234 801 234 5678",
  organisation: "Example & Co",
  service: "Event Safety Management",
  projectDate: "2026-10-01",
  location: "Lagos",
  message: "Please help with <script>alert(1)</script> event planning.",
  consent: true,
  website: "",
  formStartedAt: Date.now() - 5000,
  originPage: "https://example.org/contact",
};
function request(payload: unknown, ip: string) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(payload),
  });
}
function configure() {
  process.env.RESEND_API_KEY = "re_test_key_not_real_12345";
  process.env.CONTACT_RECIPIENT_EMAIL = "recipient@example.org";
  process.env.CONTACT_FROM_EMAIL = "website@example.org";
}
function unconfigure() {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_RECIPIENT_EMAIL;
  delete process.env.CONTACT_FROM_EMAIL;
}

test("contact endpoint validation and delivery behavior", async (context) => {
  const originalFetch = globalThis.fetch;
  await context.test(
    "valid enquiry is escaped and sent through the provider",
    async () => {
      configure();
      let providerBody = "";
      globalThis.fetch = async (_input, init) => {
        providerBody = String(init?.body);
        return new Response(JSON.stringify({ id: "email_123" }), {
          status: 200,
        });
      };
      const response = await POST(request(basePayload, "203.0.113.21"));
      assert.equal(response.status, 200);
      assert.equal((await response.json()).status, "success");
      assert.match(providerBody, /Ada &lt;Example&gt;/);
      assert.match(providerBody, /&lt;script&gt;/);
      assert.doesNotMatch(providerBody, /<script>/);
      assert.doesNotMatch(providerBody, /re_test_key/);
    },
  );
  await context.test(
    "invalid, honeypot, fast, and oversized submissions are rejected",
    async () => {
      configure();
      for (const [payload, ip] of [
        [{ ...basePayload, email: "bad" }, "203.0.113.22"],
        [{ ...basePayload, website: "bot.example" }, "203.0.113.23"],
        [{ ...basePayload, formStartedAt: Date.now() }, "203.0.113.24"],
        [{ ...basePayload, message: "x".repeat(4001) }, "203.0.113.25"],
      ] as const) {
        const response = await POST(request(payload, ip));
        assert.equal(response.status, 400);
      }
    },
  );
  await context.test("missing configuration fails safely", async () => {
    unconfigure();
    const response = await POST(request(basePayload, "203.0.113.26"));
    assert.equal(response.status, 503);
    assert.equal((await response.json()).status, "unconfigured");
  });
  await context.test(
    "provider failure is generic and non-sensitive",
    async () => {
      configure();
      const originalError = console.error;
      const errorOutput: string[] = [];
      console.error = (...values) => errorOutput.push(values.join(" "));
      globalThis.fetch = async () =>
        new Response("provider detail", { status: 500 });
      try {
        const response = await POST(request(basePayload, "203.0.113.27"));
        const result = await response.json();
        assert.equal(response.status, 502);
        assert.equal(result.status, "error");
        assert.doesNotMatch(result.message, /Resend|500|API/i);
        assert.doesNotMatch(
          errorOutput.join(" "),
          /re_test_key|Ada|Please help/,
        );
      } finally {
        console.error = originalError;
      }
    },
  );
  await context.test("sixth request from one IP is rate limited", async () => {
    unconfigure();
    const ip = "203.0.113.28";
    for (let attempt = 0; attempt < 5; attempt += 1)
      await POST(request({ bad: true }, ip));
    const response = await POST(request({ bad: true }, ip));
    assert.equal(response.status, 429);
  });
  globalThis.fetch = originalFetch;
  unconfigure();
});
