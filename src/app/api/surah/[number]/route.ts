import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getKv } from "@/lib/db";
import { resolveIdentity, checkRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { logTelemetry } from "@/lib/telemetry";
import { getSurahDetail } from "@/lib/surah.service";
import { formatServerTimingHeader } from "@/lib/latency";
import type { ApiResponse, ApiErrorResponse, ApiSurahDetail } from "@/types/api";

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
  const identity = await resolveIdentity(request);
  const rateResult = await checkRateLimit(kv, identity, "core");
  if (!rateResult.allowed) {
    const errorBody: ApiErrorResponse = {
      success: false,
      error: { code: "RATE_LIMIT_EXCEEDED", message: "API rate limit exceeded. Please try again later or provide an API Key." },
    };
    return Response.json(errorBody, {
      status: 429,
      headers: rateLimitHeaders(rateResult),
    });
  }

  // Service invocation
  const result = await getSurahDetail(env, surahNumber);

  const responseTimeMs = Date.now() - startTime;
  await logTelemetry(env, request, `/api/surah/${surahNumber}`, 200, responseTimeMs);

  if (!result.success) {
    return Response.json(
      { success: false, error: { code: result.error.code, message: result.error.message } } satisfies ApiErrorResponse,
      { status: result.error.status, headers: rateLimitHeaders(rateResult) },
    );
  }

  const body: ApiResponse<ApiSurahDetail> = {
    success: true,
    data: result.data,
    meta: { cached: result.cached, responseTimeMs },
  };

  return Response.json(body, {
    headers: {
      ...rateLimitHeaders(rateResult),
      "X-Cache": result.cached ? "HIT" : "MISS",
      "Server-Timing": formatServerTimingHeader(responseTimeMs),
    },
  });
}
