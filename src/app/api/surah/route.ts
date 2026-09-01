import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getKv } from "@/lib/db";
import { resolveIdentity, checkRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { logTelemetry } from "@/lib/telemetry";
import { getSurahList } from "@/lib/surah.service";
import { formatServerTimingHeader } from "@/lib/latency";
import type { ApiResponse, ApiErrorResponse, ApiSurahListItem } from "@/types/api";

/**
 * GET /api/surah
 * Returns a list of all 114 surahs with metadata.
 */
export async function GET(request: Request) {
  const startTime = Date.now();
  const { env } = getCloudflareContext();
  const kv = getKv(env);
  // Rate limit check
  const identity = await resolveIdentity(request, env);
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
  const result = await getSurahList(env);

  const responseTimeMs = Date.now() - startTime;
  await logTelemetry(env, request, "/api/surah", 200, responseTimeMs);

  if (!result.success) {
    return Response.json(
      { success: false, error: { code: result.error.code, message: result.error.message } },
      { status: result.error.status, headers: rateLimitHeaders(rateResult) },
    );
  }

  const body: ApiResponse<ApiSurahListItem[]> = {
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
