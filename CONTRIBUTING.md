# Contributing to Sequill

Thanks for wanting to help. Bug reports, ideas, docs fixes and code are all welcome, whether it's a
typo or a new feature. This guide covers how to get the project running and what a change needs
before it's merged.

This repository is the web app (the site, the editor at `/app` and the schema designer at `/vis`).
For the Windows, macOS and Linux app and its MCP server, go to
[sequill-desktop](https://github.com/adixoo/sequill-desktop).

## Reporting a bug

Search the [issues](https://github.com/adixoo/sequill/issues) first; if it's already there, add what
you know to it. Otherwise open a new one with:

- what you did, what you expected, and what happened instead;
- your browser and its version, and your operating system;
- any errors from the browser's console;
- if a particular database triggers it, a small file that shows the problem. Your databases never
  leave your browser while you use Sequill, so make sure anything you attach holds no private data.

## Suggesting a change

For a small fix, open a pull request straight away. For anything bigger (a new feature, a change to
how something works or looks, a new dependency), open an issue first and describe what you'd like to
do, so we can agree on the approach before you spend time on it.

## Setting up

You need [Bun](https://bun.sh) 1.2 or newer and Git. The end-to-end tests also need the
[Brave](https://brave.com) browser.

```bash
git clone https://github.com/<your-username>/sequill.git
cd sequill
bun install
bun run dev
```

Fork the repository first, then clone your fork. Open http://localhost:3000. `bun install` copies the
SQLite runtime into `public/sqlite/`. The [README](README.md#scripts) lists every script, and
[How it works](README.md#how-it-works) explains where the code lives;
[`code-structure.html`](code-structure.html) is a fuller map of the repository.

There is no service worker in development. To try the production build (offline mode included), run
`bun run build` and then `bun run start`, which serves it at http://localhost:3001.

## Making a change

1. Create a branch from `master`, named for the change: `fix/grid-paste-newlines`,
   `feat/export-markdown`.
2. Keep each pull request to one change. A refactor and a new feature go in separate pull requests.
3. Follow the code around you: the same naming, file layout and comment style.

What we look for in a change:

- **Reuse first.** Before writing a helper, component or hook, check whether one exists: `src/lib/`,
  `src/components/common/` (and `common/pastel/` for the design system's pieces) and
  `src/components/ui/`. Extend what's there rather than adding a near-copy.
- **Safe SQL.** Values are always bound parameters, never pasted into SQL. Table and column names go
  through `quoteIdent`. Anything that deletes or rewrites data shows its SQL first.
- **The design system.** Colours, radii, type and motion come from the tokens in
  `src/app/globals.css` (see [Design system](README.md#design-system)); no hard-coded colours. Icons
  come from the free [Hugeicons](https://hugeicons.com) set (`@hugeicons/core-free-icons`), drawn with
  `Icon` from `src/components/ui/icon.tsx`. Check your change in both the dark and the light theme, at
  phone width as well as on a desktop.
- **Accessible.** Real buttons and links, everything reachable by keyboard with a visible focus, alt
  text on pictures, and nothing that relies on colour alone. Animations stop for
  `prefers-reduced-motion`.
- **Light pages.** The landing page ships none of the editor's code, and heavy parts of the editor
  load when first used. Keep it that way; `bun run analyze` shows what ends up in each bundle.
- **Dependencies.** Ask in an issue before adding one. A few lines of code, or a package already in
  `package.json`, is usually the better choice.

## Tests

- **Unit tests** sit next to the code they test as `*.test.ts` and run with `bun run test`. They use
  SQLite in memory, so they're fast; add one for any logic you write or change.
- **End-to-end tests** live in `e2e/` and run with Playwright in Brave, against the production build:
  run `bun run build` first, then `bun run test:e2e`. If Brave isn't installed in the usual place, set
  `BRAVE_PATH` to its executable. Add one when you change something a visitor can see or do.
- **Fixing a bug?** Start with a test that fails because of it, then make it pass.

## Before you open a pull request

Run these and make sure they all pass:

```bash
bun run typecheck
bun run lint
bun run format:check
bun run test
bun run build
bun run test:e2e
```

`bun run format` fixes formatting for you.

If your change is something a user will notice, add a changeset:

```bash
bun run changeset
```

Pick **patch** for a fix and **minor** for a new feature, and write one or two sentences for the
changelog in plain words, about what changes for the person using the app (see
[CHANGELOG.md](CHANGELOG.md) for examples). Commit the new file in `.changeset/` with your change.
Versions and releases are handled by the maintainer.

## Commits and pull requests

Commit messages follow [Conventional Commits](https://www.conventionalcommits.org):
`type(scope): subject`, with an imperative subject of 72 characters or fewer and no full stop.

```text
fix(grid): keep newlines when pasting cells from a spreadsheet
feat(export): export a table as Markdown
```

Types: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`, `build`, `ci`. Add a body when the
reason for a change isn't obvious from the diff.

In the pull request, describe what changed, why, and how you tested it, and link the issue it closes.
For anything visible, add screenshots (both themes if colours changed). Point out anything you'd like
a reviewer to look at closely.

## Questions

Not sure where to start, or whether something is worth doing? Open an issue and ask.
