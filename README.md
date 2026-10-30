# Sequill

An offline SQLite browser and editor that runs entirely in the browser. The official
[SQLite WASM](https://sqlite.org/wasm/doc/trunk/index.md) build runs in a Web Worker and stores
databases in the Origin Private File System (OPFS), so nothing is uploaded and everything keeps
working without a network. A landing page at `/` showcases the features, the editor lives at `/app`,
and a schema visualizer and designer at `/vis`.

## Features

- **Databases**: open `.sqlite` / `.db` files (picker or drag and drop), create empty ones or a sample
  shop, rename, delete, download the file or a SQL dump. Databases persist across reloads.
- **Table grid**: virtualised rows, paging through SQLite, multi-column sort, global search, a filter
  builder (15 conditions, AND/OR), resizable, reorderable, hideable and pinnable columns, density
  toggle, layouts remembered per table.
- **Editing**: inline cell edits (double-click, Enter, or just type), paste blocks from spreadsheets,
  set NULL, a row inspector for full rows, BLOB upload/preview/download, JSON formatting, add,
  duplicate and delete rows (including "all matching rows"), foreign-key navigation.
- **SQL console**: CodeMirror with SQLite highlighting and schema autocomplete, Ctrl/Cmd+Enter to run
  the script or selection, one result per statement, EXPLAIN QUERY PLAN mode, history and saved queries.
- **Schema**: create tables (column builder, keys, defaults, references, STRICT, WITHOUT ROWID), add,
  rename and drop columns, rename and drop tables, create and drop indexes. Every change previews its SQL.
- **Schema visualizer (`/vis`)**: any database drawn as an ER diagram (tables, views, keys, foreign-key
  lines) with a searchable outline of every table's columns and types, auto-arrange, zoom, minimap and a
  focus mode for one table's relations. Lines pick the sides of the cards that face each other as you
  move tables around, and each table can have its own color (six presets or any custom color).
  Design visually:
  add tables and columns and drag between columns to create foreign keys. The outline is also the
  editor: add, edit, rename and delete columns, rename, delete and restore tables. Changes that SQLite
  can't make in place (type, constraints, a new foreign key on an existing column) rebuild the table and
  keep its rows, indexes, triggers and views. Pending changes show in color: green for added, blue for
  edited, rose and struck through for deleted. Nothing touches a database until you save: clicking the
  header's **Unsaved** badge applies everything to the open database in one transaction (foreign keys are
  checked before it commits; anything that would lose a rule first shows the SQL), and its menu can
  review the SQL first, **save as a new database** (a copy with the schema plus your changes, optionally
  with the rows, leaving the original as it is), download the SQL or discard the changes.
  Unsaved designs, layouts and colors are remembered per database. Both pages share one database
  menu (the same databases and actions); a database with an unsaved design is tagged "draft", and
  leaving the schema page with unsaved changes asks whether to keep them as a draft or discard them.
- **Import / export**: CSV, TSV and JSON import into new or existing tables with type detection and
  column mapping (one transaction, all-or-nothing); export tables, filtered views, selections or query
  results as CSV, JSON or SQL INSERTs.
- **App shell**: tabs, Ctrl/Cmd+K command palette, light and dark themes (dark by default), phone-friendly layout,
  installable PWA that loads offline after the first visit.

## Stack

Next.js 16 (App Router, static export) · Bun · TypeScript · Tailwind CSS 4 · shadcn/ui (Radix) ·
Motion (`motion/react`, lazy-loaded) · TanStack Query and Virtual · Zustand · CodeMirror 6 · PapaParse ·
React Flow (`@xyflow/react`) and dagre for the schema diagram ·
Comlink · Serwist (`@serwist/next`, configurator mode) · Changesets · ESLint + Prettier · Bun test + Playwright.

## Getting started

```bash
bun install
bun run dev
```

Open http://localhost:3000. `bun install` (postinstall) and `bun run dev` copy the SQLite runtime
into `public/sqlite/` (see `scripts/copy-sqlite-wasm.ts`).

## Scripts

| Script                     | What it does                                                         |
| -------------------------- | -------------------------------------------------------------------- |
| `bun run dev`              | Development server (Turbopack). No service worker in dev.            |
| `bun run build`            | Static export to `out/`, including the service worker (`out/sw.js`). |
| `bun run start`            | Serves `out/` like a static host.                                    |
| `bun run typecheck`        | TypeScript for the app and the service worker.                       |
| `bun run lint`             | ESLint (Next.js rules, Prettier-compatible).                         |
| `bun run format`           | Prettier (with Tailwind class sorting); `format:check` to verify.    |
| `bun run test`             | Unit and integration tests (`bun test`, SQLite in memory).           |
| `bun run test:e2e`         | Playwright against the production build. Run `bun run build` first.  |
| `bun run analyze`          | Next.js bundle analyzer (Turbopack).                                 |
| `bun run icons`            | Regenerates every icon from the logo in `src/lib/logo.ts`.           |
| `bun run changeset`        | Describe a change for the changelog.                                 |
| `bun run version-packages` | Apply changesets: bump the version and update `CHANGELOG.md`.        |

End-to-end tests (and `scripts/capture-landing.ts`) run in the installed Brave browser. If Brave is
not at `C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe`, set `BRAVE_PATH`.

## How it works

```
src/
  app/                 routes: landing (/), editor (/app), schema visualizer (/vis), manifest, icon;
                       globals.css holds the Pastel Noir tokens (dark as designed, derived light theme)
  components/
    providers.tsx      app-wide providers used by the root layout
    landing/           landing page (/) sections
    app/               editor (/app): sidebar, tabs, grid, table view, console, command palette
    vis/               schema visualizer (/vis): table cards, canvas, outline, inspector, save flow
    common/            shared by more than one page: boot screen, database switcher, dialogs,
                       logo, theme toggle, PWA install, change marks
      pastel/          design-system components (chip, annotation marks, loader, stat, steps…)
    ui/                shadcn/ui primitives mapped onto the design tokens
  lib/
    sqlite/            worker (OPFS + catalog), session, SQL/DDL builders, introspection, dump
    data/              formatting, import inference, export, grid layout helpers
    vis/               diagram model, draft design rules and SQL, auto-layout
    store/             Zustand stores (workspace tabs, dialogs)
  sw/sw.ts             service worker source (Serwist precache), built by serwist.config.mjs
```

- **SQLite in a worker.** `lib/sqlite/worker.ts` loads the runtime from `public/sqlite/` (bundling it
  breaks because the package spawns its own workers), installs the `opfs-sahpool` VFS and exposes a
  typed API through Comlink. A small catalog database maps file ids to names and sizes. SAHPool needs no
  COOP/COEP headers, so the app works on any static host.
- **Safety.** Values are always bound parameters. Table and column names are checked against the
  introspected schema and quoted by one helper (`quoteIdent`). Destructive actions show their SQL first.
- **Loading.** The landing page ships none of the editor code. `/app` and `/vis` show a staged boot loader
  (engine → storage → interface) while the editor UI downloads in parallel; CodeMirror, the CSV parser,
  schema dialogs and the command palette load on first use. Motion features load after first paint.
- **Offline.** After `next build`, `serwist build` (Serwist's Next.js configurator mode, set up in
  `serwist.config.mjs`) bundles `src/sw/sw.ts` into the export as `out/sw.js`. It precaches every
  chunk, style and font, the SQLite runtime, the icons, the manifest and the three pages.
  `SerwistProvider` in `components/providers.tsx` registers it in production builds.
- **Landing pictures.** The screenshots and the clip in `public/landing/` are captured from the real app
  with the sample shop open. Regenerate them against a running app with `node scripts/capture-landing.ts`
  (Node, not Bun: Bun can't drive Playwright's browser on Windows). The file reader on the landing page
  parses the SQLite header and schema itself (`src/lib/sqlite/file-header.ts`), so it loads no engine.

## Logo

The Sequill mark is a pen nib whose top is stacked database disks (sequel and quill), in peach,
butter and mint on the near-black ground. It is drawn in code in `src/lib/logo.ts`; the `<Logo>`
component renders it in the app, and `bun run icons` writes `public/logo.svg`, the manifest PNGs in
`public/icons/`, `src/app/favicon.ico` (16–48px), `src/app/icon.ico` (16–256px) and
`src/app/apple-icon.png`. The same command draws the share image, `src/app/opengraph-image.png`
(1200×630: one short line and the logo above the pastel block wordmark), with `next/og`; it fetches
DM Sans from Google Fonts while it runs.

Share previews need the site's full address, worked out at build time by `src/lib/site-url.ts`. On
Vercel nothing needs setting: production builds use the project's production domain (your custom
domain once one is added) and preview builds use their own address. On any other host set
`NEXT_PUBLIC_SITE_URL` (for example `https://sequill.example`) when building, or the preview image
points at `localhost`; set on Vercel, it overrides the automatic address. Sizes of 32px and
under use a simpler drawing (one disk and the nib) so the shape stays clear in a browser tab.

## Design system

The UI follows the Pastel Noir system: a grayscale ladder for structure, six pastels for meaning
(never colour alone), DM Sans for UI, JetBrains Mono for code and keys, and Caveat only beside a
hand-drawn arrow. The system is dark-first; the light theme inverts the gray ladder and adds a deep
"-ink" shade per pastel for text. Sizes and radii are scaled down for UI: the video system's values are
sized for a 1920×1080 frame, so the web radii are 4/6/8/10/14px (`xs`…`xl`) plus a pill.
Two extra hues mark unsaved schema changes: `--added` (green) and `--edited` (blue), each with an
`-ink` and `-wash` like the pastels and brighter than mint and sky so they don't read as either.
Scrollbars are thin gray pills (`--scrollbar-thumb`) that appear only while their scroll area is
hovered or focused; touch devices keep the browser's overlay scrollbars.
`src/app/globals.test.ts` checks WCAG contrast for every text and background pair in both themes.

## Limitations

- One tab at a time: the OPFS pool is held exclusively by the tab that opened it. Other tabs show an
  error until it closes.
- Databases live in this browser's site storage. Clearing site data deletes them, so download copies of
  anything important. The app asks the browser for persistent storage to make eviction less likely.
- Very large databases are limited by the browser's storage quota and memory for exports.

## Releases

Changes are tracked with [Changesets](https://github.com/changesets/changesets): add one with
`bun run changeset`, and `bun run version-packages` bumps the version and writes `CHANGELOG.md`.
