import assert from "node:assert/strict";
import test from "node:test";
import { industries, serviceDetails } from "../data/page-content";
import { serviceNavigation } from "../data/navigation";
import { services } from "../data/services";
import { supportedRoutes } from "../data/routes";

test("About page lists corporate workplaces before events and entertainment", () => {
  assert.deepEqual(
    industries.slice(0, 2).map(({ title }) => title),
    ["Corporate workplaces", "Events & entertainment"],
  );
});

test("Bespoke HSE Training title and heading are consistent across the site", () => {
  assert.equal(serviceDetails["hse-training"].title, "Bespoke HSE Training");
  assert.equal(
    serviceDetails["hse-training"].overviewHeading,
    "Practical HSE training that supports confident delivery",
  );
  assert.equal(
    serviceNavigation.find(({ href }) => href === "/services/hse-training")
      ?.label,
    "Bespoke HSE Training",
  );
  assert.equal(
    services.find(({ href }) => href === "/services/hse-training")?.title,
    "Bespoke HSE Training",
  );
  assert.equal(
    supportedRoutes["services/hse-training"].title,
    "Bespoke HSE Training",
  );
});
