import { describe, expect, test } from "bun:test";
import { detectOs } from "./platform";

describe("detectOs", () => {
  test.each([
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36", "Win32", 0, "windows"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15", "MacIntel", 0, "mac"],
    [
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15",
      "MacIntel",
      5,
      "mobile",
    ],
    ["Mozilla/5.0 (X11; Linux x86_64) Gecko/20100101 Firefox/140.0", "Linux x86_64", 0, "linux"],
    ["Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile Safari/537.36", "Linux armv8l", 5, "mobile"],
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)", "iPhone", 5, "mobile"],
    ["Mozilla/5.0 (X11; CrOS x86_64 14541.0.0)", "Linux x86_64", 0, null],
    ["", "", 0, null],
  ] as const)("%s → %s", (ua, platform, touch, os) => {
    expect(detectOs(ua, platform, touch)).toBe(os);
  });
});
