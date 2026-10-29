import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(import.meta.dir, "tokens.css"), "utf8");

/** Collects `--name: value` pairs from every block whose selector matches. */
function readVars(selector: RegExp): Map<string, string> {
  const vars = new Map<string, string>();
  for (const block of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    if (!selector.test(block[1].replace(/\/\*[\s\S]*?\*\//g, "").trim())) continue;
    for (const decl of block[2].matchAll(/--([\w-]+):\s*([^;]+);/g))
      vars.set(decl[1], decl[2].trim());
  }
  return vars;
}

const base = readVars(/^:root$/);
const dark = new Map([...base, ...readVars(/^\.dark$/)]);

function resolve(vars: Map<string, string>, name: string): string {
  let value = vars.get(name);
  for (let i = 0; value?.startsWith("var(") && i < 10; i++) value = vars.get(value.slice(6, -1));
  if (!value?.startsWith("#")) throw new Error(`Cannot resolve --${name}`);
  return value.slice(0, 7);
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const BACKGROUNDS = ["canvas", "surface", "raised", "zebra"];
const TEXT = [
  "ink",
  "ink-soft",
  "ink-muted",
  "peach-ink",
  "butter-ink",
  "mint-ink",
  "sky-ink",
  "lilac-ink",
  "rose-ink",
  "added-ink",
  "edited-ink",
];

describe.each([
  ["light", base],
  ["dark", dark],
] as const)("%s theme", (_, vars) => {
  test.each(TEXT)("--%s reads at 4.5:1 on every background", (text) => {
    for (const bg of BACKGROUNDS) {
      expect(contrast(resolve(vars, text), resolve(vars, bg))).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("on-accent text reads on every solid pastel", () => {
    for (const accent of ["peach", "butter", "mint", "sky", "lilac", "rose"]) {
      expect(contrast(resolve(vars, "on-accent"), resolve(vars, accent))).toBeGreaterThanOrEqual(7);
    }
  });

  test.each(["annotate-stroke", "scrollbar-thumb", "scrollbar-thumb-hover"])(
    "--%s is visible (3:1 for graphics) on every background",
    (graphic) => {
      for (const bg of BACKGROUNDS) {
        expect(contrast(resolve(vars, graphic), resolve(vars, bg))).toBeGreaterThanOrEqual(3);
      }
    },
  );
});
