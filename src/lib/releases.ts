/**
 * The desktop app's latest GitHub release, read at build time for the download
 * page. Parsing is pure (tested in releases.test.ts); `fetchLatestRelease` is
 * the one network call.
 */
import { DESKTOP_REPO } from "@/lib/constants";

export type DesktopOs = "windows" | "mac" | "linux";

/** Each system's name, in the order the page lists them. */
export const OS_NAMES: Record<DesktopOs, string> = {
  windows: "Windows",
  mac: "macOS",
  linux: "Linux",
};

/** A downloadable file of the release, for one system. */
export interface ReleaseFile {
  os: DesktopOs;
  /** What the file is, e.g. "Installer" or "Apple silicon". */
  label: string;
  /** Who it is for or what it is, e.g. "Debian, Ubuntu". */
  detail: string;
  name: string;
  size: number;
  url: string;
}

/** One group of the release notes, e.g. "Minor Changes" and its items. */
export interface NoteGroup {
  title: string;
  items: string[];
}

export interface DesktopRelease {
  /** The version without the tag's "v", e.g. "1.1.0". */
  version: string;
  /** ISO date-time the release was published. */
  publishedAt: string;
  url: string;
  notes: NoteGroup[];
  /** In the order of FILE_KINDS: each system's recommended file first. */
  files: ReleaseFile[];
}

/**
 * Which release assets the page offers, by file name, in display order. Each
 * system's first entry is the one the page recommends. Anything else (the
 * updater's .app.tar.gz bundles, signatures) is left to the GitHub page.
 */
const FILE_KINDS: { os: DesktopOs; test: RegExp; label: string; detail: string }[] = [
  { os: "windows", test: /-setup\.exe$/i, label: "Installer", detail: "64-bit, .exe" },
  { os: "windows", test: /\.msi$/i, label: "MSI package", detail: "64-bit, for managed installs" },
  {
    os: "mac",
    test: /(aarch64|arm64)\.dmg$/i,
    label: "Apple silicon",
    detail: "M1 and newer, .dmg",
  },
  { os: "mac", test: /(x64|x86_64|intel)\.dmg$/i, label: "Intel", detail: "Intel Macs, .dmg" },
  { os: "linux", test: /\.AppImage$/i, label: "AppImage", detail: "Runs on most distributions" },
  { os: "linux", test: /\.deb$/i, label: "Debian, Ubuntu", detail: ".deb package" },
  { os: "linux", test: /\.rpm$/i, label: "Fedora, openSUSE", detail: ".rpm package" },
];

interface GitHubAsset {
  name: string;
  size: number;
  browser_download_url: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isAsset = (value: unknown): value is GitHubAsset =>
  isRecord(value) &&
  typeof value.name === "string" &&
  typeof value.size === "number" &&
  typeof value.browser_download_url === "string";

/** Picks the offered files out of a release's assets, in FILE_KINDS order. */
export function releaseFiles(assets: readonly GitHubAsset[]): ReleaseFile[] {
  return FILE_KINDS.flatMap(({ test, ...kind }) => {
    const asset = assets.find((a) => test.test(a.name));
    return asset
      ? [{ ...kind, name: asset.name, size: asset.size, url: asset.browser_download_url }]
      : [];
  });
}

/** Inline Markdown the page shows as plain text: code ticks, bold and links. */
const plain = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*|__|`/g, "")
    .trim();

/**
 * Release notes as Changesets writes them: "### Group" headings over "- item"
 * lists, each item possibly prefixed by a commit hash ("f969eda: ") and
 * continued on indented lines.
 */
export function releaseNotes(body: string): NoteGroup[] {
  const groups: NoteGroup[] = [];
  let group: NoteGroup | null = null;
  let item: string | null = null;
  const flush = () => {
    if (item) (group ??= pushGroup("")).items.push(plain(item));
    item = null;
  };
  const pushGroup = (title: string) => {
    const next = { title, items: [] };
    groups.push(next);
    return next;
  };
  for (const line of body.split(/\r?\n/)) {
    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    const bullet = /^[-*]\s+(?:[0-9a-f]{7,40}:\s+)?(.*)$/.exec(line);
    if (heading) {
      flush();
      group = pushGroup(plain(heading[1]));
    } else if (bullet) {
      flush();
      item = bullet[1];
    } else if (item !== null && line.trim()) {
      item += ` ${line.trim()}`;
    } else if (line.trim()) {
      flush();
      item = line.trim();
    }
  }
  flush();
  return groups.filter((g) => g.items.length > 0);
}

/** Validates the GitHub API's release JSON and keeps what the page shows. */
export function parseRelease(json: unknown): DesktopRelease {
  if (
    !isRecord(json) ||
    typeof json.tag_name !== "string" ||
    typeof json.html_url !== "string" ||
    typeof json.published_at !== "string" ||
    !Array.isArray(json.assets)
  ) {
    throw new Error("Unexpected release response from GitHub");
  }
  return {
    version: json.tag_name.replace(/^v/i, ""),
    publishedAt: json.published_at,
    url: json.html_url,
    notes: releaseNotes(typeof json.body === "string" ? json.body : ""),
    files: releaseFiles(json.assets.filter(isAsset)),
  };
}

/** The first (recommended) file for a system, and its other files. */
export function filesFor(files: readonly ReleaseFile[], os: DesktopOs) {
  const [main, ...others] = files.filter((f) => f.os === os);
  return { main, others };
}

/**
 * The latest release, fetched once during `next build` (the page is static).
 * GITHUB_TOKEN, when set in the build environment, raises GitHub's rate limit;
 * it is read on the server only and never reaches the page. Returns null when
 * GitHub can't be reached, so the page links to the releases page instead of
 * failing the build.
 */
export async function fetchLatestRelease(
  env: Readonly<Record<string, string | undefined>> = process.env,
): Promise<DesktopRelease | null> {
  const token = env.GITHUB_TOKEN?.trim();
  try {
    const res = await fetch(DESKTOP_REPO.latestReleaseApi, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    if (!res.ok) throw new Error(`GitHub answered ${res.status} ${res.statusText}`);
    return parseRelease(await res.json());
  } catch (error) {
    console.warn(
      `[download] Could not read the latest desktop release; the page links to GitHub instead. ${String(error)}`,
    );
    return null;
  }
}
