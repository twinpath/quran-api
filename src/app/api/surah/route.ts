import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, getKv } from "@/lib/db";
import { surahs } from "@/lib/db/schema";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { getFromCache, putInCache } from "@/lib/cache-helper";
import { logTelemetry } from "@/lib/telemetry";
import type { ApiResponse, ApiErrorResponse, ApiSurahListItem } from "@/types/api";

/**
 * GET /api/surah
 * Returns a list of all 114 surahs with metadata.
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  const { env } = getCloudflareContext();
  const kv = getKv(env);
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";

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
  const cachePath = "surah";
  const cached = await getFromCache<ApiSurahListItem[]>(kv, cachePath);
  if (cached.hit && cached.data) {
    const responseTimeMs = Date.now() - startTime;
    await logTelemetry(env, "/api/surah", ip, 200, responseTimeMs);

    const body: ApiResponse<ApiSurahListItem[]> = {
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

  const responseTimeMs = Date.now() - startTime;
  await logTelemetry(env, "/api/surah", ip, 200, responseTimeMs);

  const body: ApiResponse<ApiSurahListItem[]> = {
    success: true,
    data,
    meta: { cached: false, responseTimeMs },
  };

  return Response.json(body, {
    headers: { ...rateLimitHeaders(rateResult), "X-Cache": "MISS" },
  });
}
