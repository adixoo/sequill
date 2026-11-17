"use client";

import { Download01Icon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { useInstallPrompt } from "@/components/common/pwa";
import { Tile } from "@/components/landing/tile";
import { Icon } from "@/components/ui/icon";

/**
 * The download page's tile that installs the web app. Browsers without an install prompt (Safari,
 * Firefox) get a pointer to their own menu instead of a button that does nothing.
 */
export function InstallTile() {
  const { install, installed } = useInstallPrompt();
  const [hint, setHint] = useState(false);
  if (installed) {
    return (
      <Tile tone="raised" className="flex h-full min-h-16 items-center py-3">
        Installed on this device
      </Tile>
    );
  }
  return (
    <Tile
      as="button"
      type="button"
      className="ln-press flex h-full min-h-16 w-full items-center justify-between gap-3 py-3 text-left"
      aria-live="polite"
      onClick={() => (install ? void install() : setHint(true))}
    >
      <span className="leading-snug">
        {hint ? "Install from your browser’s menu" : "Install app"}
      </span>
      <Icon icon={Download01Icon} aria-hidden className="size-5 shrink-0" />
    </Tile>
  );
}
