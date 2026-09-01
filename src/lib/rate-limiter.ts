/**
 * GitHub-style KV-based rate limiter for API endpoints.
 * Supports dual identity (IP & API Key), hourly reset windows,
 * resource-based quotas (core & search), and rate limit status introspection.
 */

import { RATE_LIMITS, RATE_LIMIT_WINDOW_SECONDS } from "@/constants/rate-limit";
import type {
  RateLimitResult,
  RateLimitIdentity,
  RateLimitResource,
  RateLimitStatusResponse,
} from "@/types/rate-limit";

/**
 * Hash a string (IP address or API key) using SHA-256 for privacy and key safety.
 */
async function hashString(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Get current hourly window key string (e.g., "2026090103").
 */
function getHourWindowKey(now: Date = new Date()): string {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const date = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  return `${year}${month}${date}${hours}`;
}

/**
 * Get UTC epoch timestamp (in seconds) for when the current hourly window resets.
 */
function getResetEpochSeconds(now: Date = new Date()): number {
  const nextHour = new Date(now);
  nextHour.setUTCMinutes(0, 0, 0);
  nextHour.setUTCHours(nextHour.getUTCHours() + 1);
  return Math.floor(nextHour.getTime() / 1000);
}

/**
 * Extract and resolve the caller identity (IP, API Key, or User) from a request.
 */
export async function resolveIdentity(
  request: Request,
  db?: D1Database,
): Promise<RateLimitIdentity> {
  const url = new URL(request.url);
  const apiKeyHeader = request.headers.get("X-API-Key");
  const apiKeyQuery = url.searchParams.get("api_key");
  const apiKey = apiKeyHeader?.trim() || apiKeyQuery?.trim();

  // If API Key is provided, validate key format / presence
  if (apiKey) {
    const keyHash = await hashString(apiKey);
    // Valid keys: any key starting with "qr_live_", "quran_live_", or "test_"
    const isValidKey =
      apiKey.startsWith("qr_live_") ||
      apiKey.startsWith("quran_live_") ||
      apiKey.startsWith("test_");

    if (isValidKey) {
      let userId: string | undefined;
      if (db) {
        try {
          const row = await db
            .prepare("SELECT user_id FROM api_keys WHERE key_hash = ? AND status = 'active' LIMIT 1")
            .bind(keyHash)
            .first<{ user_id: string }>();
          if (row?.user_id) {
            userId = row.user_id;
          }
        } catch {
          // Fall back to keyHash identifier if DB lookup fails
        }
      }

      if (userId) {
        return {
          type: "user",
          identifier: userId,
          userId,
          keyId: apiKey.substring(0, 15),
          authenticated: true,
        };
      }

      return {
        type: "api_key",
        identifier: keyHash,
        keyId: apiKey.substring(0, 15),
        authenticated: true,
      };
    }
  }

  // Fallback to IP address identity
  const ip = request.headers.get("cf-connecting-ip") ?? "127.0.0.1";
  const ipHash = await hashString(ip);
  return {
    type: "ip",
    identifier: ipHash,
    authenticated: false,
  };
}

/**
 * Check and increment the rate limit counter for a request.
 */
export async function checkRateLimit(
  kv: KVNamespace | undefined,
  identity: RateLimitIdentity,
  resource: RateLimitResource = "core",
): Promise<RateLimitResult> {
  const now = new Date();
  const reset = getResetEpochSeconds(now);
  const tier = identity.authenticated ? "authenticated" : "unauthenticated";
  const limit = RATE_LIMITS[tier][resource];

  // If KV is not available (e.g. mock/build time), return permissive result
  if (!kv) {
    return {
      allowed: true,
      limit,
      remaining: limit - 1,
      used: 1,
      reset,
      resource,
      authenticated: identity.authenticated,
    };
  }

  const windowKey = getHourWindowKey(now);
  const kvKey = `rl:${identity.type}:${identity.identifier}:${resource}:${windowKey}`;

  const currentStr = await kv.get(kvKey);
  const current = currentStr ? parseInt(currentStr, 10) : 0;

  if (current >= limit) {
    return {
      allowed: false,
      limit,
      remaining: 0,
      used: current,
      reset,
      resource,
      authenticated: identity.authenticated,
    };
  }

  const next = current + 1;
  await kv.put(kvKey, String(next), {
    expirationTtl: RATE_LIMIT_WINDOW_SECONDS,
  });

  return {
    allowed: true,
    limit,
    remaining: limit - next,
    used: next,
    reset,
    resource,
    authenticated: identity.authenticated,
  };
}

/**
 * Read-only rate limit status check (does NOT increment quota cost).
 * Used for /api/rate_limit endpoint and client-side quota views.
 */
export async function getRateLimitStatus(
  kv: KVNamespace | undefined,
  identity: RateLimitIdentity,
): Promise<RateLimitStatusResponse> {
  const now = new Date();
  const reset = getResetEpochSeconds(now);
  const tier = identity.authenticated ? "authenticated" : "unauthenticated";
  const windowKey = getHourWindowKey(now);

  const fetchResourceStatus = async (resource: RateLimitResource) => {
    const limit = RATE_LIMITS[tier][resource];
    if (!kv) {
      return { limit, remaining: limit, used: 0, reset, resource };
    }

    const kvKey = `rl:${identity.type}:${identity.identifier}:${resource}:${windowKey}`;
    const currentStr = await kv.get(kvKey);
    const used = currentStr ? parseInt(currentStr, 10) : 0;
    const remaining = Math.max(0, limit - used);

    return { limit, remaining, used, reset, resource };
  };

  const coreStatus = await fetchResourceStatus("core");
  const searchStatus = await fetchResourceStatus("search");

  return {
    resources: {
      core: coreStatus,
      search: searchStatus,
    },
    rate: coreStatus,
  };
}

/**
 * Read-only rate limit status check directly for a specific user account ID.
 */
export async function getAccountRateLimitStatus(
  kv: KVNamespace | undefined,
  userId: string,
): Promise<RateLimitStatusResponse> {
  const identity: RateLimitIdentity = {
    type: "user",
    identifier: userId,
    userId,
    authenticated: true,
  };
  return getRateLimitStatus(kv, identity);
}

/**
 * Build standard GitHub-style rate limit response headers.
 */
export function rateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Used": String(result.used),
    "X-RateLimit-Reset": String(result.reset),
    "X-RateLimit-Resource": result.resource,
  };
}
