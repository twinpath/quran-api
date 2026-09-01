/**
 * API Key Domain Constants
 */

/** Key prefix for live production API keys */
export const API_KEY_PREFIX = "qr_live_";

/** Hashing algorithm used for storing API keys securely */
export const API_KEY_HASH_ALGORITHM = "SHA-256";

/** Maximum number of active API keys per developer account */
export const MAX_KEYS_PER_USER = 5;

/** Default rate limit quota for developer tier (5,000 req/hour) */
export const DEFAULT_DEVELOPER_RATE_LIMIT = 5000;

/** API Key Expiration options */
export const EXPIRATION_OPTIONS = [
  { value: "7d", label: "7 days", days: 7 },
  { value: "30d", label: "30 days", days: 30 },
  { value: "60d", label: "60 days", days: 60 },
  { value: "90d", label: "90 days", days: 90 },
  { value: "365d", label: "1 year (365 days)", days: 365 },
  { value: "custom", label: "Custom days", days: 0 },
  { value: "never", label: "No expiration", days: null },
] as const;

