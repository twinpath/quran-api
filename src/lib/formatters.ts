/**
 * Pad a surah number to 3 digits (e.g. 1 -> "001", 12 -> "012", 114 -> "114").
 */
export function padSurahNumber(num: number): string {
  return String(num).padStart(3, "0");
}

/**
 * Format a byte count to a human-readable string (e.g. 1024 -> "1.0 KB").
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format latency in milliseconds to a display string.
 */
export function formatLatency(ms: number): string {
  if (ms < 1) return "<1ms";
  return `${Math.round(ms)}ms`;
}

/**
 * Truncate text to a maximum length with an ellipsis.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

/**
 * Convert a western numeral to Eastern Arabic numeral string.
 */
export function toArabicNumeral(num: number): string {
  const arabicDigits = ["\u0660", "\u0661", "\u0662", "\u0663", "\u0664", "\u0665", "\u0666", "\u0667", "\u0668", "\u0669"];
  return String(num)
    .split("")
    .map((d) => arabicDigits[parseInt(d, 10)] ?? d)
    .join("");
}

/**
 * Format a number with comma separators (e.g. 6236 -> "6,236").
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("en-US");
}
