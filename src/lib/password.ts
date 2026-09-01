/**
 * Web Crypto PBKDF2-SHA256 password hashing & verification.
 * 100% Edge-compatible for Node.js 22 and Cloudflare Workers runtime.
 */

const PBKDF2_ITERATIONS = 100000;
const HASH_LENGTH = 32; // 256 bits

/**
 * Converts ArrayBuffer to hex string.
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Converts hex string back to Uint8Array.
 */
function hexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Hashes a plain-text password using PBKDF2 with SHA-256 and a 16-byte random salt.
 * Returns formatted hash string: `pbkdf2:salt_hex:hash_hex`
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(plainPassword),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    HASH_LENGTH * 8,
  );

  const saltHex = bufferToHex(salt.buffer as ArrayBuffer);
  const hashHex = bufferToHex(derivedBits);
  return `pbkdf2:${saltHex}:${hashHex}`;
}

/**
 * Verifies a plain-text password against a stored PBKDF2 formatted hash string.
 */
export async function verifyPassword(
  plainPassword: string,
  storedHashString: string,
): Promise<boolean> {
  if (!plainPassword || !storedHashString) {
    return false;
  }

  const parts = storedHashString.split(":");
  if (parts.length !== 3 || parts[0] !== "pbkdf2") {
    return false;
  }

  const [, saltHex, targetHashHex] = parts;
  const salt = hexToBuffer(saltHex);

  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(plainPassword),
    "PBKDF2",
    false,
    ["deriveBits"],
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    HASH_LENGTH * 8,
  );

  const computedHashHex = bufferToHex(derivedBits);
  return computedHashHex === targetHashHex;
}
