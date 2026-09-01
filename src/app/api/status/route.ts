/**
 * GET /api/status
 * Returns aggregated telemetry statistics for the public status page.
 */

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sql } from "drizzle-orm";
import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { getDb } from "@/lib/db";
import { telemetryLogs } from "@/lib/db/schema";
import type {
  TelemetryOverview,
  TelemetryTimeseriesPoint,
  TelemetryDistributionItem,
  TelemetryLocationPoint,
  TelemetryStatusResponse,
} from "@/types/telemetry";
import type { ApiResponse } from "@/types/api";

/** Default time range: last 7 days */
const DEFAULT_DAYS = 7;

export async function GET(request: Request) {
  const { env } = getCloudflareContext();
  const db = getDb(env);

  const url = new URL(request.url);
  const days = Math.min(
    Math.max(parseInt(url.searchParams.get("days") ?? String(DEFAULT_DAYS), 10) || DEFAULT_DAYS, 1),
    90,
  );

  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const sinceTimestamp = Math.floor(sinceDate.getTime() / 1000);

  // Overview stats
  const overviewRows = await db
    .select({
      totalRequests: sql<number>`count(*)`,
      uniqueVisitors: sql<number>`count(distinct ${telemetryLogs.ipHash})`,
      errorCount: sql<number>`sum(case when ${telemetryLogs.statusCode} >= 400 then 1 else 0 end)`,
      avgResponseTimeMs: sql<number>`avg(${telemetryLogs.responseTimeMs})`,
    })
    .from(telemetryLogs)
    .where(sql`${telemetryLogs.createdAt} >= ${sinceTimestamp}`);

  const raw = overviewRows[0];
  const overview: TelemetryOverview = {
    totalRequests: Number(raw?.totalRequests ?? 0),
    uniqueVisitors: Number(raw?.uniqueVisitors ?? 0),
    errorCount: Number(raw?.errorCount ?? 0),
    successRate:
      Number(raw?.totalRequests ?? 0) > 0
        ? ((Number(raw?.totalRequests ?? 0) - Number(raw?.errorCount ?? 0)) /
            Number(raw?.totalRequests ?? 1)) *
          100
        : 100,
    avgResponseTimeMs: Math.round(Number(raw?.avgResponseTimeMs ?? 0)),
  };

  // Timeseries (grouped by hour for <= 3 days, by day otherwise)
  const groupByHour = days <= 3;
  const timeseriesRows = await db
    .select({
      bucket: groupByHour
        ? sql<string>`strftime('%Y-%m-%dT%H:00:00Z', ${telemetryLogs.createdAt}, 'unixepoch')`
        : sql<string>`strftime('%Y-%m-%dT00:00:00Z', ${telemetryLogs.createdAt}, 'unixepoch')`,
      requests: sql<number>`count(*)`,
      errors: sql<number>`sum(case when ${telemetryLogs.statusCode} >= 400 then 1 else 0 end)`,
      avgLatency: sql<number>`avg(${telemetryLogs.responseTimeMs})`,
    })
    .from(telemetryLogs)
    .where(sql`${telemetryLogs.createdAt} >= ${sinceTimestamp}`)
    .groupBy(
      groupByHour
        ? sql`strftime('%Y-%m-%dT%H:00:00Z', ${telemetryLogs.createdAt}, 'unixepoch')`
        : sql`strftime('%Y-%m-%dT00:00:00Z', ${telemetryLogs.createdAt}, 'unixepoch')`,
    )
    .orderBy(
      groupByHour
        ? sql`strftime('%Y-%m-%dT%H:00:00Z', ${telemetryLogs.createdAt}, 'unixepoch') asc`
        : sql`strftime('%Y-%m-%dT00:00:00Z', ${telemetryLogs.createdAt}, 'unixepoch') asc`,
    );

  const timeseries: TelemetryTimeseriesPoint[] = timeseriesRows.map((row) => ({
    timestamp: String(row.bucket),
    requests: Number(row.requests),
    errors: Number(row.errors ?? 0),
    avgLatency: Math.round(Number(row.avgLatency ?? 0)),
  }));

  // Distribution helper
  async function getDistribution(
    column: AnySQLiteColumn,
    limit = 20,
  ): Promise<TelemetryDistributionItem[]> {
    const rows = await db
      .select({
        name: column,
        count: sql<number>`count(*)`,
      })
      .from(telemetryLogs)
      .where(sql`${telemetryLogs.createdAt} >= ${sinceTimestamp} and ${column} is not null and ${column} != ''`)
      .groupBy(column)
      .orderBy(sql`count(*) desc`)
      .limit(limit);

    const total = rows.reduce((sum, r) => sum + Number(r.count), 0);
    return rows.map((row) => ({
      name: String(row.name ?? "Unknown"),
      count: Number(row.count),
      percentage: total > 0 ? Math.round((Number(row.count) / total) * 1000) / 10 : 0,
    }));
  }

  const [countries, regions, cities, devices, browsers, operatingSystems] = await Promise.all([
    getDistribution(telemetryLogs.country),
    getDistribution(telemetryLogs.region),
    getDistribution(telemetryLogs.city),
    getDistribution(telemetryLogs.deviceType),
    getDistribution(telemetryLogs.browserType),
    getDistribution(telemetryLogs.osType),
  ]);

  // Location points for the globe
  const locationRows = await db
    .select({
      latitude: telemetryLogs.latitude,
      longitude: telemetryLogs.longitude,
      country: telemetryLogs.country,
      city: telemetryLogs.city,
      count: sql<number>`count(*)`,
    })
    .from(telemetryLogs)
    .where(
      sql`${telemetryLogs.createdAt} >= ${sinceTimestamp} and ${telemetryLogs.latitude} is not null and ${telemetryLogs.longitude} is not null`,
    )
    .groupBy(telemetryLogs.latitude, telemetryLogs.longitude, telemetryLogs.country, telemetryLogs.city)
    .orderBy(sql`count(*) desc`)
    .limit(200);

  const locations: TelemetryLocationPoint[] = locationRows
    .filter((r) => r.latitude && r.longitude)
    .map((row) => ({
      latitude: parseFloat(String(row.latitude)),
      longitude: parseFloat(String(row.longitude)),
      country: String(row.country ?? ""),
      city: String(row.city ?? ""),
      count: Number(row.count),
    }));

  const data: TelemetryStatusResponse = {
    overview,
    timeseries,
    countries,
    regions,
    cities,
    devices,
    browsers,
    operatingSystems,
    locations,
    lastUpdated: new Date().toISOString(),
  };

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
