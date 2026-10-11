import assert from "node:assert/strict";
import test from "node:test";
import { createRateLimiter } from "../lib/rate-limit";

test("rate limiter enforces the existing five attempts per window", () => {
  const check = createRateLimiter();
  for (let i = 0; i < 5; i += 1) {
    assert.equal(check("203.0.113.101", 1000).allowed, true);
  }
  assert.deepEqual(check("203.0.113.101", 1000), {
    allowed: false,
    remaining: 0,
  });
  assert.equal(check("203.0.113.101", 901001).allowed, true);
});

test("bounded limiter fails closed rather than allowing identifier-flood eviction", () => {
  const check = createRateLimiter({
    windowMs: 1000,
    limit: 2,
    maxIdentifiers: 2,
  });

  assert.equal(check("a", 10).allowed, true);
  assert.equal(check("b", 10).allowed, true);
  assert.equal(check("c", 10).allowed, false);
  assert.equal(check("a", 10).remaining, 0);
  assert.equal(check("b", 10).remaining, 0);
  assert.equal(check("c", 1011).allowed, true);
  assert.equal(check("a", 1011).allowed, true);
});

test("an expired identifier is reusable even at capacity", () => {
  const check = createRateLimiter({
    windowMs: 100,
    limit: 1,
    maxIdentifiers: 1,
  });
  assert.equal(check("one", 0).allowed, true);
  assert.equal(check("one", 0).allowed, false);
  assert.equal(check("one", 100).allowed, true);
});
