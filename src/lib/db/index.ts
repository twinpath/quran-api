import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { surahs } from "./schema";
import type { ApiSurahListItem } from "@/types/api";
import { SURAH_CATALOG } from "@/lib/quran-data";

/**
 * Create a typed Drizzle client from Cloudflare D1 binding.
 */
export function getDb(env: CloudflareEnv) {
  return drizzle(env.DB, { schema });
}

/**
 * Get the KV namespace binding from Cloudflare environment.
 */
export function getKv(env: CloudflareEnv) {
  return env.KV;
}

/**
 * Fetch surah list from D1 database, or fall back to static catalog.
 */
export async function fetchSurahList(env?: CloudflareEnv): Promise<ApiSurahListItem[]> {
  if (!env || !env.DB) {
    // Fallback to static catalog (during build or missing binding)
    return SURAH_CATALOG.map((s) => ({
      number: s.number,
      name: s.name,
      nameLatin: s.nameLatin,
      numberOfAyah: s.numberOfAyah,
      translationName: s.translationIdName,
      revelationType: s.revelationType,
    }));
  }
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

