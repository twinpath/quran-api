import { API_KEY_PREFIX } from "@/constants/api-key";
import type { ApiKeyValidationResult } from "@/types/api-key";

/**
 * Encodes a string into a Uint8Array buffer.
 */
function encodeText(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

/**
 * Converts an ArrayBuffer to a lower-case hexadecimal string.
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generates a SHA-256 hex hash of the given raw API key using Web Crypto API.
 * Edge-compatible across Node.js 22 and Cloudflare Workers.
 */
export async function hashApiKey(rawKey: string): Promise<string> {
  const data = encodeText(rawKey.trim());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return bufferToHex(hashBuffer);
}


/**
 * Generates a new secure random API key with prefix `qr_live_` + 32-byte hex string.
 * Format example: `qr_live_a1b2c3d4e5f6...`
 */
export function generateApiKey(): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  const hex = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${API_KEY_PREFIX}${hex}`;
}

/**
 * Masks an API key for safe client-side display.
 * Example: `qr_live_a1b2...c3d4`
 */
export function maskApiKey(rawOrPrefixedKey: string): string {
  if (!rawOrPrefixedKey || rawOrPrefixedKey.length < 12) {
    return rawOrPrefixedKey;
  }
  const prefixLength = rawOrPrefixedKey.startsWith(API_KEY_PREFIX)
    ? API_KEY_PREFIX.length
    : 0;
  const body = rawOrPrefixedKey.slice(prefixLength);
  const firstFour = body.slice(0, 4);
  const lastFour = body.slice(-4);
  return `${API_KEY_PREFIX}${firstFour}...${lastFour}`;
}

/**
 * Verifies if an incoming raw key matches a stored SHA-256 hash.
 */
export async function verifyApiKey(
  inputRawKey: string,
  storedKeyHash: string,
): Promise<ApiKeyValidationResult> {
  if (!inputRawKey || !storedKeyHash) {
    return { valid: false, error: "Missing API key or target hash" };
  }

  const computedHash = await hashApiKey(inputRawKey);
  if (computedHash === storedKeyHash) {
    return { valid: true };
  }

  return { valid: false, error: "Invalid API key" };
}

/**
 * Calculates the expiration Date based on selected ExpirationOption or custom days.
 */
export function calculateExpirationDate(
  option: string,
  customDays?: number,
): Date | null {
  if (option === "never" || !option) {
    return null;
  }

  let days = 30;
  if (option === "7d") days = 7;
  else if (option === "30d") days = 30;
  else if (option === "60d") days = 60;
  else if (option === "90d") days = 90;
  else if (option === "365d") days = 365;
  else if (option === "custom" && customDays && customDays > 0) days = customDays;

  const now = new Date();
  now.setDate(now.getDate() + days);
  return now;
}

/**
 * Formats expiration timestamp into human readable label and checks if expired.
 */
export function formatExpirationLabel(expiresAt?: Date | string | null): {
  label: string;
  isExpired: boolean;
} {
  if (!expiresAt) {
    return { label: "No expiration", isExpired: false };
  }

  const expDate = new Date(expiresAt);
  const now = new Date();

  if (expDate.getTime() <= now.getTime()) {
    return {
      label: `Expired on ${expDate.toISOString().split("T")[0]}`,
      isExpired: true,
    };
  }

  const diffMs = expDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return { label: "Expires in 1 day", isExpired: false };
  }

  return { label: `Expires in ${diffDays} days`, isExpired: false };
}

