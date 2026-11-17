import { expect, test } from "@playwright/test";

const RELEASE_FILES = /^https:\/\/github\.com\/adixoo\/sequill-desktop\/releases\/download\//;

test("the download page offers this system's installer and every system's files", async ({
  page,
}) => {
  await page.goto("/download");
  await expect(page.getByRole("heading", { level: 1, name: "Download Sequill" })).toBeVisible();

  // The tests run on Windows in desktop Chrome's user agent, so the big tile offers the Windows installer.
  const primary = page.getByRole("link", { name: /^Download for Windows/ });
  await expect(primary).toHaveAttribute("href", RELEASE_FILES);
  await expect(primary).toHaveAttribute("href", /setup\.exe$/);

  const platforms = page.locator("#platforms");
  for (const system of ["Windows", "macOS", "Linux"]) {
    await expect(platforms.getByRole("heading", { level: 2, name: system })).toBeVisible();
  }
  const links = platforms.getByRole("link");
  await expect(links).toHaveCount(7);
  for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute("href")))) {
    expect(href).toMatch(RELEASE_FILES);
  }

  await expect(page.getByRole("heading", { name: "Or install it from the browser" })).toBeVisible();
  await expect(page.locator("#whats-new").getByRole("heading", { level: 2 })).toHaveText(
    /^New in \d+\.\d+\.\d+/,
  );
});

test("the landing page links to the download page", async ({ page }) => {
  await page.goto("/");
  const desktop = page.locator("#desktop");
  await expect(
    desktop.getByRole("heading", { level: 2, name: "Also on your desktop" }),
  ).toBeVisible();
  await expect(desktop.getByRole("link", { name: "Download the desktop app" })).toHaveAttribute(
    "href",
    "/download",
  );
  await expect(page.getByRole("link", { name: "or get the desktop app" })).toHaveAttribute(
    "href",
    "/download",
  );
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "Desktop app" }),
  ).toHaveAttribute("href", "/download");
});
