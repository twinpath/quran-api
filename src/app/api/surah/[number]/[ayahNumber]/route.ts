import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, eq } from "drizzle-orm";
import { getDb, getKv } from "@/lib/db";
import { surahs, ayahs } from "@/lib/db/schema";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { getFromCache, putInCache } from "@/lib/cache-helper";
import { logTelemetry } from "@/lib/telemetry";
import type { ApiResponse, ApiErrorResponse, ApiAyahDetail } from "@/types/api";

/**
 * GET /api/surah/[number]/[ayahNumber]
 * Returns a specific ayah of a surah with translation and tafsir.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ number: string; ayahNumber: string }> },
) {
  const startTime = Date.now();
  const { env } = getCloudflareContext();
  const kv = getKv(env);
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const { number: numberParam, ayahNumber: ayahParam } = await params;

  // Validate surah number
  const surahNumber = parseInt(numberParam, 10);
  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: "INVALID_SURAH_NUMBER", message: "Surah number must be between 1 and 114." },
    };
    return Response.json(errorBody, { status: 400 });
  }

  // Validate ayah number
  const ayahNum = parseInt(ayahParam, 10);
  if (isNaN(ayahNum) || ayahNum < 1) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: "INVALID_AYAH_NUMBER", message: "Ayah number must be a positive integer." },
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
  const cachePath = `surah/${surahNumber}/ayah/${ayahNum}`;
  const cached = await getFromCache<ApiAyahDetail>(kv, cachePath);
  if (cached.hit && cached.data) {
    const responseTimeMs = Date.now() - startTime;
    await logTelemetry(env, request, `/api/surah/${surahNumber}/${ayahNum}`, 200, responseTimeMs);

    const body: ApiResponse<ApiAyahDetail> = {
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

  if (ayahNum > surahRow.numberOfAyah) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: {
        code: "AYAH_NOT_FOUND",
        message: `Ayah ${ayahNum} does not exist in Surah ${surahNumber} (${surahRow.nameLatin}), which has ${surahRow.numberOfAyah} ayahs.`,
      },
    };
    return Response.json(errorBody, { status: 404 });
  }

  const [ayahRow] = await db
    .select()
    .from(ayahs)
    .where(and(eq(ayahs.surahNumber, surahNumber), eq(ayahs.ayahNumber, ayahNum)))
    .limit(1);

  if (!ayahRow) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: "AYAH_NOT_FOUND", message: `Ayah ${ayahNum} in Surah ${surahNumber} not found.` },
    };
    return Response.json(errorBody, { status: 404 });
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

  const responseTimeMs = Date.now() - startTime;
  await logTelemetry(env, request, `/api/surah/${surahNumber}/${ayahNum}`, 200, responseTimeMs);

  const body: ApiResponse<ApiAyahDetail> = {
    success: true,
    data,
    meta: { cached: false, responseTimeMs },
  };

  return Response.json(body, {
    headers: { ...rateLimitHeaders(rateResult), "X-Cache": "MISS" },
  });
}
