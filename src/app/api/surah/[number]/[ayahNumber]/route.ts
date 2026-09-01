import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getKv } from "@/lib/db";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { logTelemetry } from "@/lib/telemetry";
import { getAyahDetail } from "@/lib/surah.service";
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

  // Service invocation
  const result = await getAyahDetail(env, surahNumber, ayahNum);

  const responseTimeMs = Date.now() - startTime;
  await logTelemetry(env, request, `/api/surah/${surahNumber}/${ayahNum}`, 200, responseTimeMs);

  if (!result.success) {
    return Response.json(
      { success: false, error: { code: result.error.code, message: result.error.message } } satisfies ApiErrorResponse,
      { status: result.error.status, headers: rateLimitHeaders(rateResult) },
    );
  }

  const body: ApiResponse<ApiAyahDetail> = {
    success: true,
    data: result.data,
    meta: { cached: result.cached, responseTimeMs },
  };

  return Response.json(body, {
    headers: { ...rateLimitHeaders(rateResult), "X-Cache": result.cached ? "HIT" : "MISS" },
  });
}
