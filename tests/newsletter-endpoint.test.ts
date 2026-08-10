import assert from "node:assert/strict";
import test from "node:test";
import { handleNewsletterSignup } from "../lib/newsletter/handler";

const basePayload = {
  email: "  Subscriber@Example.ORG ",
  website: "",
  formStartedAt: Date.now() - 2500,
};

function request(payload: unknown, ip: string) {
  return new Request("http://localhost/api/newsletter", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(payload),
  });
}

test("newsletter endpoint persistence behavior", async (context) => {
  await context.test("valid signup persists a normalized email", async () => {
    let persisted = "";
    const response = await handleNewsletterSignup(
      request(basePayload, "203.0.113.81"),
      {
        persist: async (email) => {
          persisted = email;
        },
      },
    );
    const result = await response.json();

    assert.equal(response.status, 200);
    assert.equal(result.status, "success");
    assert.equal(persisted, "subscriber@example.org");
    assert.match(result.message, /subscribed/i);
  });

  await context.test(
    "an idempotent persistence outcome returns the same public success",
    async () => {
      const response = await handleNewsletterSignup(
        request(basePayload, "203.0.113.82"),
        { persist: async () => undefined },
      );
      const result = await response.json();

      assert.equal(response.status, 200);
      assert.equal(result.status, "success");
      assert.doesNotMatch(result.message, /already|existing|duplicate/i);
    },
  );

  await context.test("persistence failure blocks false success", async () => {
    const originalError = console.error;
    console.error = () => undefined;

    try {
      const response = await handleNewsletterSignup(
        request(basePayload, "203.0.113.83"),
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
    "invalid, honeypot and too-fast signups are rejected before persistence",
    async () => {
      let persistCalls = 0;
      for (const [payload, ip] of [
        [{ ...basePayload, email: "not-an-email" }, "203.0.113.84"],
        [{ ...basePayload, website: "bot.example" }, "203.0.113.85"],
        [{ ...basePayload, formStartedAt: Date.now() }, "203.0.113.86"],
      ] as const) {
        const response = await handleNewsletterSignup(request(payload, ip), {
          persist: async () => {
            persistCalls += 1;
          },
        });
        assert.equal(response.status, 400);
      }
      assert.equal(persistCalls, 0);
    },
  );

  await context.test("malformed JSON is rejected", async () => {
    const malformed = new Request("http://localhost/api/newsletter", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": "203.0.113.87",
      },
      body: "{not-json",
    });
    const response = await handleNewsletterSignup(malformed, {
      persist: async () => undefined,
    });
    const result = await response.json();

    assert.equal(response.status, 400);
    assert.equal(result.status, "error");
  });
});
