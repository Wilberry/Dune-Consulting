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

test("normalizeFaqItems removes dash characters from displayed copy", () => {
  const items = normalizeFaqItems([
    {
      question: "Can you plan pre-event safety?",
      answer: "Yes—on-site support.",
    },
  ]);

  assert.deepEqual(items, [
    {
      question: "Can you plan pre event safety?",
      answer: "Yes on site support.",
    },
  ]);
});

test("normalizeFaqItems preserves database identity and admin metadata", () => {
  const items = normalizeFaqItems([
    {
      id: "c72a0c95-e624-4bf1-85a6-a0e3c2a087bc",
      question: "Can you help?",
      answer: "Yes, we can provide practical support.",
      sortOrder: 3,
      isActive: false,
    },
  ]);

  assert.deepEqual(items, [
    {
      id: "c72a0c95-e624-4bf1-85a6-a0e3c2a087bc",
      question: "Can you help?",
      answer: "Yes, we can provide practical support.",
      sortOrder: 3,
      isActive: false,
    },
  ]);
});
