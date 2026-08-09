import assert from "node:assert/strict";
import test from "node:test";
import { handleQuoteRequest } from "../lib/quote/handler";

const basePayload = {
  name: "Ada <Example>",
  company: "Example & Co",
  email: "ada@example.org",
  phone: "+234 801 234 5678",
  service: "Event Safety Management",
  location: "Lagos",
  expectedStartDate: "2026-10-01",
  participantCount: 250,
  projectDescription:
    "Please provide event safety planning and on-site coordination for our conference.",
  additionalRequirements:
    "Include <script>alert(1)</script> emergency support.",
  consent: true,
  website: "",
  formStartedAt: Date.now() - 5000,
  originPage: "https://example.org/request-quote",
};

function request(payload: unknown, ip: string) {
  return new Request("http://localhost/api/quote", {
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

test("quote endpoint persistence and notification behavior", async (context) => {
  await context.test(
    "valid quote is persisted before a secondary notification",
    async () => {
      configure();
      let persisted: Record<string, unknown> | undefined;
      let providerBody = "";

      const response = await handleQuoteRequest(
        request(basePayload, "203.0.113.61"),
        {
          persist: async (quote) => {
            persisted = quote;
            return "DUNE-Q-000123";
          },
          fetchImpl: async (_input, init) => {
            providerBody = String(init?.body);
            return new Response(JSON.stringify({ id: "email_quote_123" }), {
              status: 200,
            });
          },
        },
      );

      const result = await response.json();
      assert.equal(response.status, 200);
      assert.equal(result.status, "success");
      assert.equal(result.referenceNumber, "DUNE-Q-000123");
      assert.equal(persisted?.company, "Example & Co");
      assert.equal(persisted?.participant_count, 250);
      assert.match(providerBody, /DUNE-Q-000123/);
      assert.match(providerBody, /Ada &lt;Example&gt;/);
      assert.match(providerBody, /&lt;script&gt;/);
      assert.doesNotMatch(providerBody, /<script>/);
      assert.doesNotMatch(providerBody, /re_test_key/);
    },
  );

  await context.test(
    "missing email configuration does not lose a stored quote",
    async () => {
      unconfigure();
      const response = await handleQuoteRequest(
        request(basePayload, "203.0.113.62"),
        {
          persist: async () => "DUNE-Q-000124",
        },
      );
      const result = await response.json();

      assert.equal(response.status, 200);
      assert.equal(result.status, "success");
      assert.equal(result.referenceNumber, "DUNE-Q-000124");
      assert.match(result.message, /DUNE-Q-000124/);
    },
  );

  await context.test(
    "notification failure still returns success after persistence",
    async () => {
      configure();
      const originalError = console.error;
      const errorOutput: string[] = [];
      console.error = (...values) => errorOutput.push(values.join(" "));

      try {
        const response = await handleQuoteRequest(
          request(basePayload, "203.0.113.63"),
          {
            persist: async () => "DUNE-Q-000125",
            fetchImpl: async () =>
              new Response("provider detail", { status: 500 }),
          },
        );
        const result = await response.json();

        assert.equal(response.status, 200);
        assert.equal(result.status, "success");
        assert.equal(result.referenceNumber, "DUNE-Q-000125");
        assert.doesNotMatch(
          errorOutput.join(" "),
          /re_test_key|Ada|conference|provider detail/,
        );
      } finally {
        console.error = originalError;
      }
    },
  );

  await context.test("persistence failure blocks false success", async () => {
    unconfigure();
    const originalError = console.error;
    console.error = () => undefined;

    try {
      const response = await handleQuoteRequest(
        request(basePayload, "203.0.113.64"),
        {
          persist: async () => {
            const error = new Error("private database detail");
            error.name = "SupabaseError";
            throw error;
          },
        },
      );
      const result = await response.json();

      assert.equal(response.status, 503);
      assert.equal(result.status, "error");
      assert.doesNotMatch(result.message, /Supabase|database detail/i);
    } finally {
      console.error = originalError;
    }
  });

  await context.test(
    "invalid, honeypot, fast, and oversized submissions are rejected",
    async () => {
      unconfigure();
      for (const [payload, ip] of [
        [{ ...basePayload, email: "bad" }, "203.0.113.65"],
        [{ ...basePayload, website: "bot.example" }, "203.0.113.66"],
        [{ ...basePayload, formStartedAt: Date.now() }, "203.0.113.67"],
        [
          { ...basePayload, projectDescription: "x".repeat(5001) },
          "203.0.113.68",
        ],
      ] as const) {
        const response = await handleQuoteRequest(request(payload, ip), {
          persist: async () => "DUNE-Q-999999",
        });
        assert.equal(response.status, 400);
      }
    },
  );

  unconfigure();
});
