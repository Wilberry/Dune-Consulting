import assert from "node:assert/strict";
import test from "node:test";
import {
  allowEmailOnlySignupSync,
  consentAfterProviderUpdate,
} from "../lib/newsletter/consent";

test("email-only signups do not revive an unsubscribed contact", () => {
  assert.equal(allowEmailOnlySignupSync("subscribed"), true);
  assert.equal(allowEmailOnlySignupSync("unsubscribed"), false);
});

test("provider updates can suppress but never regrant newsletter consent", () => {
  assert.equal(consentAfterProviderUpdate("subscribed", true), "unsubscribed");
  assert.equal(consentAfterProviderUpdate("subscribed", false), "subscribed");
  assert.equal(consentAfterProviderUpdate("unsubscribed", true), "unsubscribed");
  assert.equal(consentAfterProviderUpdate("unsubscribed", false), "unsubscribed");
});
