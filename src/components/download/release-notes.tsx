import { Tile } from "@/components/landing/tile";
import { DESKTOP_REPO } from "@/lib/constants";
import type { DesktopRelease } from "@/lib/releases";

const LINK = "font-semibold underline underline-offset-4";

/** The release's own notes, with the links to it, every release and the source. */
export function ReleaseNotes({ release, date }: { release: DesktopRelease; date: string }) {
  return (
    <section id="whats-new" aria-labelledby="whats-new-title" className="ln-board scroll-mt-2">
      <Tile
        tone="raised"
        className="col-span-2 flex flex-col justify-between gap-6 lg:col-span-4"
        data-reveal
      >
        <h2 id="whats-new-title" className="ln-heading">
          New in {release.version}
        </h2>
        <p className="text-ink-soft">Released {date}</p>
      </Tile>
      <Tile className="col-span-2 flex flex-col gap-8 lg:col-span-8 lg:p-10" data-reveal>
        {release.notes.length === 0 ? (
          <p>This release has no notes.</p>
        ) : (
          release.notes.map((group) => (
            <div key={group.title} className="flex flex-col gap-3">
              {group.title && <h3 className="font-semibold">{group.title}</h3>}
              <ul className="flex flex-col gap-4">
                {group.items.map((item) => (
                  <li key={item} className="ln-text max-w-[60ch]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <a href={release.url} rel="noreferrer" target="_blank" className={LINK}>
            This release on GitHub
          </a>
          <a href={DESKTOP_REPO.allReleasesUrl} rel="noreferrer" target="_blank" className={LINK}>
            Every release
          </a>
          <a href={DESKTOP_REPO.url} rel="noreferrer" target="_blank" className={LINK}>
            Source code
          </a>
        </p>
      </Tile>
    </section>
  );
}
