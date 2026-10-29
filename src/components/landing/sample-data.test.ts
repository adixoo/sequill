import { expect, test } from "bun:test";
import { inspectSqliteFile } from "@/lib/sqlite/file-header";
import { SAMPLE_DB_SQL } from "@/lib/sqlite/sample";
import { databaseFile, memorySession } from "@/lib/sqlite/test-utils";
import { SAMPLE_FILE, SAMPLE_ORDERS, SAMPLE_ORDERS_SQL } from "./sample-data";

test("the landing page's orders match the sample database", async () => {
  const session = await memorySession(SAMPLE_DB_SQL);
  const rows = session.db.exec({
    sql: SAMPLE_ORDERS_SQL,
    rowMode: "object",
    returnValue: "resultRows",
  });
  expect(rows).toEqual(SAMPLE_ORDERS.map((order) => ({ ...order })));
});

test("the landing page's example file matches the sample database's file", async () => {
  const file = await databaseFile(SAMPLE_DB_SQL);
  expect(file.size).toBe(SAMPLE_FILE.size);
  expect(await inspectSqliteFile(file)).toEqual(SAMPLE_FILE.report);
});
