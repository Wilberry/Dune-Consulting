import assert from "node:assert/strict";
import test from "node:test";

import { faqDefaultItems, normalizeFaqItems } from "@/lib/faq";

test("faq default seed retains the current site questions", () => {
  assert.ok(
    faqDefaultItems.some(
      (item) => item.question === "What does Dune Consulting do?",
    ),
  );
  assert.ok(
    faqDefaultItems.some(
      (item) => item.question === "Why should I choose Dune Consulting?",
    ),
  );
});

test("normalizeFaqItems removes empty entries and preserves order", () => {
  const items = normalizeFaqItems([
    { question: "   Q1  ", answer: "A1" },
    { question: "Q2", answer: "   " },
    { question: "Q3", answer: "A3" },
  ]);

  assert.deepEqual(items, [
    { question: "Q1", answer: "A1" },
    { question: "Q3", answer: "A3" },
  ]);
});
