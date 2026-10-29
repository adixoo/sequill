import { expect, test } from "@playwright/test";

test("the editor loads and keeps its data with no network after the first visit", async ({
  page,
  context,
}) => {
  await page.goto("/");
  // Wait until the service worker has installed (precached everything) and controls the page.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
  });
  await page.reload();
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);

  await page.goto("/app");
  await page.getByRole("button", { name: "Try the sample" }).click({ timeout: 30_000 });
  await expect(page.getByRole("heading", { name: /Pick a table/ })).toBeVisible();

  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: /Pick a table/ })).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole("navigation", { name: "Database" })).toContainText("customers");
});
