# sqlite-browser-editor

## 0.2.0

### Minor Changes

- b552847: First release: an offline SQLite browser and editor running SQLite WASM in the browser (OPFS storage), with a table grid, inline editing, SQL console, schema editor, CSV/JSON import and export, installable PWA, light and dark themes, and a landing page.

### Patch Changes

- Faster first load: the fonts now download only the weights the app uses (fonts preloaded on every page drop from 152 KB to 117 KB). The offline service worker is built with Serwist's Next.js integration and keeps the exported pages, chunks, fonts and the SQLite runtime cached, revisioning pages by their content so they are re-downloaded only when they change.
