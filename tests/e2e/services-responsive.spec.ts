import { expect, test } from "@playwright/test";

test("services overview stays reachable on mobile and tablet navigation", async ({
  page,
}) => {
  test.skip(
    test.info().project.name !== "chromium-desktop",
    "Responsive navigation check runs once with explicit viewports",
  );

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");

    await page.getByRole("button", { name: "Open navigation menu" }).click();
    const dialog = page.locator('aside[aria-label="Mobile navigation"]');
    await dialog.getByRole("button", { name: "Services" }).click();

    const overviewLink = dialog.getByRole("link", {
      name: "View All Services",
    });
    await expect(overviewLink).toBeVisible();
    await overviewLink.click();

    await expect(page).toHaveURL(/\/services$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Connected HSE support for safer delivery",
    );
  }
});
