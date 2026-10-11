import assert from "node:assert/strict";
import test from "node:test";
import {
  getTurnstileEnvironment,
  requiresTurnstileVerification,
} from "../lib/server-env";
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
  assert.equal(
    isTurnstileResponseValid(valid, "quote", "duneconsult.ng"),
    false,
  );
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

    process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";
    assert.equal(getTurnstileEnvironment().status, "configured");
  } finally {
    if (originalSiteKey === undefined)
      delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    else process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = originalSiteKey;

    if (originalSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
    else process.env.TURNSTILE_SECRET_KEY = originalSecret;
  }
});

test("Turnstile is mandatory in deployed production and when explicitly required", () => {
  const priorVercel = process.env.VERCEL_ENV;
  const priorRequired = process.env.REQUIRE_TURNSTILE;
  try {
    process.env.VERCEL_ENV = "production";
    delete process.env.REQUIRE_TURNSTILE;
    assert.equal(requiresTurnstileVerification(), true);
    process.env.VERCEL_ENV = "preview";
    assert.equal(requiresTurnstileVerification(), false);
    process.env.REQUIRE_TURNSTILE = "true";
    assert.equal(requiresTurnstileVerification(), true);
  } finally {
    if (priorVercel === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = priorVercel;
    if (priorRequired === undefined) delete process.env.REQUIRE_TURNSTILE;
    else process.env.REQUIRE_TURNSTILE = priorRequired;
  }
});
