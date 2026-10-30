/** Saved SQL queries, kept in this browser and shared by every database. */
import { create } from "zustand";
import { STORAGE_KEYS } from "@/lib/constants";
import { normalizeSavedQueries, type SavedQuery } from "@/lib/data/saved-queries";
import { readJson, writeJson } from "@/lib/storage";
import { newId } from "@/lib/utils";

interface SavedQueriesState {
  queries: SavedQuery[];
  /** Saves a new query and returns it. */
  add(name: string, sql: string): SavedQuery;
  /** Replaces a saved query's SQL (Save on a tab that's already saved). */
  update(id: string, sql: string): void;
  rename(id: string, name: string): void;
  /** Removes a saved query and returns it, so the caller can offer an undo. */
  remove(id: string): SavedQuery | undefined;
  /** Puts a removed query back. */
  restore(query: SavedQuery): void;
}

function load(): SavedQuery[] {
  if (typeof window === "undefined") return [];
  return normalizeSavedQueries(readJson<unknown>(STORAGE_KEYS.savedQueries, []), newId);
}

export const useSavedQueries = create<SavedQueriesState>()((set, get) => {
  const commit = (queries: SavedQuery[]) => {
    const sorted = [...queries].sort((a, b) => b.updatedAt - a.updatedAt);
    writeJson(STORAGE_KEYS.savedQueries, sorted);
    set({ queries: sorted });
  };
  return {
    queries: load(),

    add(name, sql) {
      const query: SavedQuery = { id: newId(), name: name.trim(), sql, updatedAt: Date.now() };
      commit([query, ...get().queries]);
      return query;
    },

    update(id, sql) {
      commit(get().queries.map((q) => (q.id === id ? { ...q, sql, updatedAt: Date.now() } : q)));
    },

    rename(id, name) {
      commit(get().queries.map((q) => (q.id === id ? { ...q, name: name.trim() } : q)));
    },

    remove(id) {
      const query = get().queries.find((q) => q.id === id);
      commit(get().queries.filter((q) => q.id !== id));
      return query;
    },

    restore(query) {
      commit([query, ...get().queries.filter((q) => q.id !== query.id)]);
    },
  };
});
