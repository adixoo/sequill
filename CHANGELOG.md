# sqlite-browser-editor

## 0.4.0

### Minor Changes

- 293242c: Sequill moves to the Pastel Quill design system. The dark theme is a neutral charcoal with no blue cast, with the working sheet a step darker than its frame; corners, borders and shadows are softer and thinner; and buttons, inputs and menus share one set of sizes. The schema designer uses a compact density and the editor follows the density you choose. The design is written up in DESIGN.md, with previews of the landing page, the editor and every component at `/test`.

## 0.3.4

### Patch Changes

- 86cbac2: The home page now covers the desktop app's MCP server in full: the first screen says your AI assistant can work in your databases from the desktop app, the desktop section has working copies of the app's two MCP switches that show which tools an assistant gets, it says changes need Allow changes and every call is kept in History, and a new FAQ answer explains it. The first screen's "Install app" tile reads "Desktop app and MCP", and the footer links to the section.

## 0.3.3

### Patch Changes

- e2ed547: The editor's sidebar header now reads "Sequill / Editor", like the schema designer's, and no longer shows an "Install app" button.
- 91eb0f5: The home page's first screen links to Sequill on GitHub, where you can star the project or contribute, in place of the "Try your own file" tile.
- 8a18140: With no database open, the editor offers "New empty" as the second choice, after opening a file, with "Try the sample" after it.

## 0.3.2

### Patch Changes

- ff6f017: Every icon in the app and on the site now comes from the free Hugeicons set, replacing Lucide.

## 0.3.1

### Patch Changes

- 8f642d5: The site footer links to the source code of both the web app and the desktop app on GitHub.
- 4a1e9e6: The home page now introduces the desktop app: large databases kept as real files on a native SQLite engine, and a built-in MCP server that lets AI assistants such as Claude, Cursor and VS Code work with your databases, with a link to the download page. The FAQ answer on database size mentions it too.
- d41797a: The home page moves more smoothly: FAQ answers slide open and shut instead of jumping, and the big tagline line speeds up as you scroll and turns round when you scroll back up. Both stay still for reduced motion.
- 1ebe441: An address that doesn't exist now shows a "Page not found" page in the site's own design, in your theme, with links back to the home page, the editor, the schema designer and the desktop download.

## 0.3.0

### Minor Changes

- f0b9f4d: A download page at /download for the desktop app: it offers the installer for your system, lists every Windows, macOS and Linux file of the latest release with its size, shows that release's notes, and explains installing the web app from the browser. The home page's "Install app" tile now opens it.

## 0.2.2

### Patch Changes

- The installed app and a browser tab no longer lock each other out. A window in the background lets go of your databases and takes them back when it's shown; opening the app in another window hands them over, and the window that let go offers "Use here". "Try again" on the loading error now really retries. The footer also links to more apps by adibitz.

## 0.2.1

### Patch Changes

- The "or drop a file anywhere" hint on the editor's welcome screen now has its arrow pointing up at "Open a .sqlite file", and handwritten notes no longer cut off their last letters. Touch screens no longer show the drop hint.

## 0.2.0

### Minor Changes

- b552847: First release: an offline SQLite browser and editor running SQLite WASM in the browser (OPFS storage), with a table grid, inline editing, SQL console, schema editor, CSV/JSON import and export, installable PWA, light and dark themes, and a landing page.

### Patch Changes

- Faster first load: the fonts now download only the weights the app uses (fonts preloaded on every page drop from 152 KB to 117 KB). The offline service worker is built with Serwist's Next.js integration and keeps the exported pages, chunks, fonts and the SQLite runtime cached, revisioning pages by their content so they are re-downloaded only when they change.
