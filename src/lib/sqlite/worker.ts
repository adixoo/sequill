/// <reference lib="webworker" />
/**
 * Dedicated worker that owns SQLite. Databases live in OPFS through the
 * opfs-sahpool VFS; a small catalog database keeps their display names.
 */
import type { Database, SAHPoolUtil, Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import * as Comlink from "comlink";
import {
  CATALOG_PATH,
  DB_FILE_PREFIX,
  DB_FILE_SUFFIX,
  VFS_DIRECTORY,
  VFS_MIN_CAPACITY,
  VFS_NAME,
  VFS_SLOTS_PER_DB,
  SQLITE_RUNTIME_URL,
} from "@/lib/constants";
import { SqliteSession } from "./session";
import type { BootProgress, CellValue, DbInfo, Schema, SqlStatement } from "./types";

interface Engine {
  sqlite3: Sqlite3Static;
  pool: SAHPoolUtil;
  catalog: SqliteSession;
}

let engine: Promise<Engine> | null = null;
let current: { id: string; session: SqliteSession } | null = null;

const filePath = (id: string) => `${DB_FILE_PREFIX}${id}${DB_FILE_SUFFIX}`;
const idFromPath = (path: string) =>
  path.startsWith(DB_FILE_PREFIX) && path.endsWith(DB_FILE_SUFFIX)
    ? path.slice(DB_FILE_PREFIX.length, -DB_FILE_SUFFIX.length)
    : null;

async function boot(onProgress?: (p: BootProgress) => void): Promise<Engine> {
  onProgress?.({ stage: "engine", message: "Loading SQLite engine" });
  // Loaded at runtime from public/ (see scripts/copy-sqlite-wasm.ts); bundling it breaks.
  const runtime: { default: () => Promise<Sqlite3Static> } = await import(
    /* webpackIgnore: true */ /* turbopackIgnore: true */ SQLITE_RUNTIME_URL
  );
  const sqlite3 = await runtime.default();
  onProgress?.({ stage: "storage", message: "Opening browser storage" });
  let pool: SAHPoolUtil;
  try {
    pool = await sqlite3.installOpfsSAHPoolVfs({
      name: VFS_NAME,
      directory: VFS_DIRECTORY,
      initialCapacity: VFS_MIN_CAPACITY,
      preserveOnInitFailure: true,
    });
  } catch (error) {
    throw new Error(
      "Browser storage is busy or unavailable. Close other tabs running this app, or check that " +
        "this browser supports the Origin Private File System. " +
        `(${error instanceof Error ? error.message : String(error)})`,
    );
  }
  const catalogDb: Database = new pool.OpfsSAHPoolDb(CATALOG_PATH);
  const catalog = new SqliteSession(sqlite3, catalogDb);
  catalog.query(
    `CREATE TABLE IF NOT EXISTS databases (
       id TEXT PRIMARY KEY, name TEXT NOT NULL, size INTEGER NOT NULL DEFAULT 0,
       created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
  );
  reconcile(pool, catalog);
  return { sqlite3, pool, catalog };
}

/** Keeps the catalog and the pool in sync after crashes or interrupted imports. */
function reconcile(pool: SAHPoolUtil, catalog: SqliteSession): void {
  const files = new Set(
    pool
      .getFileNames()
      .map(idFromPath)
      .filter((id): id is string => !!id),
  );
  const known = new Set(catalog.objects("SELECT id FROM databases").map((r) => String(r.id)));
  const now = Date.now();
  for (const id of files) {
    if (!known.has(id)) {
      catalog.query(
        "INSERT INTO databases (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)",
        [id, `Recovered ${id.slice(0, 8)}`, now, now],
      );
    }
  }
  for (const id of known) {
    if (!files.has(id)) catalog.query("DELETE FROM databases WHERE id = ?", [id]);
  }
}

function getEngine(): Promise<Engine> {
  if (!engine) {
    engine = boot().catch((error) => {
      engine = null;
      throw error;
    });
  }
  return engine;
}

function toInfo(row: Record<string, CellValue>): DbInfo {
  return {
    id: String(row.id),
    name: String(row.name),
    sizeBytes: Number(row.size),
    createdAt: Number(row.created_at),
    updatedAt: Number(row.updated_at),
  };
}

async function getInfo(id: string): Promise<DbInfo> {
  const { catalog } = await getEngine();
  const row = catalog.objects("SELECT * FROM databases WHERE id = ?", [id])[0];
  if (!row) throw new Error("That database no longer exists");
  return toInfo(row);
}

async function reserveSlotForOneMore(): Promise<void> {
  const { pool } = await getEngine();
  const dbCount = pool.getFileNames().filter((n) => idFromPath(n)).length;
  await pool.reserveMinimumCapacity(
    Math.max(VFS_MIN_CAPACITY, (dbCount + 2) * VFS_SLOTS_PER_DB + 1),
  );
}

async function register(id: string, name: string, size: number): Promise<DbInfo> {
  const { catalog } = await getEngine();
  const now = Date.now();
  catalog.query(
    "INSERT INTO databases (id, name, size, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    [id, name, size, now, now],
  );
  return getInfo(id);
}

/** Opens the database if it is not the current one. Data calls name their database explicitly. */
async function session(id: string): Promise<SqliteSession> {
  if (current?.id === id) return current.session;
  const { sqlite3, pool } = await getEngine();
  await getInfo(id);
  closeCurrent();
  const db = new pool.OpfsSAHPoolDb(filePath(id));
  db.exec("PRAGMA foreign_keys = ON");
  current = { id, session: new SqliteSession(sqlite3, db) };
  return current.session;
}

function closeCurrent(): void {
  current?.session.db.close();
  current = null;
}

/** Records the new size and modification time after a write. */
async function touch(): Promise<void> {
  if (!current) return;
  const { catalog } = await getEngine();
  catalog.query("UPDATE databases SET size = ?, updated_at = ? WHERE id = ?", [
    current.session.sizeBytes(),
    Date.now(),
    current.id,
  ]);
}

const api = {
  async init(onProgress?: (p: BootProgress) => void): Promise<string> {
    if (!engine) {
      engine = boot(onProgress).catch((error) => {
        engine = null;
        throw error;
      });
    }
    const { sqlite3 } = await engine;
    onProgress?.({ stage: "ready", message: "Ready" });
    return sqlite3.version.libVersion;
  },

  async listDatabases(): Promise<DbInfo[]> {
    const { catalog } = await getEngine();
    return catalog.objects("SELECT * FROM databases ORDER BY updated_at DESC").map(toInfo);
  },

  async createDatabase(name: string, seedSql?: string): Promise<DbInfo> {
    const { sqlite3, pool } = await getEngine();
    await reserveSlotForOneMore();
    const id = crypto.randomUUID();
    const db = new pool.OpfsSAHPoolDb(filePath(id));
    const session = new SqliteSession(sqlite3, db);
    try {
      if (seedSql) session.db.exec(seedSql);
      const size = session.sizeBytes();
      db.close();
      return register(id, name, size);
    } catch (error) {
      db.close();
      pool.unlink(filePath(id));
      throw error;
    }
  },

  async importDatabase(name: string, bytes: Uint8Array): Promise<DbInfo> {
    const { pool } = await getEngine();
    await reserveSlotForOneMore();
    const id = crypto.randomUUID();
    try {
      await pool.importDb(filePath(id), bytes);
    } catch (error) {
      pool.unlink(filePath(id));
      throw new Error(
        `This file does not look like a SQLite database (${error instanceof Error ? error.message : String(error)})`,
      );
    }
    return register(id, name, bytes.byteLength);
  },

  async exportDatabase(id: string): Promise<Uint8Array> {
    const { pool } = await getEngine();
    const bytes = pool.exportFile(filePath(id));
    return Comlink.transfer(bytes, [bytes.buffer]);
  },

  async renameDatabase(id: string, name: string): Promise<DbInfo> {
    const { catalog } = await getEngine();
    if (!name.trim()) throw new Error("The name is empty");
    catalog.query("UPDATE databases SET name = ? WHERE id = ?", [name.trim(), id]);
    return getInfo(id);
  },

  async deleteDatabase(id: string): Promise<void> {
    const { pool, catalog } = await getEngine();
    if (current?.id === id) closeCurrent();
    pool.unlink(filePath(id));
    catalog.query("DELETE FROM databases WHERE id = ?", [id]);
  },

  async open(id: string): Promise<{ info: DbInfo; schema: Schema }> {
    const s = await session(id);
    return { info: await getInfo(id), schema: s.schema() };
  },

  async schema(id: string): Promise<Schema> {
    return (await session(id)).schema();
  },

  async count(id: string, sql: string, params: CellValue[]): Promise<number> {
    return (await session(id)).count(sql, params);
  },

  async query(id: string, sql: string, params: CellValue[] = [], limit?: number) {
    const result = (await session(id)).query(sql, params, limit);
    if (result.changes > 0) await touch();
    return result;
  },

  async execScript(id: string, sql: string, rowLimit: number) {
    const results = (await session(id)).execScript(sql, rowLimit);
    await touch();
    return results;
  },

  async explainScript(id: string, sql: string) {
    return (await session(id)).explainScript(sql);
  },

  async transaction(id: string, statements: SqlStatement[]): Promise<number> {
    const changes = (await session(id)).transaction(statements);
    await touch();
    return changes;
  },

  async applyDesign(id: string, statements: string[]): Promise<void> {
    (await session(id)).applyDesign(statements);
    await touch();
  },

  async insertMany(id: string, sql: string, rows: CellValue[][]): Promise<number> {
    const inserted = (await session(id)).insertMany(sql, rows);
    await touch();
    return inserted;
  },

  async dump(id: string): Promise<string> {
    return (await session(id)).dump();
  },
};

export type SqliteWorkerApi = typeof api;

Comlink.expose(api);
