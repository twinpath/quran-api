/**
 * Centralized utility library for API latency measurement and formatting.
 * Strictly pure functions with no React or JSX dependencies.
 */

/**
 * Capture high-resolution start timestamp.
 */
export function getLatencyTimestamp(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

/**
 * Calculate elapsed latency in milliseconds given a start timestamp.
 */
export function calculateElapsedMs(startTimestamp: number): number {
  const current = getLatencyTimestamp();
  return Math.max(0, Math.round(current - startTimestamp));
}

/**
 * Format the Server-Timing HTTP response header value.
 */
export function formatServerTimingHeader(responseTimeMs: number): string {
  return `total;dur=${responseTimeMs}`;
}

/**
 * Extract physical HTTP network latency (responseEnd - requestStart) via W3C Resource Timing API in browser environment.
 */
export function extractNetworkLatencyMs(url: string): number | undefined {
  if (typeof window === "undefined" || typeof performance === "undefined" || typeof performance.getEntriesByName !== "function") {
    return undefined;
  }

  const entries = performance.getEntriesByName(url);
  if (entries.length === 0) return undefined;

  const lastEntry = entries[entries.length - 1] as PerformanceResourceTiming;
  if (lastEntry.responseEnd > 0 && lastEntry.requestStart > 0) {
    return Math.round(lastEntry.responseEnd - lastEntry.requestStart);
  }

  return undefined;
}

/**
 * Extract server-reported response time from API JSON response meta payload.
 */
export function extractServerLatencyMs(data: unknown): number | undefined {
  if (!data || typeof data !== "object") return undefined;
  const meta = (data as { meta?: { responseTimeMs?: unknown } }).meta;
  if (meta && typeof meta.responseTimeMs === "number" && !isNaN(meta.responseTimeMs)) {
    return meta.responseTimeMs;
  }
  return undefined;
}
