import { describe, expect, test } from "bun:test";
import { filesFor, parseRelease, releaseNotes } from "./releases";

const asset = (name: string, size = 1000) => ({
  name,
  size,
  browser_download_url: `https://github.com/o/r/releases/download/v1.1.0/${name}`,
});

/** The shape of GitHub's /releases/latest answer, trimmed to what the page reads. */
const RELEASE = {
  tag_name: "v1.1.0",
  html_url: "https://github.com/o/r/releases/tag/v1.1.0",
  published_at: "2026-11-17T09:26:39Z",
  body: "\n### Minor Changes\n\n- f969eda: Editor tabs get a `right-click` menu.\n\n",
  assets: [
    asset("Sequill-1.1.0-1.x86_64.rpm"),
    asset("Sequill_1.1.0_aarch64.dmg"),
    asset("Sequill_1.1.0_amd64.AppImage"),
    asset("Sequill_1.1.0_amd64.deb"),
    asset("Sequill_1.1.0_x64-setup.exe", 5624680),
    asset("Sequill_1.1.0_x64.dmg"),
    asset("Sequill_1.1.0_x64_en-US.msi"),
    asset("Sequill_aarch64.app.tar.gz"),
    asset("Sequill_x64.app.tar.gz"),
  ],
};

describe("parseRelease", () => {
  test("keeps the version, date, notes and the installable files in display order", () => {
    const release = parseRelease(RELEASE);
    expect(release.version).toBe("1.1.0");
    expect(release.publishedAt).toBe("2026-11-17T09:26:39Z");
    expect(release.notes).toEqual([
      { title: "Minor Changes", items: ["Editor tabs get a right-click menu."] },
    ]);
    expect(release.files.map((f) => f.name)).toEqual([
      "Sequill_1.1.0_x64-setup.exe",
      "Sequill_1.1.0_x64_en-US.msi",
      "Sequill_1.1.0_aarch64.dmg",
      "Sequill_1.1.0_x64.dmg",
      "Sequill_1.1.0_amd64.AppImage",
      "Sequill_1.1.0_amd64.deb",
      "Sequill-1.1.0-1.x86_64.rpm",
    ]);
    expect(release.files[0]).toMatchObject({ os: "windows", label: "Installer", size: 5624680 });
  });

  test("skips malformed assets and offers nothing for a release without installers", () => {
    const release = parseRelease({ ...RELEASE, assets: [{ name: "x.exe" }, asset("notes.txt")] });
    expect(release.files).toEqual([]);
  });

  test("rejects a response that is not a release", () => {
    expect(() => parseRelease({ message: "API rate limit exceeded" })).toThrow();
    expect(() => parseRelease(null)).toThrow();
  });
});

describe("releaseNotes", () => {
  test("joins continued lines and strips hashes and inline Markdown", () => {
    const body = [
      "### Patch Changes",
      "- 1a2b3c4: Fixes **paging** in",
      "  the [grid](https://x.y).",
      "* Second item",
      "### Empty",
      "",
    ].join("\r\n");
    expect(releaseNotes(body)).toEqual([
      { title: "Patch Changes", items: ["Fixes paging in the grid.", "Second item"] },
    ]);
  });

  test("keeps a plain paragraph under an untitled group", () => {
    expect(releaseNotes("Just a fix.")).toEqual([{ title: "", items: ["Just a fix."] }]);
  });

  test("an empty body has no notes", () => {
    expect(releaseNotes("")).toEqual([]);
  });
});

describe("filesFor", () => {
  test("returns the recommended file first and the others after it", () => {
    const { main, others } = filesFor(parseRelease(RELEASE).files, "mac");
    expect(main?.label).toBe("Apple silicon");
    expect(others.map((f) => f.label)).toEqual(["Intel"]);
  });

  test("has no main file for a system the release doesn't cover", () => {
    expect(filesFor([], "linux").main).toBeUndefined();
  });
});
