import { expect, test } from "@playwright/test";

const pages = [
  ["home", "/"],
  ["service", "/services/event-safety-management"],
  ["mentorship", "/mentorship"],
  ["portfolio", "/portfolio"],
  ["contact", "/contact"],
] as const;
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 1000 },
];
for (const [name, path] of pages)
  for (const viewport of viewports)
    test(`@visual ${name} ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth,
        ),
        `${path} must not overflow horizontally at ${viewport.width}px`,
      ).toBe(false);
      await expect(page).toHaveScreenshot(`${name}-${viewport.name}.png`, {
        fullPage: true,
        animations: "allow",
      });
    });
