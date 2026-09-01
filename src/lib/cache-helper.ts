/**
 * KV-based read-through cache helper for API responses.
 * Stores serialized JSON with configurable TTL.
 */

/** Default cache TTL: 7 days (data Quran rarely changes) */
const DEFAULT_CACHE_TTL_SECONDS = 604800;

/**
 * Build a namespaced cache key for an API endpoint path.
 */
export function buildCacheKey(path: string): string {
  return `cache:api:${path.replace(/\//g, ":")}`;
}

/** Cache retrieval result */
export interface CacheResult<T> {
  hit: boolean;
  data: T | null;
}

/**
 * Attempt to get cached data from KV.
 * Returns { hit: true, data } on cache hit, or { hit: false, data: null } on miss.
 */
export async function getFromCache<T>(
  kv: KVNamespace | undefined | null,
  path: string,
): Promise<CacheResult<T>> {
  if (!kv) {
    return { hit: false, data: null };
  }
  const key = buildCacheKey(path);
  const raw = await kv.get(key);

  if (raw === null) {
    return { hit: false, data: null };
  }

  return { hit: true, data: JSON.parse(raw) as T };
}

/**
 * Store data in KV cache with TTL.
 */
export async function putInCache<T>(
  kv: KVNamespace | undefined | null,
  path: string,
  data: T,
  ttlSeconds: number = DEFAULT_CACHE_TTL_SECONDS,
): Promise<void> {
  if (!kv) return;
  const key = buildCacheKey(path);
  await kv.put(key, JSON.stringify(data), { expirationTtl: ttlSeconds });
}

/**
 * Invalidate a cached entry.
 */
export async function invalidateCache(
  kv: KVNamespace | undefined | null,
  path: string,
): Promise<void> {
  if (!kv) return;
  const key = buildCacheKey(path);
  await kv.delete(key);
}
