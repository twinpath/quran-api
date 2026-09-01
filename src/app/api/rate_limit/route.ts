import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getKv } from "@/lib/db";
import { resolveIdentity, getRateLimitStatus } from "@/lib/rate-limiter";
import type { ApiResponse } from "@/types/api";
import type { RateLimitStatusResponse } from "@/types/rate-limit";

/**
 * GET /api/rate_limit
 * Returns GitHub-style rate limit status across resources.
 * Note: Executing this endpoint does NOT consume rate limit quota.
 */
export async function GET(request: Request) {
  const { env } = getCloudflareContext();
  const kv = getKv(env);

  // Resolve identity (IP or API key)
  const identity = await resolveIdentity(request, env);

  // Read rate limit status (read-only, 0 quota cost)
  const data: RateLimitStatusResponse = await getRateLimitStatus(kv, identity);

  const body: ApiResponse<RateLimitStatusResponse> = {
    success: true,
    data,
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-RateLimit-Limit": String(data.rate.limit),
      "X-RateLimit-Remaining": String(data.rate.remaining),
      "X-RateLimit-Used": String(data.rate.used),
      "X-RateLimit-Reset": String(data.rate.reset),
      "X-RateLimit-Resource": "core",
    },
  });
}
