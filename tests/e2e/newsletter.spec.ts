import { expect, test } from "@playwright/test";
import { installTurnstileMock } from "./turnstile-mock";

test.beforeEach(async ({ page }) => {
  await installTurnstileMock(page);
});

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
          "Thanks for your interest. If this address is eligible for updates, you will receive Dune Consulting insights.",
      }),
    });
  });

  await page.goto("/");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("reader@example.org");
  const submit = page.getByRole("button", { name: "Subscribe", exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();

  await expect(page.getByRole("status")).toContainText(
    "Thanks for your interest.",
  );
  await expect(page.getByLabel("Email address", { exact: true })).toHaveValue(
    "",
  );
  expect(requests).toBe(1);
});

test("pending newsletter signup cannot be duplicated", async ({ page }) => {
  let requests = 0;
  let releaseResponse!: () => void;
  const responsePending = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });
  await page.route("**/api/newsletter", async (route) => {
    requests += 1;
    await responsePending;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "success",
        message:
          "Thanks for your interest. If this address is eligible for updates, you will receive Dune Consulting insights.",
      }),
    });
  });

  await page.goto("/");
  await page
    .getByLabel("Email address", { exact: true })
    .fill("reader@example.org");
  const submit = page.getByRole("button", { name: "Subscribe", exact: true });
  await expect(submit).toBeEnabled();
  await submit.click();
  try {
    const pendingSubmit = page.getByRole("button", {
      name: "Subscribing…",
      exact: true,
    });
    await expect(pendingSubmit).toBeDisabled();
    await pendingSubmit.click({ force: true });
    expect(requests).toBe(1);
  } finally {
    releaseResponse();
  }
  await expect(page.getByRole("status")).toBeVisible();
});
