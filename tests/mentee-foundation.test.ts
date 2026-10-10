import assert from "node:assert/strict";
import test from "node:test";
import {
  generateInvitationCode,
  hashInvitationCode,
} from "../lib/mentorship/invitation-token";
import { mentorshipApplicationSchema } from "../lib/validations";

test("invitation codes are random, hashed and input-validated", () => {
  const first = generateInvitationCode();
  const second = generateInvitationCode();
  assert.equal(first.code.length, 43);
  assert.notEqual(first.code, second.code);
  assert.match(first.tokenHash, /^[a-f0-9]{64}$/);
  assert.equal(hashInvitationCode(first.code), first.tokenHash);
  assert.notEqual(first.tokenHash, first.code);
  assert.equal(hashInvitationCode(first.code + "x"), null);
  assert.equal(hashInvitationCode(undefined), null);
});

test("new mentorship applications require a supported package", () => {
  const payload = {
    name: "Sample Applicant",
    email: "sample@example.org",
    phone: "+2348012345678",
    selectedPackage: "Momentum",
    experienceLevel: "Recent graduate",
    reasonForApplying: "I want practical workplace safety guidance.",
    careerGoals: "I want to develop stronger HSE competencies.",
    consent: true,
    website: "",
    formStartedAt: Date.now() - 6000,
  };
  assert.equal(mentorshipApplicationSchema.safeParse(payload).success, true);
  for (const invalid of ["Custom", "", null, undefined]) {
    assert.equal(
      mentorshipApplicationSchema.safeParse({
        ...payload,
        selectedPackage: invalid,
      }).success,
      false,
    );
  }
});
