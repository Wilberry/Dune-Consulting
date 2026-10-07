import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeTestimonials,
  testimonialDefaultItems,
} from "@/lib/testimonials";

test("testimonial default seed keeps the current client stories", () => {
  assert.ok(
    testimonialDefaultItems.some(
      (item) => item.name === "Amina Yusuf" && item.role === "HSE Graduate",
    ),
  );
  assert.ok(
    testimonialDefaultItems.some(
      (item) => item.name === "Michael Ade" && item.role === "Event Operations Manager",
    ),
  );
});

test("normalizeTestimonials removes incomplete entries and trims text", () => {
  const items = normalizeTestimonials([
    { name: "  Jane Doe  ", role: "Manager", quote: "Good", image: "https://example.com/avatar.jpg", rating: 5 },
    { name: "", role: "", quote: "   ", image: "", rating: 0 },
    { name: "John Smith", role: "Lead", quote: "Great support", image: "/img/john.jpg", rating: 4 },
  ]);

  assert.deepEqual(items, [
    { name: "Jane Doe", role: "Manager", quote: "Good", image: "https://example.com/avatar.jpg", rating: 5 },
    { name: "John Smith", role: "Lead", quote: "Great support", image: "/img/john.jpg", rating: 4 },
  ]);
});
