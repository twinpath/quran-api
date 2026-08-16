import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq } from "drizzle-orm";
import { getDb, getKv } from "@/lib/db";
import { surahs, ayahs } from "@/lib/db/schema";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { getFromCache, putInCache } from "@/lib/cache-helper";
import { logTelemetry } from "@/lib/telemetry";
import type { ApiResponse, ApiErrorResponse, ApiSurahDetail, ApiAyahItem } from "@/types/api";

/**
 * GET /api/surah/[number]
 * Returns a single surah with all ayahs, translations, and tafsir.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ number: string }> },
) {
  const startTime = Date.now();
  const { env } = getCloudflareContext();
  const kv = getKv(env);
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const { number: numberParam } = await params;

  // Validate surah number
  const surahNumber = parseInt(numberParam, 10);
  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: "INVALID_SURAH_NUMBER", message: "Surah number must be between 1 and 114." },
    };
    return Response.json(errorBody, { status: 400 });
  }

  // Rate limit check
  const rateResult = await checkRateLimit(kv, ip);
  if (!rateResult.allowed) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests. Please try again later." },
    };
    return Response.json(errorBody, {
      status: 429,
      headers: rateLimitHeaders(rateResult),
    });
  }

  // Cache check
  const cachePath = `surah/${surahNumber}`;
  const cached = await getFromCache<ApiSurahDetail>(kv, cachePath);
  if (cached.hit && cached.data) {
    const responseTimeMs = Date.now() - startTime;
    await logTelemetry(env, request, `/api/surah/${surahNumber}`, 200, responseTimeMs);

    const body: ApiResponse<ApiSurahDetail> = {
      success: true,
      data: cached.data,
      meta: { cached: true, responseTimeMs },
    };
    return Response.json(body, {
      headers: { ...rateLimitHeaders(rateResult), "X-Cache": "HIT" },
    });
  }

  // Query D1
  const db = getDb(env);

  const [surahRow] = await db
    .select()
    .from(surahs)
    .where(eq(surahs.number, surahNumber))
    .limit(1);

  if (!surahRow) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: "SURAH_NOT_FOUND", message: `Surah ${surahNumber} not found.` },
    };
    return Response.json(errorBody, { status: 404 });
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

  const responseTimeMs = Date.now() - startTime;
  await logTelemetry(env, request, `/api/surah/${surahNumber}`, 200, responseTimeMs);

  const body: ApiResponse<ApiSurahDetail> = {
    success: true,
    data,
    meta: { cached: false, responseTimeMs },
  };

  return Response.json(body, {
    headers: { ...rateLimitHeaders(rateResult), "X-Cache": "MISS" },
  });
}
