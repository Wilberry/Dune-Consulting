import { test } from "@playwright/test";

const captures = [
  ["homepage-desktop", "/", 1440, 1000],
  ["homepage-mobile", "/", 390, 844],
  ["about-desktop", "/about", 1440, 1000],
  [
    "event-safety-management-desktop",
    "/services/event-safety-management",
    1440,
    1000,
  ],
  ["mentorship-mobile", "/mentorship", 390, 844],
  ["portfolio-desktop", "/portfolio", 1440, 1000],
  ["contact-mobile", "/contact", 390, 844],
] as const;

for (const [name, path, width, height] of captures)
  test(`capture ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.screenshot({
      path: `docs/review-screenshots/preview-placeholder-${name}.png`,
      fullPage: true,
      animations: "disabled",
    });
  });
