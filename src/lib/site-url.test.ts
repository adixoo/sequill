import { describe, expect, test } from "bun:test";
import { resolveSiteUrl } from "./site-url";

const href = (env: Parameters<typeof resolveSiteUrl>[0]) => resolveSiteUrl(env)?.href;

describe("resolveSiteUrl", () => {
  test("an explicit NEXT_PUBLIC_SITE_URL wins everywhere", () => {
    expect(
      href({
        NEXT_PUBLIC_SITE_URL: "https://sequill.adibitz.com",
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "sequill.vercel.app",
      }),
    ).toBe("https://sequill.adibitz.com/");
    expect(href({ NEXT_PUBLIC_SITE_URL: "sequill.adibitz.com" })).toBe(
      "https://sequill.adibitz.com/",
    );
  });

  test("a Vercel production build uses the production domain", () => {
    expect(
      href({
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "sequill.vercel.app",
        VERCEL_URL: "sequill-abc123.vercel.app",
      }),
    ).toBe("https://sequill.vercel.app/");
  });

  test("a Vercel preview build uses its branch address, then its deployment address", () => {
    const preview = { VERCEL_ENV: "preview", VERCEL_URL: "sequill-abc123.vercel.app" };
    expect(href({ ...preview, VERCEL_BRANCH_URL: "sequill-git-new-logo.vercel.app" })).toBe(
      "https://sequill-git-new-logo.vercel.app/",
    );
    expect(href(preview)).toBe("https://sequill-abc123.vercel.app/");
  });

  test("a local build has no site URL", () => {
    expect(resolveSiteUrl({})).toBeUndefined();
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "  " })).toBeUndefined();
  });
});
