/** Browser-side handle to the SQLite worker. Created lazily so pages that never need it stay light. */
import * as Comlink from "comlink";
import type { SqliteWorkerApi } from "./worker";
import type { BootProgress, StorageState } from "./types";

let remote: Comlink.Remote<SqliteWorkerApi> | null = null;
/** Rejects if the worker script itself fails to load or crashes (Comlink calls would hang forever). */
let crashed: Promise<never> | null = null;

export function getSqlite(): Comlink.Remote<SqliteWorkerApi> {
  if (typeof window === "undefined") throw new Error("SQLite runs only in the browser");
  if (!remote) {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), {
      type: "module",
      name: "sqlite",
    });
    crashed = new Promise<never>((_, reject) => {
      worker.addEventListener("error", (e) => {
        remote = null;
        reject(new Error(`The SQLite worker failed to start${e.message ? `: ${e.message}` : ""}`));
      });
    });
    crashed.catch(() => undefined); // observed by bootSqlite; avoid unhandled-rejection noise
    remote = Comlink.wrap<SqliteWorkerApi>(worker);
  }
  return remote;
}

/** Boots the engine and storage, reporting each stage. Returns the SQLite version. */
export function bootSqlite(onProgress: (p: BootProgress) => void): Promise<string> {
  const api = getSqlite();
  return Promise.race([api.init(Comlink.proxy(onProgress)), crashed!]);
}

/** Calls `listener` whenever this window gets or loses the database files; returns the current state. */
export function watchStorage(listener: (state: StorageState) => void): Promise<StorageState> {
  return getSqlite().watchStorage(Comlink.proxy(listener));
}
