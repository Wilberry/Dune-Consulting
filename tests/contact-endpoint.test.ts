import assert from "node:assert/strict";
import test from "node:test";
import {
  handleContactRequest,
  type ContactEnquiryInsert,
} from "../lib/contact/handler";

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

test("contact endpoint validation, persistence and delivery behavior", async (context) => {
  await context.test(
    "valid enquiry is persisted, escaped and sent through the provider",
    async () => {
      configure();
      const persisted: ContactEnquiryInsert[] = [];
      let providerBody = "";

      const response = await handleContactRequest(
        request(basePayload, "203.0.113.21"),
        {
          persist: async (enquiry) => {
            persisted.push(enquiry);
          },
          fetchImpl: async (_input, init) => {
            providerBody = String(init?.body);
            return new Response(JSON.stringify({ id: "email_123" }), {
              status: 200,
            });
          },
        },
      );

      assert.equal(response.status, 200);
      assert.equal((await response.json()).status, "success");
      assert.equal(persisted.length, 1);
      assert.deepEqual(persisted[0], {
        name: "Ada <Example>",
        email: "ada@example.org",
        phone: "+234 801 234 5678",
        organisation: "Example & Co",
        service: "Event Safety Management",
        project_date: "2026-10-01",
        location: "Lagos",
        message: "Please help with <script>alert(1)</script> event planning.",
        origin_page: "https://example.org/contact",
      });
      assert.match(providerBody, /Ada &lt;Example&gt;/);
      assert.match(providerBody, /&lt;script&gt;/);
      assert.doesNotMatch(providerBody, /<script>/);
      assert.doesNotMatch(providerBody, /re_test_key/);
    },
  );

  await context.test(
    "invalid, honeypot, fast, and oversized submissions are rejected before persistence",
    async () => {
      configure();
      let persisted = 0;
      const persist = async () => {
        persisted += 1;
      };

      for (const [payload, ip] of [
        [{ ...basePayload, email: "bad" }, "203.0.113.22"],
        [{ ...basePayload, website: "bot.example" }, "203.0.113.23"],
        [{ ...basePayload, formStartedAt: Date.now() }, "203.0.113.24"],
        [{ ...basePayload, message: "x".repeat(4001) }, "203.0.113.25"],
      ] as const) {
        const response = await handleContactRequest(request(payload, ip), {
          persist,
        });
        assert.equal(response.status, 400);
      }

      assert.equal(persisted, 0);
    },
  );

  await context.test(
    "missing email configuration still succeeds after persistence",
    async () => {
      unconfigure();
      const persisted: ContactEnquiryInsert[] = [];
      const originalWarn = console.warn;
      console.warn = () => undefined;

      try {
        const response = await handleContactRequest(
          request(basePayload, "203.0.113.26"),
          {
            persist: async (enquiry) => {
              persisted.push(enquiry);
            },
          },
        );

        assert.equal(response.status, 200);
        assert.equal((await response.json()).status, "success");
        assert.equal(persisted.length, 1);
      } finally {
        console.warn = originalWarn;
      }
    },
  );

  await context.test(
    "provider failure is generic and does not undo a stored enquiry",
    async () => {
      configure();
      const persisted: ContactEnquiryInsert[] = [];
      const originalError = console.error;
      const errorOutput: string[] = [];
      console.error = (...values) => errorOutput.push(values.join(" "));

      try {
        const response = await handleContactRequest(
          request(basePayload, "203.0.113.27"),
          {
            persist: async (enquiry) => {
              persisted.push(enquiry);
            },
            fetchImpl: async () =>
              new Response("provider detail", { status: 500 }),
          },
        );
        const result = await response.json();

        assert.equal(response.status, 200);
        assert.equal(result.status, "success");
        assert.equal(persisted.length, 1);
        assert.doesNotMatch(
          errorOutput.join(" "),
          /re_test_key|Ada|Please help|provider detail/,
        );
      } finally {
        console.error = originalError;
      }
    },
  );

  await context.test(
    "persistence failure prevents a false success response",
    async () => {
      configure();
      const originalError = console.error;
      const errorOutput: string[] = [];
      console.error = (...values) => errorOutput.push(values.join(" "));
      let providerCalled = false;

      try {
        const response = await handleContactRequest(
          request(basePayload, "203.0.113.29"),
          {
            persist: async () => {
              const error = new Error("database detail");
              error.name = "PersistenceError";
              throw error;
            },
            fetchImpl: async () => {
              providerCalled = true;
              return new Response(null, { status: 200 });
            },
          },
        );
        const result = await response.json();

        assert.equal(response.status, 503);
        assert.equal(result.status, "error");
        assert.equal(providerCalled, false);
        assert.doesNotMatch(result.message, /database|Supabase|Persistence/i);
        assert.doesNotMatch(errorOutput.join(" "), /database detail|Ada/);
      } finally {
        console.error = originalError;
      }
    },
  );

  await context.test("sixth request from one IP is rate limited", async () => {
    unconfigure();
    const ip = "203.0.113.28";
    const persist = async () => undefined;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      await handleContactRequest(request({ bad: true }, ip), { persist });
    }

    const response = await handleContactRequest(request({ bad: true }, ip), {
      persist,
    });
    assert.equal(response.status, 429);
  });

  unconfigure();
});
