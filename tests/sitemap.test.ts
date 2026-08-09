import assert from "node:assert/strict";
import test from "node:test";
import sitemap from "../app/sitemap";
import robots from "../app/robots";

test("sitemap contains public routes and excludes internal endpoints", () => {
  const entries = sitemap();
  const urls = entries.map((entry) => entry.url);
  assert.ok(urls.some((url) => url.endsWith("/about")));
  assert.ok(urls.some((url) => url.endsWith("/request-quote")));
  assert.ok(
    urls.some((url) => url.endsWith("/services/event-safety-management")),
  );
  assert.equal(
    urls.some((url) => url.includes("/api/")),
    false,
  );
  assert.equal(new Set(urls).size, urls.length);
});

test("robots advertises the sitemap and blocks internal endpoints", () => {
  const value = robots();
  assert.ok(String(value.sitemap).endsWith("/sitemap.xml"));
  assert.deepEqual(value.rules, {
    userAgent: "*",
    allow: "/",
    disallow: ["/api/", "/_next/"],
  });
});
