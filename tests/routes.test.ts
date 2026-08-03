import assert from "node:assert/strict";
import test from "node:test";
import { getSupportedRoute, supportedRoutes } from "../data/routes";

test("every approved route resolves by slug", () => {
  for (const route of Object.values(supportedRoutes)) {
    assert.deepEqual(
      getSupportedRoute(route.path.split("/").filter(Boolean)),
      route,
    );
  }
});

test("unknown routes are rejected", () => {
  assert.equal(getSupportedRoute(["not-a-page"]), undefined);
  assert.equal(getSupportedRoute(["services", "not-a-service"]), undefined);
});
