import assert from "node:assert/strict";
import test from "node:test";
import {
  abuseSubjectHash,
  isAllowedProductionFormOrigin,
  normalizedSubmissionEmail,
  requestClientIp,
} from "../lib/forms/abuse-policy";

test("abuse tracking never stores plain email or IP identifiers", () => {
  const secret = "example-deployment-secret-long-enough";
  const email = "person@example.org";
  const ip = "203.0.113.12";
  const a = abuseSubjectHash(secret, "email", email);
  const b = abuseSubjectHash(secret, "ip", ip);

  assert.match(a, /^[a-f0-9]{64}$/);
  assert.match(b, /^[a-f0-9]{64}$/);
  assert.notEqual(a, b);
  assert.equal(a, abuseSubjectHash(secret, "email", email));
  assert.notEqual(a, abuseSubjectHash("a-different-secret", "email", email));
  assert.equal(a.includes(email), false);
  assert.equal(b.includes(ip), false);
  assert.notEqual(
    abuseSubjectHash(secret, "email", ip),
    abuseSubjectHash(secret, "ip", ip),
  );
});

test("rate limit uses a normalized email to prevent case/space bypasses", () => {
  assert.equal(
    normalizedSubmissionEmail("  Applicant@Example.ORG "),
    "applicant@example.org",
  );
  assert.equal(normalizedSubmissionEmail(null), null);
  assert.equal(normalizedSubmissionEmail("nonsense"), null);
  assert.equal(normalizedSubmissionEmail("a@"), null);
  assert.equal(normalizedSubmissionEmail("a".repeat(260) + "@example.org"), null);
});

test("request identifiers require a valid ingress-supplied IP", () => {
  assert.equal(
    requestClientIp(
      new Headers({ "x-forwarded-for": "203.0.113.10, 198.51.100.2" }),
    ),
    "203.0.113.10",
  );
  assert.equal(
    requestClientIp(new Headers({ "x-real-ip": "2001:db8::1" })),
    "2001:db8::1",
  );
  assert.equal(requestClientIp(new Headers({ "x-forwarded-for": "bogus" })), null);
  assert.equal(requestClientIp(new Headers()), null);
});

test("production form origins reject placeholder and cross-site requests", () => {
  const canonical = "https://duneconsulting.vercel.app";
  assert.equal(isAllowedProductionFormOrigin(canonical, null), true);
  assert.equal(isAllowedProductionFormOrigin(canonical, canonical), true);
  assert.equal(isAllowedProductionFormOrigin(canonical + "/", canonical), true);
  assert.equal(isAllowedProductionFormOrigin(canonical, "https://evil.test"), false);
  for (const invalid of [
    undefined,
    "",
    "not a URL",
    "http://duneconsulting.vercel.app",
    "https://localhost",
    "https://www.duneconsulting.example",
    "https://duneconsulting.vercel.app/mentorship",
    "https://duneconsulting.vercel.app?tracking=1",
    "https://person:password@duneconsulting.vercel.app",
  ]) {
    assert.equal(isAllowedProductionFormOrigin(invalid, null), false);
  }
});
