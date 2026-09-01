import type { RateLimitResource } from "@/types/rate-limit";

/** GitHub-style rate limit tiers per resource */
export const RATE_LIMITS = {
  unauthenticated: {
    core: 60, // req/hour
    search: 10, // req/hour
  },
  authenticated: {
    core: 5000, // req/hour
    search: 30, // req/hour
  },
} as const;

/** Rate limit window TTL in seconds (1 hour = 3600 seconds) */
export const RATE_LIMIT_WINDOW_SECONDS = 3600;

/** Default primary resource */
export const DEFAULT_RATE_LIMIT_RESOURCE: RateLimitResource = "core";
