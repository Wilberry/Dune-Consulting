import assert from "node:assert/strict";
import test from "node:test";
import { consultationSchema } from "../lib/validations";

const valid = {
  name: "Ada Example",
  email: "ada@example.org",
  phone: "+234 801 234 5678",
  organisation: "Example Ltd",
  service: "Event Safety Management",
  projectDate: "2026-10-01",
  location: "Lagos",
  message: "Please help us plan a safe corporate event.",
  consent: true,
  website: "",
  formStartedAt: Date.now() - 5000,
  originPage: "https://example.org/contact",
};

test("a complete enquiry passes validation", () =>
  assert.equal(consultationSchema.safeParse(valid).success, true));
test("honeypot and malformed fields fail validation", () => {
  assert.equal(
    consultationSchema.safeParse({
      ...valid,
      website: "spam",
      email: "invalid",
      consent: false,
    }).success,
    false,
  );
});
test("server input limits reject oversized content", () =>
  assert.equal(
    consultationSchema.safeParse({ ...valid, message: "x".repeat(4001) })
      .success,
    false,
  ));
