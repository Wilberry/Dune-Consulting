import { expect, test } from "@playwright/test";

test("homepage and primary navigation load without console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Safer Workplaces.",
  );
  if ((page.viewportSize()?.width ?? 0) >= 1024) {
    for (const [label, path] of [
      ["About", "/about"],
      ["Portfolio", "/portfolio"],
      ["Mentorship", "/mentorship"],
      ["Insights", "/insights"],
      ["Contact", "/contact"],
    ] as const) {
      await page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: label, exact: true })
        .click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await page.goto("/");
    }
  }
  expect(errors).toEqual([]);
});

test("services menu supports pointer and keyboard", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop dropdown test");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  const services = nav.getByRole("link", { name: "Services", exact: true });
  await services.hover();
  await expect(
    nav.getByRole("link", { name: "Event Safety Management" }),
  ).toBeVisible();
  await services.focus();
  await page.keyboard.press("Tab");
  await expect(
    nav.getByRole("link", { name: "Event Safety Management" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/event-safety-management$/);
});

test("mobile navigation manages focus, Escape, and scrolling", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Mobile navigation test");
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Open navigation menu" });
  await trigger.click();
  const dialog = page.locator('aside[aria-label="Mobile navigation"]');
  await expect(dialog).toHaveAttribute("aria-hidden", "false");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await expect(
    page.getByRole("button", { name: "Close navigation menu" }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("link", { name: "Request a Quote" }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveAttribute("aria-hidden", "true");
  await expect(trigger).toBeFocused();
});

test("contact validation and stored delivery are honest", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.locator("[aria-invalid=true]")).toHaveCount(6);
  await page.getByLabel("Email address *").fill("not-an-email");
  await page.getByLabel("Full name *").fill("Ada Example");
  await page.getByLabel("Phone number *").fill("+234 801 234 5678");
  await page
    .getByLabel("Service required *")
    .selectOption("Event Safety Management");
  await page
    .getByLabel("How can we help? *")
    .fill("Please help us plan a safe event for our team.");
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(
    page.getByText("Please enter a valid email address."),
  ).toBeVisible();
  await expect(
    page.getByText("Please confirm that we may respond to your enquiry."),
  ).toBeVisible();
  await page.getByLabel("Email address *").fill("ada@example.org");
  await page.getByRole("checkbox").check();
  await page.waitForTimeout(3000);
  await page.getByRole("button", { name: "Send enquiry" }).click();
  await expect(page.getByRole("status")).toContainText("Enquiry received");
  await expect(page.getByRole("status")).toContainText(
    "Your enquiry has been received. Our team will respond using the details provided.",
  );
  await expect(page.getByRole("status")).not.toContainText(
    "Delivery not configured",
  );
});

test("pending contact submission cannot be duplicated", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/contact", async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        status: "unconfigured",
        message: "Email delivery is not configured.",
      }),
    });
  });
  await page.goto("/contact");
  await page.getByLabel("Full name *").fill("Ada Example");
  await page.getByLabel("Email address *").fill("ada@example.org");
  await page.getByLabel("Phone number *").fill("+234 801 234 5678");
  await page
    .getByLabel("Service required *")
    .selectOption("Event Safety Management");
  await page
    .getByLabel("How can we help? *")
    .fill("Please help us plan a safe event for our team.");
  await page.getByRole("checkbox").check();
  const submit = page.getByRole("button", { name: "Send enquiry" });
  await submit.click();
  await expect(
    page.getByRole("button", { name: "Sending enquiry…" }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Sending enquiry…" })
    .click({ force: true });
  await expect(page.getByRole("status")).toBeVisible();
  expect(requests).toBe(1);
});

test("content routes have one H1 and expected status", async ({
  page,
  request,
}) => {
  for (const path of [
    "/services/event-safety-management",
    "/services/hse-training",
    "/services/personnel-outsourcing",
    "/portfolio/jameson-distillery-on-tour",
    "/portfolio/moonshot-by-techcabal",
  ]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1:visible")).toHaveCount(1);
  }
  const missing = await page.goto("/not-an-approved-route");
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: /could not be found/i }),
  ).toBeVisible();
  for (const path of [
    "/sitemap.xml",
    "/robots.txt",
    "/manifest.webmanifest",
    "/opengraph-image",
  ])
    expect((await request.get(path)).ok()).toBeTruthy();
});

test("internal links resolve and external targets are safe", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const links = await page.locator("a[href]").evaluateAll((nodes) =>
    nodes.map((node) => ({
      href: (node as HTMLAnchorElement).href,
      target: (node as HTMLAnchorElement).target,
      rel: (node as HTMLAnchorElement).rel,
    })),
  );
  const origin = new URL(page.url()).origin;
  for (const link of links) {
    const url = new URL(link.href);
    if (url.origin === origin)
      expect(
        (await request.get(`${url.pathname}${url.search}`)).status(),
      ).toBeLessThan(400);
    if (link.target === "_blank") expect(link.rel).toMatch(/noopener/);
  }
});
