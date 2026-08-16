import { getCloudflareContext } from "@opennextjs/cloudflare";
import { eq, like, or } from "drizzle-orm";
import { getDb, getKv } from "@/lib/db";
import { ayahs, surahs } from "@/lib/db/schema";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { logTelemetry } from "@/lib/telemetry";
import type { ApiResponse, ApiErrorResponse, ApiSearchResult, ApiSearchHit } from "@/types/api";

/** Maximum number of search results returned */
const MAX_RESULTS = 50;

/**
 * GET /api/search?q={query}
 * Search ayahs by Indonesian translation or surah Latin name using SQL LIKE.
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  const { env } = getCloudflareContext();
  const kv = getKv(env);
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";

  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim();

  // Validate query
  if (!query || query.length < 2) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: "INVALID_QUERY", message: "Search query must be at least 2 characters." },
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

  // Query D1 with LIKE search (no caching for search - queries are too variable)
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

  const responseTimeMs = Date.now() - startTime;
  await logTelemetry(env, "/api/search", ip, 200, responseTimeMs);

  const body: ApiResponse<ApiSearchResult> = {
    success: true,
    data,
    meta: { cached: false, responseTimeMs },
  };

  return Response.json(body, {
    headers: rateLimitHeaders(rateResult),
  });
}
