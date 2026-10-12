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
  "/request-quote",
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


test("@a11y Turnstile spam-protection labels use a permitted group role", async ({
  page,
}) => {
  await page.goto("/contact");

  // Turnstile is optional in local development. When a public site key is
  // configured, every named wrapper must expose its label through a role
  // that permits aria-label, not an unnamed generic <div>.
  const widgets = page.locator('[aria-label="Spam protection"]');
  for (let index = 0; index < (await widgets.count()); index++) {
    await expect(widgets.nth(index)).toHaveAttribute("role", "group");
  }
});
