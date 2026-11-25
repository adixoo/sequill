import { describe, expect, test } from "bun:test";
import { ORDER_ROWS, totalsByStatus } from "./data";

describe("totalsByStatus", () => {
  test("groups the sample orders and keeps every order and cent", () => {
    const totals = totalsByStatus(ORDER_ROWS);
    expect(totals.map((t) => [t.status, t.orders])).toEqual([
      ["pending", 2],
      ["paid", 1],
      ["shipped", 6],
      ["cancelled", 1],
    ]);
    expect(totals.reduce((n, t) => n + t.orders, 0)).toBe(ORDER_ROWS.length);
    const cents = (n: number) => Math.round(n * 100);
    expect(totals.reduce((sum, t) => sum + cents(t.revenue), 0)).toBe(
      ORDER_ROWS.reduce((sum, row) => sum + cents(row.total), 0),
    );
    expect(totals.find((t) => t.status === "pending")?.revenue).toBe(667.5);
  });

  test("skips statuses with no rows", () => {
    expect(totalsByStatus([])).toEqual([]);
  });
});
