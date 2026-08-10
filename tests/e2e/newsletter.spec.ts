import { expect, test } from "@playwright/test";

test("footer newsletter signup succeeds without depending on live services", async ({
  page,
}) => {
  let requests = 0;
  await page.route("**/api/newsletter", async (route) => {
    requests += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "success",
        message:
          "You are subscribed to Dune Consulting insights. We will share practical HSE updates using this email address.",
      }),
    });
  });

  await page.goto("/");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("reader@example.org");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();

  await expect(page.getByRole("status")).toContainText(
    "You are subscribed to Dune Consulting insights.",
  );
  await expect(page.getByLabel("Email address", { exact: true })).toHaveValue(
    "",
  );
  expect(requests).toBe(1);
});

test("pending newsletter signup cannot be duplicated", async ({ page }) => {
  let requests = 0;
  await page.route("**/api/newsletter", async (route) => {
    requests += 1;
    await new Promise((resolve) => setTimeout(resolve, 400));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "success",
        message:
          "You are subscribed to Dune Consulting insights. We will share practical HSE updates using this email address.",
      }),
    });
  });

  await page.goto("/");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("reader@example.org");
  const submit = page.getByRole("button", { name: "Subscribe", exact: true });
  await submit.click();
  await expect(
    page.getByRole("button", { name: "Subscribing…", exact: true }),
  ).toBeDisabled();
  await page
    .getByRole("button", { name: "Subscribing…", exact: true })
    .click({ force: true });
  await expect(page.getByRole("status")).toBeVisible();
  expect(requests).toBe(1);
});
