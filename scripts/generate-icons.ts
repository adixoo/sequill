/**
 * Renders the Sequill logo (src/lib/logo.ts) into every icon the app ships:
 * public/logo.svg, the web manifest PNGs, and the files Next.js links from
 * every page by convention: src/app/favicon.ico, icon.ico, apple-icon.png and
 * the share image opengraph-image.png (with its alt text). Run: bun run icons
 * (needs the network once, to fetch DM Sans for the share image).
 */
import { join } from "node:path";
import sharp from "sharp";
import { LOGO_COLORS, logoSvg } from "../src/lib/logo";
import { encodeIco } from "./ico";
import { OG_ALT, renderOgImage } from "./og-image";

const root = join(import.meta.dir, "..");
const FAVICON_SIZES = [16, 32, 48];
const ICON_SIZES = [16, 24, 32, 48, 64, 128, 256];

/** The logo drawn for `size` pixels (small sizes use the simpler mark), as a PNG. */
const render = (svg: string, size: number) =>
  sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png().toBuffer();

async function writeIco(sizes: number[], file: string) {
  const images = await Promise.all(
    sizes.map(async (size) => ({ size, png: await render(logoSvg({ size }), size) })),
  );
  await Bun.write(join(root, file), encodeIco(images));
  console.log(`${file} (${sizes.join(", ")}px)`);
}

await Bun.write(join(root, "public", "logo.svg"), logoSvg());
console.log("public/logo.svg");

// Maskable icons need the artwork inside the central 80% safe zone, on a full-bleed ground.
const maskable =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><rect width="640" height="640" fill="${LOGO_COLORS.ground}"/>` +
  `<image href="data:image/svg+xml;base64,${Buffer.from(logoSvg()).toString("base64")}" x="64" y="64" width="512" height="512"/></svg>`;

const pngs = [
  { svg: logoSvg(), size: 192, name: "icon-192.png" },
  { svg: logoSvg(), size: 512, name: "icon-512.png" },
  { svg: maskable, size: 512, name: "maskable-512.png" },
];
for (const { svg, size, name } of pngs) {
  await Bun.write(join(root, "public", "icons", name), await render(svg, size));
  console.log(`public/icons/${name}`);
}

await Bun.write(join(root, "src", "app", "apple-icon.png"), await render(logoSvg(), 180));
console.log("src/app/apple-icon.png");

await writeIco(FAVICON_SIZES, "src/app/favicon.ico");
await writeIco(ICON_SIZES, "src/app/icon.ico");

await Bun.write(join(root, "src", "app", "opengraph-image.png"), await renderOgImage());
await Bun.write(join(root, "src", "app", "opengraph-image.alt.txt"), OG_ALT);
console.log("src/app/opengraph-image.png (+ .alt.txt)");
