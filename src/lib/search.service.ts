import { eq, like, or } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { ayahs, surahs } from "@/lib/db/schema";
import type { ServiceResult, ApiSearchResult, ApiSearchHit } from "@/types/api";

/** Maximum number of search results returned */
const MAX_RESULTS = 50;

/**
 * Search ayahs by Indonesian translation or surah Latin name using SQL LIKE.
 * No caching: search queries are too variable for effective KV caching.
 */
export async function searchAyahs(
  env: CloudflareEnv,
  query: string,
): Promise<ServiceResult<ApiSearchResult>> {
  const db = getDb(env);
  const pattern = `%${query}%`;

  const rows = await db
    .select({
      surahNumber: ayahs.surahNumber,
      ayahNumber: ayahs.ayahNumber,
      textArabic: ayahs.textArabic,
      translationId: ayahs.translationId,
      surahNameLatin: surahs.nameLatin,
    })
    .from(ayahs)
    .innerJoin(surahs, eq(surahs.number, ayahs.surahNumber))
    .where(
      or(
        like(ayahs.translationId, pattern),
        like(surahs.nameLatin, pattern),
      ),
    )
    .limit(MAX_RESULTS);

  const results: ApiSearchHit[] = rows.map((row) => ({
    surahNumber: row.surahNumber,
    surahNameLatin: row.surahNameLatin,
    ayahNumber: row.ayahNumber,
    textArabic: row.textArabic,
    translationId: row.translationId,
  }));

  const data: ApiSearchResult = {
    query,
    total: results.length,
    results,
  };

  return { success: true, data, cached: false };
}
