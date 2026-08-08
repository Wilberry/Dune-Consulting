import assert from "node:assert/strict";
import test from "node:test";
import { generateMetadata } from "../app/[...slug]/page";

test("internal metadata uses a page-specific canonical and social URL", async () => {
  const metadata = await generateMetadata({
    params: Promise.resolve({ slug: ["about"] }),
  });
  assert.equal(metadata.alternates?.canonical, "/about");
  assert.equal(metadata.openGraph?.url, "/about");
  assert.equal(
    metadata.title,
    "About Dune Consulting | HSE Consultancy in Lagos",
  );
});
