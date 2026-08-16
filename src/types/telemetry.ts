/** Parsed user-agent result */
export interface ParsedUserAgent {
  deviceType: string;
  osType: string;
  browserType: string;
}

/** Aggregated overview stats for the status page */
export interface TelemetryOverview {
  totalRequests: number;
  uniqueVisitors: number;
  successRate: number;
  avgResponseTimeMs: number;
  errorCount: number;
}

/** Single data point for the trend timeseries chart */
export interface TelemetryTimeseriesPoint {
  timestamp: string;
  requests: number;
  errors: number;
  avgLatency: number;
}

/** Distribution entry for category breakdown (country, browser, etc.) */
export interface TelemetryDistributionItem {
  name: string;
  count: number;
  percentage: number;
}

/** Location entry with coordinates for the globe visualization */
export interface TelemetryLocationPoint {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  count: number;
}

/** Full API response shape for GET /api/status */
export interface TelemetryStatusResponse {
  overview: TelemetryOverview;
  timeseries: TelemetryTimeseriesPoint[];
  countries: TelemetryDistributionItem[];
  regions: TelemetryDistributionItem[];
  cities: TelemetryDistributionItem[];
  devices: TelemetryDistributionItem[];
  browsers: TelemetryDistributionItem[];
  operatingSystems: TelemetryDistributionItem[];
  locations: TelemetryLocationPoint[];
  lastUpdated: string;
}
