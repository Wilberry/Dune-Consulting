import assert from "node:assert/strict";
import test from "node:test";
import { getTurnstileEnvironment } from "../lib/server-env";
import { isTurnstileResponseValid } from "../lib/turnstile/verification";

test("Turnstile Siteverify responses require success, matching action and production hostname", () => {
  const valid = {
    success: true,
    action: "contact",
    hostname: "duneconsult.ng",
  };

  assert.equal(
    isTurnstileResponseValid(valid, "contact", "duneconsult.ng"),
    true,
  );
  assert.equal(isTurnstileResponseValid(valid, "quote", "duneconsult.ng"), false);
  assert.equal(
    isTurnstileResponseValid(valid, "contact", "example.org"),
    false,
  );
  assert.equal(
    isTurnstileResponseValid({ ...valid, success: false }, "contact", null),
    false,
  );
  assert.equal(
    isTurnstileResponseValid(
      { success: true, hostname: "duneconsult.ng" },
      "contact",
      null,
    ),
    false,
  );
});

test("Turnstile environment distinguishes disabled, partial and complete configuration", () => {
  const originalSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const originalSecret = process.env.TURNSTILE_SECRET_KEY;

  try {
    delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    delete process.env.TURNSTILE_SECRET_KEY;
    assert.equal(getTurnstileEnvironment().status, "disabled");

    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "1x00000000000000000000AA";
    assert.equal(getTurnstileEnvironment().status, "misconfigured");

    process.env.TURNSTILE_SECRET_KEY =
      "1x0000000000000000000000000000000AA";
    assert.equal(getTurnstileEnvironment().status, "configured");
  } finally {
    if (originalSiteKey === undefined)
      delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    else process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalSiteKey;

    if (originalSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = originalSecret;
  }
});
