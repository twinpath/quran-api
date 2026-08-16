/** Static constants for the public status page */

export const STATUS_SITE_METADATA = {
  title: "API Status & Telemetry",
  description:
    "Real-time operational metrics, uptime status, latency trends, and global request statistics for the Al-Quran REST API.",
};

export const STATUS_REFRESH_INTERVAL_MS = 60000; // 1 minute auto-refresh

export const TIME_RANGE_OPTIONS = [
  { label: "Last 24 Hours", value: "1" },
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
];
