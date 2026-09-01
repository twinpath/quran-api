import { eq, and } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { getKv } from "@/lib/kv";
import { surahs, ayahs } from "@/lib/db/schema";
import { getFromCache, putInCache } from "@/lib/cache-helper";
import type {
  ServiceResult,
  ApiSurahListItem,
  ApiSurahDetail,
  ApiAyahItem,
  ApiAyahDetail,
} from "@/types/api";

/**
 * Fetch a list of all 114 surahs from KV cache or D1.
 */
export async function getSurahList(env: CloudflareEnv): Promise<ServiceResult<ApiSurahListItem[]>> {
  const kv = getKv(env);
  const cachePath = "surah";

  // Cache check
  const cached = await getFromCache<ApiSurahListItem[]>(kv, cachePath);
  if (cached.hit && cached.data) {
    return { success: true, data: cached.data, cached: true };
  }

  // Query D1
  const db = getDb(env);
  const rows = await db.select().from(surahs).all();

  const data: ApiSurahListItem[] = rows.map((row) => ({
    number: row.number,
    name: row.name,
    nameLatin: row.nameLatin,
    numberOfAyah: row.numberOfAyah,
    translationName: row.translationName,
    revelationType: row.revelationType,
  }));

  // Store in cache
  await putInCache(kv, cachePath, data);

  return { success: true, data, cached: false };
}

/**
 * Fetch a single surah with all ayahs, translations, and tafsir.
 */
export async function getSurahDetail(
  env: CloudflareEnv,
  surahNumber: number,
): Promise<ServiceResult<ApiSurahDetail>> {
  const kv = getKv(env);
  const cachePath = `surah/${surahNumber}`;

  // Cache check
  const cached = await getFromCache<ApiSurahDetail>(kv, cachePath);
  if (cached.hit && cached.data) {
    return { success: true, data: cached.data, cached: true };
  }

  // Query D1
  const db = getDb(env);

  const [surahRow] = await db
    .select()
    .from(surahs)
    .where(eq(surahs.number, surahNumber))
    .limit(1);

  if (!surahRow) {
    return {
      success: false,
      error: { code: "SURAH_NOT_FOUND", message: `Surah ${surahNumber} not found.`, status: 404 },
    };
  }

  const ayahRows = await db
    .select()
    .from(ayahs)
    .where(eq(ayahs.surahNumber, surahNumber))
    .orderBy(ayahs.ayahNumber);

  const ayahItems: ApiAyahItem[] = ayahRows.map((row) => ({
    number: row.ayahNumber,
    textArabic: row.textArabic,
    translationId: row.translationId,
    tafsirKemenag: row.tafsirKemenag,
  }));

  const data: ApiSurahDetail = {
    number: surahRow.number,
    name: surahRow.name,
    nameLatin: surahRow.nameLatin,
    numberOfAyah: surahRow.numberOfAyah,
    translationName: surahRow.translationName,
    revelationType: surahRow.revelationType,
    ayahs: ayahItems,
  };

  // Store in cache
  await putInCache(kv, cachePath, data);

  return { success: true, data, cached: false };
}

/**
 * Fetch a specific ayah with surah metadata, translation, and tafsir.
 */
export async function getAyahDetail(
  env: CloudflareEnv,
  surahNumber: number,
  ayahNumber: number,
): Promise<ServiceResult<ApiAyahDetail>> {
  const kv = getKv(env);
  const cachePath = `surah/${surahNumber}/ayah/${ayahNumber}`;

  // Cache check
  const cached = await getFromCache<ApiAyahDetail>(kv, cachePath);
  if (cached.hit && cached.data) {
    return { success: true, data: cached.data, cached: true };
  }

  // Query D1
  const db = getDb(env);

  const [surahRow] = await db
    .select()
    .from(surahs)
    .where(eq(surahs.number, surahNumber))
    .limit(1);

  if (!surahRow) {
    return {
      success: false,
      error: { code: "SURAH_NOT_FOUND", message: `Surah ${surahNumber} not found.`, status: 404 },
    };
  }

  if (ayahNumber > surahRow.numberOfAyah) {
    return {
      success: false,
      error: {
        code: "AYAH_NOT_FOUND",
        message: `Ayah ${ayahNumber} does not exist in Surah ${surahNumber} (${surahRow.nameLatin}), which has ${surahRow.numberOfAyah} ayahs.`,
        status: 404,
      },
    };
  }

  const [ayahRow] = await db
    .select()
    .from(ayahs)
    .where(and(eq(ayahs.surahNumber, surahNumber), eq(ayahs.ayahNumber, ayahNumber)))
    .limit(1);

  if (!ayahRow) {
    return {
      success: false,
      error: { code: "AYAH_NOT_FOUND", message: `Ayah ${ayahNumber} in Surah ${surahNumber} not found.`, status: 404 },
    };
  }

  const data: ApiAyahDetail = {
    surahNumber: surahRow.number,
    surahName: surahRow.name,
    surahNameLatin: surahRow.nameLatin,
    number: ayahRow.ayahNumber,
    textArabic: ayahRow.textArabic,
    translationId: ayahRow.translationId,
    tafsirKemenag: ayahRow.tafsirKemenag,
  };

  // Store in cache
  await putInCache(kv, cachePath, data);

  return { success: true, data, cached: false };
}
