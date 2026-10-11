import assert from "node:assert/strict";
import test from "node:test";
import {
  generateInvitationCode,
  hashInvitationCode,
} from "../lib/mentorship/invitation-token";
import { callbackDestination } from "../lib/auth/callback-destination";

test("secure invitation codes are random, hashed and strictly validated", () => {
  const a = generateInvitationCode();
  const b = generateInvitationCode();
  assert.equal(a.code.length, 43);
  assert.notEqual(a.code, b.code);
  assert.match(a.tokenHash, /^[a-f0-9]{64}$/);
  assert.equal(hashInvitationCode(a.code), a.tokenHash);
  assert.notEqual(a.code, a.tokenHash);
  assert.equal(hashInvitationCode(a.code + "x"), null);
  assert.equal(hashInvitationCode(undefined), null);
  assert.equal(hashInvitationCode(""), null);
});

test("auth callbacks accept only the two intentional internal destinations", () => {
  assert.equal(callbackDestination("/dashboard"), "/dashboard");
  assert.equal(callbackDestination("/admin/update-password"), "/admin/update-password");
  for (const bad of [
    "//evil.example",
    "https://evil.example",
    "/\\evil.example",
    "/admin",
    "/dashboard/../../outside",
    "/%2F%2Fevil.example",
    null,
  ]) {
    assert.equal(callbackDestination(bad), "/admin/update-password");
  }
});
