import { Download } from "lucide-react";
import { type TileTone, Tile } from "@/components/landing/tile";
import { DESKTOP_REPO } from "@/lib/constants";
import { formatBytes } from "@/lib/data/format";
import { type DesktopOs, OS_NAMES, type ReleaseFile } from "@/lib/releases";
import { cn } from "@/lib/utils";

const OS_TONES: Record<DesktopOs, TileTone> = { windows: "sky", mac: "butter", linux: "peach" };

/**
 * Every system's files, one row each: the system's name as a large coloured
 * tile beside its files. Rows alternate sides so neighbours don't repeat.
 */
export function Platforms({ files }: { files: ReleaseFile[] }) {
  const systems = (Object.keys(OS_NAMES) as DesktopOs[]).filter((os) =>
    files.some((f) => f.os === os),
  );
  return (
    <section id="platforms" aria-label="Every system" className="flex scroll-mt-2 flex-col">
      {systems.length === 0 ? (
        <div className="ln-board">
          <Tile
            as="a"
            href={DESKTOP_REPO.releasesUrl}
            tone="sky"
            className="ln-press col-span-2 flex min-h-48 flex-col justify-end gap-2 lg:col-span-12"
          >
            <h2 className="ln-heading">The installers are on GitHub</h2>
            <span className="font-medium">Windows, macOS and Linux, from the latest release</span>
          </Tile>
        </div>
      ) : (
        systems.map((os, i) => (
          <PlatformRow
            key={os}
            os={os}
            files={files.filter((f) => f.os === os)}
            flip={i % 2 === 1}
          />
        ))
      )}
    </section>
  );
}

function PlatformRow({ os, files, flip }: { os: DesktopOs; files: ReleaseFile[]; flip: boolean }) {
  return (
    <div id={os} className="ln-board scroll-mt-2" data-reveal>
      <Tile
        tone={OS_TONES[os]}
        className={cn(
          "col-span-2 flex min-h-40 items-end lg:col-span-5 lg:min-h-72",
          flip && "lg:order-2",
        )}
      >
        <h2 className="ln-display">{OS_NAMES[os]}</h2>
      </Tile>
      <ul className="col-span-2 flex flex-col gap-(--ln-gap) lg:col-span-7">
        {files.map((file, i) => (
          <li key={file.name} className="flex flex-1">
            <Tile
              as="a"
              href={file.url}
              tone={i === 0 ? "raised" : "surface"}
              className="ln-press group flex min-h-24 flex-1 items-center justify-between gap-6"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="ln-statement font-semibold">{file.label}</span>
                <span className="text-ink-soft">
                  {file.detail}
                  <span className="sr-only">, {file.name}</span>
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3 font-semibold">
                <span className="pn-tnum">{formatBytes(file.size)}</span>
                <Download
                  aria-hidden
                  className="size-5 transition-transform duration-200 group-hover:translate-y-0.5"
                />
              </span>
            </Tile>
          </li>
        ))}
      </ul>
    </div>
  );
}
