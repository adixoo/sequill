"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { useInstallPrompt } from "@/components/pwa";
import { Tile } from "./tile";

/**
 * Hero tile that installs the app. Browsers without an install prompt (Safari,
 * Firefox) get a pointer to their own menu instead of a button that does nothing.
 */
export function InstallTile() {
  const { install, installed } = useInstallPrompt();
  const [hint, setHint] = useState(false);
  if (installed) {
    return (
      <Tile tone="raised" className="flex min-h-16 items-start lg:h-16">
        Installed on this device
      </Tile>
    );
  }
  return (
    <Tile
      as="button"
      type="button"
      className="ln-press flex min-h-16 w-full items-start justify-between gap-3 text-left lg:h-16"
      aria-live="polite"
      onClick={() => (install ? void install() : setHint(true))}
    >
      <span className="leading-snug">
        {hint ? "Install from your browser’s menu" : "Install app"}
      </span>
      <Download aria-hidden className="mt-0.5 size-5 shrink-0" />
    </Tile>
  );
}
