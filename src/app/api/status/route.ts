/**
 * GET /api/status
 * Returns aggregated telemetry statistics for the public status page.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getTelemetryStatus } from "@/lib/status.service";
import type { TelemetryStatusResponse } from "@/types/telemetry";
import type { ApiResponse } from "@/types/api";

/** Default time range: last 7 days */
const DEFAULT_DAYS = 7;

export async function GET(request: Request) {
  const { env } = getCloudflareContext();

  const url = new URL(request.url);
  const days = Math.min(
    Math.max(parseInt(url.searchParams.get("days") ?? String(DEFAULT_DAYS), 10) || DEFAULT_DAYS, 1),
    90,
  );

  // Service invocation
  const data: TelemetryStatusResponse = await getTelemetryStatus(env, days);

  const body: ApiResponse<TelemetryStatusResponse> = {
    success: true,
    data,
  };

  return Response.json(body, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
