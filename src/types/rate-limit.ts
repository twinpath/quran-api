/** Rate limit resource categories (GitHub-style) */
export type RateLimitResource = "core" | "search";

/** Result of a single resource rate limit check */
export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  used: number;
  reset: number; // UTC epoch seconds
  resource: RateLimitResource;
  authenticated: boolean;
}

/** Caller identity resolved from request */
export interface RateLimitIdentity {
  type: "ip" | "api_key";
  identifier: string;
  keyId?: string;
  authenticated: boolean;
}

/** Single resource status in /api/rate_limit response */
export interface RateLimitResourceStatus {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
  resource: RateLimitResource;
}

/** Full /api/rate_limit response body */
export interface RateLimitStatusResponse {
  resources: Record<RateLimitResource, RateLimitResourceStatus>;
  rate: RateLimitResourceStatus;
}
