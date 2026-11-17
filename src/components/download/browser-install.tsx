import { Shot, Tile } from "@/components/landing/tile";
import { InstallTile } from "./install-tile";

/** Where each browser keeps its install command. */
const BROWSERS: [string, string][] = [
  ["Chrome, Edge, Brave", "The install icon at the right end of the address bar."],
  ["Safari on a Mac", "File, then Add to Dock."],
  ["Safari on iPhone and iPad", "Share, then Add to Home Screen."],
  ["Chrome on Android", "The menu, then Install app."],
];

/** The other way in: installing the web app, with a picture of it on a phone. */
export function BrowserInstall() {
  return (
    <section id="browser" aria-labelledby="browser-title" className="ln-board scroll-mt-2">
      <Tile
        tone="inverse"
        className="col-span-2 flex flex-col gap-8 lg:col-span-8 lg:p-10"
        data-reveal
      >
        <h2 id="browser-title" className="ln-heading">
          Or install it from the browser
        </h2>
        <p className="ln-statement max-w-[40ch] font-normal">
          Nothing to download. The browser keeps the app, opens it in its own window, and it works
          offline, on phones too.
        </p>
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {BROWSERS.map(([browser, how]) => (
            <div key={browser}>
              <dt className="font-semibold">{browser}</dt>
              <dd>{how}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-auto max-w-sm">
          <InstallTile />
        </div>
      </Tile>
      <Tile tone="picture" className="col-span-2 aspect-[4/5] lg:col-span-4 lg:aspect-auto">
        <Shot
          src="editor-phone.webp"
          alt="The editor installed on a phone, showing the sample shop’s customers table."
          position="center 18%"
        />
      </Tile>
    </section>
  );
}
