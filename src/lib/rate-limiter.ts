/**
 * KV-based rate limiter for API endpoints.
 * Uses per-minute time windows with automatic TTL expiry.
 */

/** Default rate limit: 60 requests per minute */
const DEFAULT_MAX_REQUESTS = 60;

/** TTL in seconds for rate limit keys (auto-expire after 60s) */
const RATE_LIMIT_TTL_SECONDS = 60;

/**
 * Hash an IP address using SHA-256 for privacy.
 * We never store raw IP addresses in KV.
 */
async function hashIp(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Get the current time window key (minute-level granularity).
 */
function getWindowKey(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(now.getUTCDate()).padStart(2, "0")}${String(now.getUTCHours()).padStart(2, "0")}${String(now.getUTCMinutes()).padStart(2, "0")}`;
}

/** Result of a rate limit check */
export interface RateLimitResult {
  allowed: boolean;
  current: number;
  limit: number;
  remaining: number;
}

/**
 * Check and increment the rate limit counter for a given IP.
 * Returns whether the request is allowed and remaining quota.
 */
export async function checkRateLimit(
  kv: KVNamespace,
  ip: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS,
): Promise<RateLimitResult> {
  const ipHash = await hashIp(ip);
  const window = getWindowKey();
  const key = `ratelimit:${ipHash}:${window}`;

  const currentStr = await kv.get(key);
  const current = currentStr ? parseInt(currentStr, 10) : 0;

  if (current >= maxRequests) {
    return {
      allowed: false,
      current,
      limit: maxRequests,
      remaining: 0,
    };
  }

  const next = current + 1;
  await kv.put(key, String(next), { expirationTtl: RATE_LIMIT_TTL_SECONDS });

  return {
    allowed: true,
    current: next,
    limit: maxRequests,
    remaining: maxRequests - next,
  };
}

/**
 * Build standard rate limit headers for an API response.
 */
export function rateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(RATE_LIMIT_TTL_SECONDS),
  };
}
