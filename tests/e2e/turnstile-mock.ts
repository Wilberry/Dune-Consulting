import type { Page } from "@playwright/test";

export async function installTurnstileMock(page: Page) {
  await page.addInitScript(() => {
    window.turnstile = {
      render: (_container, options) => {
        window.setTimeout(() => options.callback("playwright-test-token"), 0);
        return "playwright-test-widget";
      },
      reset: () => {},
      remove: () => {},
    };
  });

  await page.route(
    "https://challenges.cloudflare.com/turnstile/v0/api.js**",
    (route) =>
      route.fulfill({
        contentType: "application/javascript",
        body: "",
      }),
  );
}
