/**
 * Lightweight user-agent parser.
 * Resolves device type, OS, and browser from the User-Agent header string.
 * No external dependencies - uses simple regex matching.
 */

import type { ParsedUserAgent } from "@/types/telemetry";

/**
 * Parse a User-Agent string into device, OS, and browser categories.
 */
export function parseUserAgent(ua: string | null): ParsedUserAgent {
  if (!ua) {
    return { deviceType: "Unknown", osType: "Unknown", browserType: "Unknown" };
  }

  return {
    deviceType: resolveDeviceType(ua),
    osType: resolveOsType(ua),
    browserType: resolveBrowserType(ua),
  };
}

function resolveDeviceType(ua: string): string {
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobile|iphone|ipod|android.*mobile|windows phone|blackberry/i.test(ua)) return "Mobile";
  if (/bot|crawl|spider|slurp|mediapartners/i.test(ua)) return "Bot";
  return "Desktop";
}

function resolveOsType(ua: string): string {
  if (/windows nt/i.test(ua)) return "Windows";
  if (/macintosh|mac os x/i.test(ua)) return "macOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/linux/i.test(ua)) return "Linux";
  if (/cros/i.test(ua)) return "ChromeOS";
  return "Other";
}

function resolveBrowserType(ua: string): string {
  // Order matters: check more specific browsers before generic ones
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/brave/i.test(ua)) return "Brave";
  if (/vivaldi/i.test(ua)) return "Vivaldi";
  if (/chrome|crios/i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/msie|trident/i.test(ua)) return "IE";
  return "Other";
}
