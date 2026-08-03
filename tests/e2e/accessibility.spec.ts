import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/",
  "/about",
  "/services",
  "/services/event-safety-management",
  "/mentorship",
  "/portfolio",
  "/portfolio/jameson-distillery-on-tour",
  "/insights",
  "/contact",
  "/not-an-approved-route",
];
for (const path of pages)
  test(`@a11y ${path} has no serious or critical axe violations`, async ({
    page,
  }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? ""),
    );
    expect(
      blocking,
      blocking.map((item) => `${item.id}: ${item.help}`).join("\n"),
    ).toEqual([]);
  });
