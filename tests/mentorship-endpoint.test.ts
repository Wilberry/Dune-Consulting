import assert from "node:assert/strict";
import test from "node:test";
import { extractYouTubeVideoId } from "../lib/mentorship/youtube";
import { handleMentorshipApplication } from "../lib/mentorship/handler";

const basePayload = {
  name: "Ada <Example>",
  email: "ada@example.org",
  phone: "+234 801 234 5678",
  professionalRole: "Graduate trainee",
  selectedPackage: "Foundation",
  experienceLevel: "Recent graduate",
  education: "BSc Environmental Science",
  reasonForApplying:
    "I want practical guidance that connects safety theory with real workplace responsibilities.",
  careerGoals:
    "I want to build a strong HSE career and become confident in risk assessment and professional communication.",
  additionalInformation:
    "I am especially interested in <script>alert(1)</script> event safety examples.",
  consent: true,
  website: "",
  formStartedAt: Date.now() - 5000,
};

function request(payload: unknown, ip: string) {
  return new Request("http://localhost/api/mentorship", {
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

test("YouTube links are parsed reliably for mentorship video testimonials", () => {
  assert.equal(
    extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    "dQw4w9WgXcQ",
  );
  assert.equal(
    extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ?t=12"),
    "dQw4w9WgXcQ",
  );
  assert.equal(extractYouTubeVideoId("https://example.com/video"), null);
  assert.equal(extractYouTubeVideoId("not a url"), null);
});

test("mentorship application package handling", async () => {
  for (const packageName of ["Foundation", "Momentum", "Elevation"]) {
    let persisted: Record<string, unknown> | undefined;

    const response = await handleMentorshipApplication(
      request({ ...basePayload, selectedPackage: packageName }, "203.0.113.80"),
      {
        persist: async (application) => {
          persisted = application;
        },
        fetchImpl: async () =>
          new Response(JSON.stringify({ id: "email_mentorship_123" }), {
            status: 200,
          }),
      },
    );

    assert.equal(response.status, 200);
    assert.equal(persisted?.selected_package, packageName);
  }

  const invalid = await handleMentorshipApplication(
    request({ ...basePayload, selectedPackage: "Legacy" }, "203.0.113.81"),
    {
      persist: async () => undefined,
    },
  );
  assert.equal(invalid.status, 400);

  for (const value of ["", "Unknown", undefined]) {
    let persisted = false;
    const response = await handleMentorshipApplication(
      request({ ...basePayload, selectedPackage: value }, "203.0.113.83"),
      {
        persist: async () => { persisted = true; },
      },
    );
    assert.equal(response.status, 400);
    assert.equal(persisted, false);
  }

  let optionalPersisted: Record<string, unknown> | undefined;
  const optionalResponse = await handleMentorshipApplication(
    request(
      {
        ...basePayload,
        selectedPackage: "Foundation",
        professionalRole: undefined,
        education: undefined,
        additionalInformation: undefined,
      },
      "203.0.113.82",
    ),
    {
      persist: async (application) => {
        optionalPersisted = application;
      },
      fetchImpl: async () =>
        new Response(JSON.stringify({ id: "email_mentorship_456" }), {
          status: 200,
        }),
    },
  );

  assert.equal(optionalResponse.status, 200);
  assert.equal(optionalPersisted?.selected_package, "Foundation");
  assert.equal(optionalPersisted?.professional_role, null);
  assert.equal(optionalPersisted?.education, null);
  assert.equal(optionalPersisted?.additional_information, null);
});

test("mentorship endpoint persistence and notification behavior", async (context) => {
  await context.test(
    "valid application is persisted before a secondary notification",
    async () => {
      configure();
      let persisted: Record<string, unknown> | undefined;
      let providerBody = "";

      const response = await handleMentorshipApplication(
        request(
          { ...basePayload, selectedPackage: "Momentum" },
          "203.0.113.71",
        ),
        {
          persist: async (application) => {
            persisted = application;
          },
          fetchImpl: async (_input, init) => {
            providerBody = String(init?.body);
            return new Response(
              JSON.stringify({ id: "email_mentorship_123" }),
              {
                status: 200,
              },
            );
          },
        },
      );

      const result = await response.json();
      assert.equal(response.status, 200);
      assert.equal(result.status, "success");
      assert.equal(persisted?.professional_role, "Graduate trainee");
      assert.equal(persisted?.experience_level, "Recent graduate");
      assert.match(providerBody, /Ada &lt;Example&gt;/);
      assert.match(providerBody, /Momentum/);
      assert.match(providerBody, /&lt;script&gt;/);
      assert.doesNotMatch(providerBody, /<script>/);
      assert.doesNotMatch(providerBody, /re_test_key/);
    },
  );

  await context.test(
    "missing email configuration does not lose a stored application",
    async () => {
      unconfigure();
      let persisted = false;
      const response = await handleMentorshipApplication(
        request(basePayload, "203.0.113.72"),
        {
          persist: async () => {
            persisted = true;
          },
        },
      );
      const result = await response.json();

      assert.equal(response.status, 200);
      assert.equal(result.status, "success");
      assert.equal(persisted, true);
      assert.match(result.message, /application has been received/i);
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
        const response = await handleMentorshipApplication(
          request(basePayload, "203.0.113.73"),
          {
            persist: async () => undefined,
            fetchImpl: async () =>
              new Response("provider detail", { status: 500 }),
          },
        );
        const result = await response.json();

        assert.equal(response.status, 200);
        assert.equal(result.status, "success");
        assert.doesNotMatch(
          errorOutput.join(" "),
          /re_test_key|Ada|workplace responsibilities|provider detail/,
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
      const response = await handleMentorshipApplication(
        request(basePayload, "203.0.113.74"),
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
        [{ ...basePayload, email: "bad" }, "203.0.113.75"],
        [{ ...basePayload, website: "bot.example" }, "203.0.113.76"],
        [{ ...basePayload, formStartedAt: Date.now() }, "203.0.113.77"],
        [
          { ...basePayload, reasonForApplying: "x".repeat(4001) },
          "203.0.113.78",
        ],
      ] as const) {
        const response = await handleMentorshipApplication(
          request(payload, ip),
          {
            persist: async () => undefined,
          },
        );
        assert.equal(response.status, 400);
      }
    },
  );

  unconfigure();
});
