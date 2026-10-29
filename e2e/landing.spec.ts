import { join } from "node:path";
import { expect, test } from "@playwright/test";

const fixture = (name: string) => join(__dirname, "fixtures", name);

test("the landing page reads a chosen SQLite file in the tab", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Sequill" })).toBeVisible();

  const reader = page.locator("#your-file");
  // Before a file is chosen it shows the sample shop's file as an example.
  await expect(reader).toContainText("For example: Sample shop.sqlite");

  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.method()));
  await reader.getByLabel("Choose a database file").setInputFiles(fixture("notes.sqlite"));
  await expect(reader).toContainText("notes.sqlite 2 tables, 1 view");
  await expect(reader.getByRole("list", { name: "Tables" }).getByRole("listitem")).toHaveText([
    "notes",
    "tags",
  ]);
  await expect(reader).toContainText("4.0 KB");
  await expect(reader).toContainText("Read in this tab. Nothing was sent anywhere.");
  // Reading the file sends nothing anywhere.
  expect(requests.filter((method) => method !== "GET")).toEqual([]);

  await reader.getByLabel("Choose a database file").setInputFiles(fixture("people.csv"));
  await expect(reader).toContainText("people.csv: This file doesn’t start with the SQLite header.");
});

test("the first screen links to both products", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Main" });
  await expect(nav.getByRole("link", { name: "Open the editor" })).toHaveAttribute("href", "/app");
  await expect(nav.getByRole("link", { name: "Open the schema designer" })).toHaveAttribute(
    "href",
    "/vis",
  );
  await expect(nav.getByRole("button", { name: "Install app" })).toBeVisible();
  await expect(
    page.getByRole("contentinfo").getByRole("link", { name: "adibitz" }),
  ).toHaveAttribute("href", "https://adibitz.com");
  await expect(
    page.getByRole("link", { name: "Learn them from beginner to advanced" }),
  ).toHaveAttribute("href", "https://database-beginner-to-advance.vercel.app/");
});

test("the orders board opens one row at a time", async ({ page }) => {
  await page.goto("/");
  const board = page.getByRole("list", { name: "Orders in the sample shop" });
  await expect(board.getByRole("button", { name: /^Asha Rao/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await board.getByRole("button", { name: /^Lena Ito/ }).click();
  await expect(board.getByRole("button", { name: /^Lena Ito/ })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(board).toContainText("3 × Copper Teapot, 4 × Pastel Planner, 1 × Ceramic Vase");
  await expect(board.getByRole("button", { name: /^Asha Rao/ })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("smooth scrolling runs on the home page only", async ({ page }) => {
  await page.goto("/");
  const root = page.locator("html");
  await expect(root).toHaveClass(/\blenis\b/);
  await page
    .getByRole("navigation", { name: "Main" })
    .getByRole("link", { name: "Open the editor" })
    .click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(root).not.toHaveClass(/\blenis\b/);
});

test("smooth scrolling stays off for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
});
