import type { DesktopOs } from "@/lib/releases";

/** The visitor's system as far as the download page cares: a desktop one, or a phone or tablet. */
export type DeviceOs = DesktopOs | "mobile";

/**
 * Guesses the system from the browser's user agent and platform strings. iPads
 * report themselves as Macs, so a Mac with a touch screen counts as mobile.
 * Returns null when nothing matches.
 */
export function detectOs(userAgent: string, platform = "", maxTouchPoints = 0): DeviceOs | null {
  const ua = `${userAgent} ${platform}`;
  if (/android|iphone|ipad|ipod|mobile/i.test(ua)) return "mobile";
  if (/mac/i.test(ua)) return maxTouchPoints > 1 ? "mobile" : "mac";
  if (/win/i.test(ua)) return "windows";
  if (/linux|x11|cros/i.test(ua)) return /cros/i.test(ua) ? null : "linux";
  return null;
}
