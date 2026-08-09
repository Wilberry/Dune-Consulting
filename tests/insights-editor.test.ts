import assert from "node:assert/strict";
import test from "node:test";
import { articleEditorSchema } from "../lib/validations";

const validArticle = {
  title: "Five practical checks before an event opens",
  slug: "five-practical-checks-before-an-event-opens",
  excerpt:
    "A practical pre-opening safety review for event teams, suppliers and venue stakeholders.",
  content:
    "Effective event safety starts before guests arrive. Teams should verify access routes, emergency arrangements and the condition of temporary infrastructure.\n\nA short structured review gives the event team time to correct issues before they become live operational risks.",
  category: "Event Safety",
  authorName: "Dune Consulting",
  status: "draft" as const,
  featured: false,
  seoTitle: "Five practical event safety checks",
  seoDescription:
    "Review five practical checks that help event teams identify safety issues before guests arrive.",
};

test("Insights editor accepts a complete draft", () => {
  const parsed = articleEditorSchema.safeParse(validArticle);
  assert.equal(parsed.success, true);
});

test("Insights editor accepts a publish-ready article", () => {
  const parsed = articleEditorSchema.safeParse({
    ...validArticle,
    status: "published",
    featured: true,
  });
  assert.equal(parsed.success, true);
});

test("Insights editor rejects unsafe or malformed slugs", () => {
  for (const slug of [
    "Uppercase-Slug",
    "spaces are invalid",
    "double--hyphen",
    "../unexpected-path",
  ]) {
    const parsed = articleEditorSchema.safeParse({ ...validArticle, slug });
    assert.equal(parsed.success, false);
  }
});

test("Insights editor enforces useful content and SEO limits", () => {
  const tooShort = articleEditorSchema.safeParse({
    ...validArticle,
    excerpt: "Too short",
    content: "Too short",
  });
  assert.equal(tooShort.success, false);

  const oversizedSeo = articleEditorSchema.safeParse({
    ...validArticle,
    seoTitle: "x".repeat(71),
    seoDescription: "x".repeat(161),
  });
  assert.equal(oversizedSeo.success, false);
});
