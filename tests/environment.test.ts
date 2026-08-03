import assert from "node:assert/strict";
import test from "node:test";
import { publicEnv, publicEnvFallbacks } from "../lib/env";
import { getEmailEnvironment } from "../lib/server-env";

test("public configuration has safe non-secret fallbacks", () => {
  assert.ok(publicEnv.siteUrl.startsWith("https://"));
  assert.equal(typeof publicEnv.companyPhone, "string");
  assert.ok(publicEnvFallbacks.siteUrl.endsWith(".example"));
  assert.equal("RESEND_API_KEY" in publicEnv, false);
  assert.equal(publicEnv.reviewMode, false);
});

test("Vercel previews do not send email without explicit authorisation", () => {
  const previous = {
    vercel: process.env.VERCEL_ENV,
    enabled: process.env.ENABLE_PREVIEW_EMAIL_DELIVERY,
    key: process.env.RESEND_API_KEY,
    recipient: process.env.CONTACT_RECIPIENT_EMAIL,
    from: process.env.CONTACT_FROM_EMAIL,
  };
  Object.assign(process.env, {
    VERCEL_ENV: "preview",
    ENABLE_PREVIEW_EMAIL_DELIVERY: "false",
    RESEND_API_KEY: "re_test_key_not_real_12345",
    CONTACT_RECIPIENT_EMAIL: "recipient@example.org",
    CONTACT_FROM_EMAIL: "website@example.org",
  });
  try {
    const result = getEmailEnvironment();
    assert.equal(result.configured, false);
    if (!result.configured)
      assert.deepEqual(result.missing, ["ENABLE_PREVIEW_EMAIL_DELIVERY"]);
  } finally {
    for (const [key, value] of Object.entries({
      VERCEL_ENV: previous.vercel,
      ENABLE_PREVIEW_EMAIL_DELIVERY: previous.enabled,
      RESEND_API_KEY: previous.key,
      CONTACT_RECIPIENT_EMAIL: previous.recipient,
      CONTACT_FROM_EMAIL: previous.from,
    }))
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
  }
});
