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
