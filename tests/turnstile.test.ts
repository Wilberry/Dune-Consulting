import assert from "node:assert/strict";
import test from "node:test";
import {
  getTurnstileEnvironment,
  requiresTurnstileVerification,
} from "../lib/server-env";
import {
  isTurnstileResponseValid,
  parseProductionTurnstileHostname,
} from "../lib/turnstile/verification";

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

test("production Turnstile hostname validation requires an exact canonical HTTPS origin", () => {
  for (const url of [
    "https://duneconsulting.vercel.app",
    "https://duneconsulting.vercel.app/",
    "https://www.duneconsult.ng",
  ]) {
    assert.equal(
      parseProductionTurnstileHostname(url),
      new URL(url).hostname,
      url,
    );
  }

  for (const url of [
    undefined,
    "",
    "not-a-url",
    "http://duneconsulting.vercel.app",
    "https://localhost",
    "https://127.0.0.1",
    "https://www.duneconsulting.example",
    "https://duneconsulting.vercel.app:8443",
    "https://duneconsulting.vercel.app/contact",
    "https://duneconsulting.vercel.app?source=test",
    "https://duneconsulting.vercel.app/#contact",
    "https://user:password@duneconsulting.vercel.app",
  ]) {
    assert.equal(parseProductionTurnstileHostname(url), null, String(url));
  }
});

test("mentorship tokens cannot be replayed for a different form action or hostname", () => {
  const valid = {
    success: true,
    action: "mentorship",
    hostname: "duneconsulting.vercel.app",
  };
  assert.equal(
    isTurnstileResponseValid(valid, "mentorship", "duneconsulting.vercel.app"),
    true,
  );
  assert.equal(
    isTurnstileResponseValid(valid, "quote", "duneconsulting.vercel.app"),
    false,
  );
  assert.equal(
    isTurnstileResponseValid(valid, "mentorship", "duneconsult.ng"),
    false,
  );
});
