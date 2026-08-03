import assert from "node:assert/strict";
import test from "node:test";
import { publicEnv, publicEnvFallbacks } from "../lib/env";

test("public configuration has safe non-secret fallbacks", () => {
  assert.ok(publicEnv.siteUrl.startsWith("https://"));
  assert.equal(typeof publicEnv.companyPhone, "string");
  assert.ok(publicEnvFallbacks.siteUrl.endsWith(".example"));
  assert.equal("RESEND_API_KEY" in publicEnv, false);
});
