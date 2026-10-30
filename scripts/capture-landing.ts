/**
 * Captures the landing page's pictures from the real app: screenshots of the editor
 * and the schema designer with the sample shop open, and a short muted clip of a
 * table being dragged in the designer. Run with Node (Bun can't drive Playwright's
 * browser pipe on Windows) against a running app:
 *   node scripts/capture-landing.ts            (http://localhost:3000)
 *   BASE_URL=http://localhost:4173 node scripts/capture-landing.ts
 * The clip is encoded with the ffmpeg Playwright installs (VP8 only); set
 * FFMPEG_PATH to use another one.
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { BRAVE_PATH } from "./brave.ts";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = join(import.meta.dirname, "..", "public", "landing");
const BOOT_TIMEOUT = 60_000;
/** Widest size a picture is shown at on the page (2x for sharp screens). */
const MAX_WIDTH = 1800;
const CLIP_WIDTH = 1200;
const CLIP_FPS = 14;
/** Dev-only overlays and toasts that are not part of the product's screens. */
const HIDE_CSS = "nextjs-portal, [data-sonner-toaster] { display: none !important; }";
const hideOverlays = `addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.textContent = ${JSON.stringify(HIDE_CSS)};
  document.head.append(style);
});`;

async function save(png: Buffer, name: string, width = MAX_WIDTH): Promise<void> {
  await sharp(png)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(join(OUT, name));
  console.log(`public/landing/${name}`);
}

async function createSample(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/app`);
  await page.getByRole("button", { name: "Try the sample" }).click({ timeout: BOOT_TIMEOUT });
  await expect(page.getByRole("heading", { name: /Pick a table/ })).toBeVisible({
    timeout: BOOT_TIMEOUT,
  });
}

async function openTable(page: Page, name: string): Promise<void> {
  await page
    .getByRole("navigation", { name: "Database" })
    .getByRole("button", { name: new RegExp(`^${name}( [\\d,]+)?$`) })
    .first()
    .click();
  await expect(page.getByRole("grid", { name: `${name} rows` })).toBeVisible();
}

async function openVis(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/vis`);
  await expect(page.locator(".react-flow__node").first()).toBeVisible({ timeout: BOOT_TIMEOUT });
  await page.getByRole("button", { name: "Fit everything in view" }).click();
  await page.waitForTimeout(600);
}

/** Drags a table card by its header and returns the frames captured along the way. */
async function dragClip(page: Page, id: string, dx: number, dy: number): Promise<Buffer[]> {
  const box = await page.locator(`.react-flow__node[data-id="${id}"]`).boundingBox();
  if (!box) throw new Error(`No table card ${id}`);
  const x = box.x + box.width / 2;
  const y = box.y + 18;
  const frames: Buffer[] = [];
  const shot = async () => frames.push(await page.screenshot());
  for (let i = 0; i < 6; i++) await shot();
  await page.mouse.move(x, y);
  await page.mouse.down();
  const steps = 28;
  // Out and back, eased, so the clip loops without a jump.
  for (const dir of [1, -1]) {
    for (let i = 1; i <= steps; i++) {
      const t = 0.5 - Math.cos((Math.PI * i) / steps) / 2;
      const p = dir === 1 ? t : 1 - t;
      await page.mouse.move(x + dx * p, y + dy * p);
      await shot();
    }
    for (let i = 0; i < 8; i++) await shot();
  }
  await page.mouse.up();
  return frames;
}

/** ffmpeg from FFMPEG_PATH or Playwright's browser cache. */
function findFfmpeg(): string {
  if (process.env.FFMPEG_PATH) return process.env.FFMPEG_PATH;
  const cache =
    process.env.PLAYWRIGHT_BROWSERS_PATH ??
    (process.platform === "win32"
      ? join(process.env.LOCALAPPDATA ?? "", "ms-playwright")
      : process.platform === "darwin"
        ? join(homedir(), "Library", "Caches", "ms-playwright")
        : join(homedir(), ".cache", "ms-playwright"));
  const exe = { win32: "ffmpeg-win64.exe", darwin: "ffmpeg-mac" }[process.platform as string];
  for (const dir of existsSync(cache) ? readdirSync(cache) : []) {
    const file = join(cache, dir, exe ?? "ffmpeg-linux");
    if (dir.startsWith("ffmpeg") && existsSync(file)) return file;
  }
  throw new Error("No ffmpeg found: run `bunx playwright install ffmpeg` or set FFMPEG_PATH.");
}

/** Encodes frames as a muted VP8 WebM, with its first frame as the poster. */
async function saveClip(frames: Buffer[], name: string): Promise<void> {
  const jpegs = await Promise.all(
    frames.map((f) => sharp(f).resize({ width: CLIP_WIDTH }).jpeg({ quality: 92 }).toBuffer()),
  );
  const ffmpeg = spawn(
    findFfmpeg(),
    ["-loglevel", "error", "-f", "image2pipe", "-framerate", String(CLIP_FPS), "-c:v", "mjpeg"]
      .concat(["-i", "pipe:0", "-an", "-c:v", "vp8", "-b:v", "1500k", "-crf", "8"])
      .concat(["-auto-alt-ref", "0", "-y", join(OUT, name)]),
    { stdio: ["pipe", "inherit", "inherit"] },
  );
  const done = new Promise<void>((resolve, reject) =>
    ffmpeg.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`)),
    ),
  );
  for (const jpeg of jpegs) ffmpeg.stdin.write(jpeg);
  ffmpeg.stdin.end();
  await done;
  await save(frames[0], name.replace(/\.webm$/, "-poster.webp"), CLIP_WIDTH);
  console.log(`public/landing/${name} (${frames.length} frames)`);
}

const browser = await chromium.launch({ executablePath: BRAVE_PATH });
try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.25,
    colorScheme: "dark",
  });
  await desktop.addInitScript(hideOverlays);
  const page = await desktop.newPage();
  await createSample(page);

  await openTable(page, "products");
  await page.getByRole("grid", { name: "products rows" }).getByRole("gridcell").nth(6).click();
  await save(await page.screenshot(), "editor-grid.webp");

  await openTable(page, "orders");
  await page.getByRole("button", { name: "Filters" }).click();
  await page.getByRole("combobox", { name: "Column" }).click();
  await page.getByRole("option", { name: "status" }).click();
  await page.getByRole("combobox", { name: "Condition" }).click();
  await page.getByRole("option", { name: "equals", exact: true }).click();
  await page.getByRole("textbox", { name: "Value" }).fill("shipped");
  await save(await page.screenshot(), "editor-filter.webp");
  await page.getByRole("button", { name: "Apply" }).click();

  await page.getByRole("button", { name: "New query" }).first().click();
  await page.locator(".cm-content").click();
  await page.keyboard.insertText(
    "SELECT customer, count(*) AS orders, round(sum(total), 2) AS spent\n  FROM order_totals\n WHERE status != 'cancelled'\n GROUP BY customer\n ORDER BY spent DESC\n LIMIT 8;",
  );
  await page.keyboard.press("Control+Enter");
  await expect(page.getByRole("grid", { name: "Query results" })).toBeVisible();
  await save(await page.screenshot(), "editor-console.webp");

  await openVis(page);
  await save(await page.screenshot(), "vis-diagram.webp");
  // Dragging order_items past products makes its foreign-key lines switch sides.
  await saveClip(await dragClip(page, "t:order_items", 720, -200), "vis-drag.webm");
  // The drag can end a few pixels off; lay the diagram out again before the next shot.
  await page.getByRole("button", { name: "Auto-arrange tables" }).click();
  await page.getByRole("button", { name: "Fit everything in view" }).click();

  await page.getByRole("button", { name: "Add table" }).first().click();
  await page.getByLabel("Name", { exact: true }).fill("reviews");
  const details = page.getByRole("complementary", { name: "Details" });
  await details.getByRole("button", { name: "Add column" }).click();
  await details.getByRole("textbox", { name: "Column name" }).nth(1).fill("product_id");
  await page.getByRole("button", { name: "Fit everything in view" }).click();
  await page
    .locator('.react-flow__node[data-id="t:products"] .react-flow__handle[data-handleid="R:id"]')
    .dragTo(
      page.locator(
        '.react-flow__node[data-id^="d:"] .react-flow__handle[data-handleid="L:product_id"]',
      ),
    );
  // Deselect so the diagram shows the new table and its pending link without the focus dimming.
  await page.locator(".react-flow__pane").click({ position: { x: 20, y: 300 } });
  await page.getByRole("button", { name: "Fit everything in view" }).click();
  await page.waitForTimeout(600);
  await save(await page.screenshot(), "vis-design.webp");
  await desktop.close();

  const phone = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: "dark",
  });
  await phone.addInitScript(hideOverlays);
  const mobile = await phone.newPage();
  await createSample(mobile);
  await mobile.getByRole("button", { name: "Open sidebar" }).click();
  await openTable(mobile, "customers");
  await mobile.waitForTimeout(400);
  await save(await mobile.screenshot(), "editor-phone.webp", 780);
  await phone.close();
} finally {
  await browser.close();
}
