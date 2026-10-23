import assert from "node:assert/strict";
import test from "node:test";
import {
  consultationSchema,
  quoteRequestSchema,
  unifiedEnquirySchema,
} from "../lib/validations";
import { buildEnquirySubmission } from "../lib/forms/unified-enquiry";

const base = {
  name: "Ada Example",
  email: "ada@example.org",
  phone: "+234 801 234 5678",
  service: "Event Safety Management",
  organisation: "Example Ltd",
  location: "Lagos",
  projectDate: "2026-12-11",
  message: "Please help our team plan a safe event for our organisation.",
  consent: true,
  website: "",
  formStartedAt: Date.now() - 10000,
  originPage: "https://duneconsulting.vercel.app/contact",
};

test("the unified form retains contact workflow and payload validation", () => {
  const parsed = unifiedEnquirySchema.parse({ ...base, intent: "enquiry" });
  const result = buildEnquirySubmission(
    parsed,
    base.originPage,
    base.formStartedAt,
  );
  assert.equal(result.endpoint, "/api/contact");
  assert.equal(consultationSchema.safeParse(result.payload).success, true);
  assert.equal("projectDescription" in result.payload, false);
});

test("the unified form retains commercial workflow and quote-specific fields", () => {
  const parsed = unifiedEnquirySchema.parse({
    ...base,
    intent: "quote",
    participantCount: 120,
    additionalRequirements: "Provide trained marshals.",
  });
  const result = buildEnquirySubmission(
    parsed,
    base.originPage,
    base.formStartedAt,
  );
  assert.equal(result.endpoint, "/api/quote");
  assert.equal(quoteRequestSchema.safeParse(result.payload).success, true);
  assert.equal("message" in result.payload, false);
});

test("quote detail and both purposes retain their own length rules", () => {
  const short = { ...base, message: "A brief note." };
  assert.equal(
    unifiedEnquirySchema.safeParse({ ...short, intent: "enquiry" }).success,
    true,
  );
  assert.equal(
    unifiedEnquirySchema.safeParse({ ...short, intent: "quote" }).success,
    false,
  );
  const long = { ...base, message: "a".repeat(4500) };
  assert.equal(
    unifiedEnquirySchema.safeParse({ ...long, intent: "enquiry" }).success,
    false,
  );
  assert.equal(
    unifiedEnquirySchema.safeParse({ ...long, intent: "quote" }).success,
    true,
  );
});
