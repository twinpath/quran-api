/**
 * Telemetry logging utility.
 * Records API request metrics to D1 for analytics and monitoring.
 */

import { getDb } from "@/lib/db";
import { telemetryLogs } from "@/lib/db/schema";
import { parseUserAgent } from "@/lib/ua";

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
  request: Request,
  endpoint: string,
  statusCode: number,
  responseTimeMs: number,
): Promise<void> {
  try {
    const db = getDb(env);
    const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
    const ipHash = await hashIpForTelemetry(ip);

    // Cloudflare geo headers
    const country = request.headers.get("cf-ipcountry") ?? null;
    const region = request.headers.get("cf-region") ?? null;
    const city = request.headers.get("cf-ipcity") ?? null;
    const latitude = request.headers.get("cf-iplatitude") ?? null;
    const longitude = request.headers.get("cf-iplongitude") ?? null;

    // User-agent parsing
    const userAgentString = request.headers.get("user-agent") ?? null;
    const parsed = parseUserAgent(userAgentString);

    await db.insert(telemetryLogs).values({
      endpoint,
      ipHash,
      statusCode,
      responseTimeMs,
      country,
      region,
      city,
      latitude,
      longitude,
      userAgent: userAgentString,
      deviceType: parsed.deviceType,
      osType: parsed.osType,
      browserType: parsed.browserType,
      createdAt: new Date(),
    });
  } catch {
    // Silently fail - telemetry should never block an API response
  }
}
