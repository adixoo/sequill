/**
 * Reads facts about a SQLite file without the SQLite engine: the 100-byte
 * database header and the names in sqlite_schema (the b-tree rooted on page 1).
 * Used by the landing page to inspect a visitor's file in the tab, so it stays
 * small and only ever reads; see https://www.sqlite.org/fileformat2.html.
 */

export const SQLITE_HEADER_SIZE = 100;
const MAGIC = "SQLite format 3\0";
/** Stop walking the schema b-tree after this many pages (a schema this large is rare). */
const MAX_SCHEMA_PAGES = 256;

export type TextEncodingName = "UTF-8" | "UTF-16le" | "UTF-16be";

export interface SqliteFileHeader {
  pageSize: number;
  /** Pages in the file, from the header when it is valid, else from the file size. */
  pageCount: number;
  /** Bytes reserved at the end of each page (used by extensions such as encryption). */
  reservedBytes: number;
  journal: "WAL" | "rollback";
  encoding: TextEncodingName;
  freelistPages: number;
  userVersion: number;
  applicationId: number;
  /** Version of the SQLite library that last wrote the file, e.g. "3.54.1". */
  sqliteVersion: string;
}

export type SchemaKind = "table" | "view" | "index" | "trigger";

export interface SchemaEntry {
  kind: SchemaKind;
  name: string;
}

export type HeaderResult = { ok: true; header: SqliteFileHeader } | { ok: false; reason: string };

const ENCODINGS: Record<number, TextEncodingName> = { 1: "UTF-8", 2: "UTF-16le", 3: "UTF-16be" };

/** "3054001" → "3.54.1" */
function versionString(n: number): string {
  return `${Math.floor(n / 1_000_000)}.${Math.floor(n / 1000) % 1000}.${n % 1000}`;
}

/** Parses the first 100 bytes of a file; `fileSize` fills in the page count for old writers. */
export function parseSqliteHeader(bytes: Uint8Array, fileSize: number): HeaderResult {
  if (bytes.length < SQLITE_HEADER_SIZE) {
    return { ok: false, reason: "The file is smaller than a SQLite header." };
  }
  const magic = String.fromCharCode(...bytes.subarray(0, MAGIC.length));
  if (magic !== MAGIC) {
    return { ok: false, reason: "This file doesn’t start with the SQLite header." };
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, SQLITE_HEADER_SIZE);
  const rawPageSize = view.getUint16(16);
  const pageSize = rawPageSize === 1 ? 65_536 : rawPageSize;
  if (pageSize < 512 || (pageSize & (pageSize - 1)) !== 0) {
    return { ok: false, reason: "The header has an invalid page size." };
  }
  const encoding = ENCODINGS[view.getUint32(56)] ?? "UTF-8";
  const changeCounter = view.getUint32(24);
  const headerPages = view.getUint32(28);
  // The in-header size is only trusted when it was written by a library that keeps it current.
  const headerPagesValid = headerPages > 0 && view.getUint32(92) === changeCounter;
  return {
    ok: true,
    header: {
      pageSize,
      pageCount: headerPagesValid ? headerPages : Math.ceil(fileSize / pageSize),
      reservedBytes: view.getUint8(20),
      journal: view.getUint8(18) === 2 ? "WAL" : "rollback",
      encoding,
      freelistPages: view.getUint32(36),
      userVersion: view.getInt32(60),
      applicationId: view.getUint32(68),
      sqliteVersion: versionString(view.getUint32(96)),
    },
  };
}

/** Reads a SQLite varint at `offset`; returns its value and length in bytes. */
export function readVarint(bytes: Uint8Array, offset: number): { value: number; length: number } {
  let value = 0;
  for (let i = 0; i < 8; i++) {
    const byte = bytes[offset + i];
    if (byte === undefined) return { value, length: i };
    value = value * 128 + (byte & 0x7f);
    if (byte < 0x80) return { value, length: i + 1 };
  }
  const last = bytes[offset + 8] ?? 0;
  return { value: value * 256 + last, length: 9 };
}

const LEAF_TABLE = 0x0d;
const INTERIOR_TABLE = 0x05;

export type SchemaPage =
  | { kind: "leaf"; entries: SchemaEntry[] }
  | { kind: "interior"; children: number[] }
  | { kind: "unknown" };

/** Bytes of a cell's payload stored on the page itself (the rest is on overflow pages). */
function localPayload(payload: number, usable: number): number {
  const max = usable - 35;
  if (payload <= max) return payload;
  const min = Math.floor(((usable - 12) * 32) / 255) - 23;
  const k = min + ((payload - min) % (usable - 4));
  return k <= max ? k : min;
}

/** Reads the first two text columns (type, name) of a sqlite_schema record. */
function readSchemaRecord(record: Uint8Array, decoder: TextDecoder): SchemaEntry | null {
  const headerSize = readVarint(record, 0);
  let typeAt = headerSize.length;
  const serials: number[] = [];
  while (typeAt < headerSize.value && serials.length < 2) {
    const serial = readVarint(record, typeAt);
    serials.push(serial.value);
    typeAt += serial.length;
  }
  if (serials.length < 2 || serials.some((s) => s < 13 || s % 2 === 0)) return null;
  const typeLength = (serials[0] - 13) / 2;
  const nameLength = (serials[1] - 13) / 2;
  const start = headerSize.value;
  if (start + typeLength + nameLength > record.length) return null;
  const kind = decoder.decode(record.subarray(start, start + typeLength));
  const name = decoder.decode(record.subarray(start + typeLength, start + typeLength + nameLength));
  if (kind !== "table" && kind !== "view" && kind !== "index" && kind !== "trigger") return null;
  return { kind, name };
}

/** Parses one page of the sqlite_schema table b-tree. Page 1 starts after the file header. */
export function parseSchemaPage(
  page: Uint8Array,
  pageNumber: number,
  header: SqliteFileHeader,
): SchemaPage {
  const at = pageNumber === 1 ? SQLITE_HEADER_SIZE : 0;
  const view = new DataView(page.buffer, page.byteOffset, page.byteLength);
  const type = page[at];
  const cells = view.getUint16(at + 3);
  if (type === INTERIOR_TABLE) {
    const children: number[] = [];
    for (let i = 0; i < cells; i++) {
      children.push(view.getUint32(view.getUint16(at + 12 + i * 2)));
    }
    children.push(view.getUint32(at + 8));
    return { kind: "interior", children };
  }
  if (type !== LEAF_TABLE) return { kind: "unknown" };
  const decoder = new TextDecoder(header.encoding.toLowerCase());
  const usable = header.pageSize - header.reservedBytes;
  const entries: SchemaEntry[] = [];
  for (let i = 0; i < cells; i++) {
    let offset = view.getUint16(at + 8 + i * 2);
    const payload = readVarint(page, offset);
    offset += payload.length;
    offset += readVarint(page, offset).length; // rowid
    const local = Math.min(localPayload(payload.value, usable), page.length - offset);
    const entry = readSchemaRecord(page.subarray(offset, offset + local), decoder);
    if (entry) entries.push(entry);
  }
  return { kind: "leaf", entries };
}

/**
 * Walks the schema b-tree from page 1 and lists every table, view, index and
 * trigger, leaving out SQLite's own internal objects (names starting "sqlite_").
 */
export async function readSchema(
  readPage: (pageNumber: number) => Promise<Uint8Array>,
  header: SqliteFileHeader,
): Promise<SchemaEntry[]> {
  const entries: SchemaEntry[] = [];
  const queue = [1];
  const seen = new Set<number>();
  while (queue.length > 0 && seen.size < MAX_SCHEMA_PAGES) {
    const pageNumber = queue.shift()!;
    if (seen.has(pageNumber) || pageNumber < 1 || pageNumber > header.pageCount) continue;
    seen.add(pageNumber);
    const page = parseSchemaPage(await readPage(pageNumber), pageNumber, header);
    if (page.kind === "interior") queue.push(...page.children);
    if (page.kind === "leaf") entries.push(...page.entries);
  }
  return entries.filter((e) => !e.name.startsWith("sqlite_"));
}

export interface SqliteFileReport {
  header: SqliteFileHeader;
  schema: SchemaEntry[];
}

/** Inspects a file chosen by the user. Throws an Error with a readable message. */
export async function inspectSqliteFile(file: Blob): Promise<SqliteFileReport> {
  const head = new Uint8Array(await file.slice(0, SQLITE_HEADER_SIZE).arrayBuffer());
  const result = parseSqliteHeader(head, file.size);
  if (!result.ok) throw new Error(result.reason);
  const { header } = result;
  const readPage = async (n: number) =>
    new Uint8Array(await file.slice((n - 1) * header.pageSize, n * header.pageSize).arrayBuffer());
  return { header, schema: await readSchema(readPage, header) };
}
