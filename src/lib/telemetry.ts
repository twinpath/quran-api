/**
 * Telemetry logging utility.
 * Records API request metrics to D1 for analytics and monitoring.
 */

import { getDb } from "@/lib/db";
import { telemetryLogs } from "@/lib/db/schema";

/**
 * Hash an IP address for privacy-safe storage.
 */
async function hashIpForTelemetry(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes.slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Log a telemetry event to D1.
 * This is fire-and-forget; errors are silently caught to avoid
 * disrupting the main API response.
 */
export async function logTelemetry(
  env: CloudflareEnv,
  endpoint: string,
  ip: string,
  statusCode: number,
  responseTimeMs: number,
): Promise<void> {
  try {
    const db = getDb(env);
    const ipHash = await hashIpForTelemetry(ip);

    await db.insert(telemetryLogs).values({
      endpoint,
      ipHash,
      statusCode,
      responseTimeMs,
      createdAt: new Date(),
    });
  } catch {
    // Silently fail - telemetry should never block an API response
  }
}
