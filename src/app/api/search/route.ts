import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getKv } from "@/lib/db";
import { checkRateLimit, rateLimitHeaders } from "@/lib/rate-limiter";
import { logTelemetry } from "@/lib/telemetry";
import { searchAyahs } from "@/lib/search.service";
import type { ApiResponse, ApiErrorResponse, ApiSearchResult } from "@/types/api";

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

  // Service invocation
  const result = await searchAyahs(env, query);

  const responseTimeMs = Date.now() - startTime;
  await logTelemetry(env, request, "/api/search", 200, responseTimeMs);

  if (!result.success) {
    return Response.json(
      { success: false, error: { code: result.error.code, message: result.error.message } } satisfies ApiErrorResponse,
      { status: result.error.status, headers: rateLimitHeaders(rateResult) },
    );
  }

  const body: ApiResponse<ApiSearchResult> = {
    success: true,
    data: result.data,
    meta: { cached: false, responseTimeMs },
  };

  return Response.json(body, {
    headers: rateLimitHeaders(rateResult),
  });
}
