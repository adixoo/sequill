"use client";

import { ArrowDown02Icon, Download01Icon } from "@hugeicons/core-free-icons";
import { useSyncExternalStore } from "react";
import { Tile } from "@/components/landing/tile";
import { Icon } from "@/components/ui/icon";
import { DESKTOP_REPO } from "@/lib/constants";
import { formatBytes } from "@/lib/data/format";
import { type DeviceOs, detectOs } from "@/lib/platform";
import { filesFor, OS_NAMES, type ReleaseFile } from "@/lib/releases";

const noSubscribe = () => () => {};
const readOs = () => detectOs(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);

interface Offer {
  href: string;
  title: string;
  detail: string;
  download: boolean;
  others: ReleaseFile[];
}

/** What the big tile offers this visitor: their system's file, the browser install, or the list. */
function offerFor(os: DeviceOs | null, files: readonly ReleaseFile[]): Offer {
  if (os === "mobile") {
    return {
      href: "#browser",
      title: "Install from the browser",
      detail: "The desktop app is for Windows, macOS and Linux",
      download: false,
      others: [],
    };
  }
  const { main, others } = os ? filesFor(files, os) : { main: undefined, others: [] };
  if (os && main) {
    return {
      href: main.url,
      title: `Download for ${OS_NAMES[os]}`,
      detail: `${main.label}, ${formatBytes(main.size)}`,
      download: true,
      others,
    };
  }
  if (files.length === 0) {
    return {
      href: DESKTOP_REPO.releasesUrl,
      title: "Download from GitHub",
      detail: "Installers for Windows, macOS and Linux",
      download: true,
      others: [],
    };
  }
  return {
    href: "#platforms",
    title: "Choose your system",
    detail: "Windows, macOS and Linux",
    download: false,
    others: [],
  };
}

/**
 * The first screen's download: the installer for the visitor's system, found
 * from the browser after load. The static page (and a visitor without script)
 * gets the jump to every system instead.
 */
export function PrimaryDownload({ files }: { files: ReleaseFile[] }) {
  const os = useSyncExternalStore(noSubscribe, readOs, () => null);
  const offer = offerFor(os, files);
  const icon = offer.download ? Download01Icon : ArrowDown02Icon;
  return (
    <div className="flex flex-1 flex-col gap-(--ln-gap)">
      <Tile
        as="a"
        href={offer.href}
        tone="mint"
        className="ln-press group flex min-h-48 flex-1 flex-col justify-between gap-8"
      >
        <Icon
          icon={icon}
          aria-hidden
          className="size-10 transition-transform duration-200 group-hover:translate-y-1"
        />
        <span className="flex flex-col gap-2">
          <span className="ln-heading">{offer.title}</span>
          <span className="font-medium">{offer.detail}</span>
        </span>
      </Tile>
      <Tile tone="raised" className="flex flex-wrap gap-x-6 gap-y-2 py-4">
        {offer.others.map((file) => (
          <a key={file.name} href={file.url} className="font-semibold underline underline-offset-4">
            {file.label}, {formatBytes(file.size)}
          </a>
        ))}
        {offer.href !== "#platforms" && (
          <a href="#platforms" className="font-semibold underline underline-offset-4">
            Every system
          </a>
        )}
        {offer.href !== "#browser" && (
          <a href="#browser" className="font-semibold underline underline-offset-4">
            Install from the browser
          </a>
        )}
      </Tile>
    </div>
  );
}
