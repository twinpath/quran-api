import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";
import { surahs } from "./schema";
import type { ApiSurahListItem } from "@/types/api";
import { SURAH_CATALOG } from "@/lib/quran-data";

/**
 * Safely resolves the Cloudflare D1 database binding from passed env or Cloudflare runtime context.
 */
export function getDb(env?: CloudflareEnv) {
  let dbBinding = env?.DB;
  if (!dbBinding) {
    try {
      const cf = getCloudflareContext();
      dbBinding = cf?.env?.DB;
    } catch {
      // Ignore if outside Cloudflare context (e.g. static analysis)
    }
  }

  if (!dbBinding) {
    throw new Error(
      "Cloudflare D1 database binding (env.DB) is missing. Ensure Cloudflare environment context is provided.",
    );
  }

  return drizzle(dbBinding, { schema });
}

class InMemoryKv {
  private store = new Map<string, { value: string; expiresAt?: number }>();

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void> {
    const expiresAt = options?.expirationTtl ? Date.now() + options.expirationTtl * 1000 : undefined;
    this.store.set(key, { value, expiresAt });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}

const devKvStore = new InMemoryKv();

/**
 * Safely resolves the KV namespace binding from Cloudflare environment.
 * Falls back to an in-memory KV store during local Next.js development.
 */
export function getKv(env?: CloudflareEnv) {
  let kvBinding = env?.KV;
  if (!kvBinding) {
    try {
      const cf = getCloudflareContext();
      kvBinding = cf?.env?.KV;
    } catch {
      // Ignore if outside Cloudflare context
    }
  }
  return kvBinding || (devKvStore as unknown as KVNamespace);
}

/**
 * Fetch surah list from D1 database, or fall back to static catalog.
 */
export async function fetchSurahList(env?: CloudflareEnv): Promise<ApiSurahListItem[]> {
  try {
    const db = getDb(env);
    const rows = await db.select().from(surahs).all();
    return rows.map((row) => ({
      number: row.number,
      name: row.name,
      nameLatin: row.nameLatin,
      numberOfAyah: row.numberOfAyah,
      translationName: row.translationName,
      revelationType: row.revelationType,
    }));
  } catch (err) {
    console.warn("Error querying surah list from D1, falling back to static catalog:", err);
    return SURAH_CATALOG.map((s) => ({
      number: s.number,
      name: s.name,
      nameLatin: s.nameLatin,
      numberOfAyah: s.numberOfAyah,
      translationName: s.translationIdName,
      revelationType: s.revelationType,
    }));
  }
}
