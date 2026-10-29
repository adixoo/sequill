/// <reference lib="webworker" />
/**
 * Service worker: precaches the whole static export (pages, chunks, fonts and
 * the SQLite runtime) so the app opens with no network after the first visit.
 * Bundled and given its precache list by scripts/build-sw.ts after `next build`.
 */
import { Serwist, type PrecacheEntry, type SerwistGlobalConfig, type SerwistPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/**
 * Turbopack's worker bootstrap reads its config from the URL fragment
 * (`turbopack-worker-*.js#params=…`). A worker served straight from the cache
 * takes the cached response's URL, which has no fragment, and fails to start.
 * Re-wrapping the body as a fresh Response makes the browser fall back to the
 * request URL, fragment included.
 */
const keepWorkerUrlFragment: SerwistPlugin = {
  handlerWillRespond: async ({ request, response }) => {
    if (!new URL(request.url).pathname.includes("/turbopack-worker-")) return response;
    return new Response(await response.blob(), {
      status: response.status,
      headers: response.headers,
    });
  },
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    // "/app" is served from "app.html"; RSC requests carry a cache-busting param.
    cleanURLs: true,
    ignoreURLParametersMatching: [/^_rsc$/, /^utm_/],
    plugins: [keepWorkerUrlFragment],
  },
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: false,
});

serwist.addEventListeners();
