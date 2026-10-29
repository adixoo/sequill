import { describe, expect, test } from "bun:test";
import init from "@sqlite.org/sqlite-wasm";
import {
  inspectSqliteFile,
  parseSqliteHeader,
  readVarint,
  SQLITE_HEADER_SIZE,
} from "./file-header";
import { SAMPLE_DB_SQL } from "./sample";
import { databaseFile } from "./test-utils";

describe("parseSqliteHeader", () => {
  test("reads the header of a real database", async () => {
    const file = await databaseFile("PRAGMA page_size = 8192; CREATE TABLE t (a);");
    const head = new Uint8Array(await file.slice(0, SQLITE_HEADER_SIZE).arrayBuffer());
    const result = parseSqliteHeader(head, file.size);
    if (!result.ok) throw new Error(result.reason);
    const sqlite3 = await init();
    expect(result.header).toMatchObject({
      pageSize: 8192,
      pageCount: file.size / 8192,
      journal: "rollback",
      encoding: "UTF-8",
      freelistPages: 0,
      sqliteVersion: sqlite3.version.libVersion,
    });
  });

  test("reads the user version and application id", async () => {
    const file = await databaseFile(
      "PRAGMA user_version = 7; PRAGMA application_id = 42; CREATE TABLE t (a);",
    );
    const head = new Uint8Array(await file.slice(0, SQLITE_HEADER_SIZE).arrayBuffer());
    const result = parseSqliteHeader(head, file.size);
    expect(result.ok && result.header).toMatchObject({ userVersion: 7, applicationId: 42 });
  });

  test("reads the journal mode and text encoding bytes", async () => {
    // This WASM build has no UTF-16 or WAL support, so set the header bytes directly.
    const file = await databaseFile("CREATE TABLE t (a);");
    const head = new Uint8Array(await file.slice(0, SQLITE_HEADER_SIZE).arrayBuffer());
    const view = new DataView(head.buffer);
    view.setUint8(18, 2);
    view.setUint8(19, 2);
    view.setUint32(56, 3);
    const result = parseSqliteHeader(head, file.size);
    expect(result.ok && result.header).toMatchObject({ journal: "WAL", encoding: "UTF-16be" });
  });

  test("rejects files that are not SQLite", () => {
    const text = new TextEncoder().encode("id,name\n".repeat(20));
    expect(parseSqliteHeader(text, text.length)).toEqual({
      ok: false,
      reason: "This file doesn’t start with the SQLite header.",
    });
    expect(parseSqliteHeader(new Uint8Array(10), 10).ok).toBe(false);
  });
});

describe("readVarint", () => {
  test("decodes one to nine byte values", () => {
    expect(readVarint(new Uint8Array([0x05]), 0)).toEqual({ value: 5, length: 1 });
    expect(readVarint(new Uint8Array([0x81, 0x00]), 0)).toEqual({ value: 128, length: 2 });
    expect(readVarint(new Uint8Array([0xff, 0x7f]), 0)).toEqual({ value: 16_383, length: 2 });
    const nine = new Uint8Array([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x01]);
    expect(readVarint(nine, 0)).toEqual({ value: 1, length: 9 });
  });
});

describe("inspectSqliteFile", () => {
  test("lists the sample shop's schema", async () => {
    const report = await inspectSqliteFile(await databaseFile(SAMPLE_DB_SQL));
    expect(report.schema).toEqual([
      { kind: "table", name: "customers" },
      { kind: "table", name: "products" },
      { kind: "table", name: "orders" },
      { kind: "table", name: "order_items" },
      { kind: "index", name: "orders_customer" },
      { kind: "index", name: "products_category" },
      { kind: "view", name: "order_totals" },
      { kind: "trigger", name: "order_items_stock" },
    ]);
  });

  test("follows a schema that spans many pages", async () => {
    const tables = Array.from(
      { length: 120 },
      (_, i) => `CREATE TABLE table_${i} (id INTEGER PRIMARY KEY, label TEXT);`,
    );
    const report = await inspectSqliteFile(
      await databaseFile(`PRAGMA page_size = 512; ${tables.join("\n")}`),
    );
    expect(report.header.pageSize).toBe(512);
    expect(report.schema).toHaveLength(120);
    expect(report.schema.at(-1)).toEqual({ kind: "table", name: "table_119" });
  });

  test("reads names that are not ASCII", async () => {
    const report = await inspectSqliteFile(await databaseFile("CREATE TABLE café (a);"));
    expect(report.schema).toEqual([{ kind: "table", name: "café" }]);
  });

  test("throws a readable error for other files", async () => {
    await expect(inspectSqliteFile(new Blob(["not a database"]))).rejects.toThrow(
      "smaller than a SQLite header",
    );
  });
});
