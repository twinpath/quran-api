import { getDb } from "@/lib/db";
import { users, sessions } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

export const SESSION_COOKIE_NAME = "quran_session";
export const SESSION_EXPIRY_DAYS = 30;

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  tier: string;
  googleConnected: boolean;
  googleEmail?: string | null;
  avatarUrl?: string | null;
  createdAt?: string | null;
}

export interface SessionResult {
  authenticated: boolean;
  user?: SessionUser | null;
  token?: string;
  error?: string | null;
}

/**
 * Generates a prefixed UUID string for user, session, or key IDs.
 * Examples: `usr_9b1deb4d...`, `ses_a1b2c3d4...`
 */
export function generatePrefixedId(prefix: "usr" | "ses" | "key"): string {
  const uuid = crypto.randomUUID();
  return `${prefix}_${uuid}`;
}

/**
 * Generates a secure 32-byte hex token string for session cookies.
 */
export function generateSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Creates a new session record in D1 for the given user.
 */
export async function createSession(
  userId: string,
  env?: CloudflareEnv,
): Promise<{ token: string; expiresAt: Date } | null> {
  const token = generateSessionToken();
  const sessionId = generatePrefixedId("ses");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);

  if (!env || !env.DB) {
    return { token, expiresAt };
  }

  try {
    const db = getDb(env);
    await db.insert(sessions).values({
      id: sessionId,
      userId,
      token,
      expiresAt,
      createdAt: now,
    });
    return { token, expiresAt };
  } catch (err) {
    console.error("Error creating session in D1:", err);
    return null;
  }
}

/**
 * Revokes a session token by deleting it from D1 database.
 */
export async function revokeSession(
  token: string,
  env?: CloudflareEnv,
): Promise<boolean> {
  if (!token || !env || !env.DB) {
    return true;
  }
  try {
    const db = getDb(env);
    await db.delete(sessions).where(eq(sessions.token, token));
    return true;
  } catch (err) {
    console.error("Error revoking session in D1:", err);
    return false;
  }
}

/**
 * Validates a session token against the D1 database.
 */
export async function getSessionFromToken(
  token: string,
  env?: CloudflareEnv,
): Promise<SessionResult> {
  if (!token) {
    return { authenticated: false };
  }

  if (!env || !env.DB) {
    // Fallback developer user when DB binding is absent
    return {
      authenticated: true,
      token,
      user: {
        id: "usr_quran_8921",
        email: "developer@twinpath.id",
        name: "Twinpath Developer",
        tier: "developer",
        googleConnected: true,
        googleEmail: "developer@gmail.com",
        avatarUrl: null,
        createdAt: "2026-08-01",
      },
    };
  }

  try {
    const db = getDb(env);
    const now = new Date();

    const result = await db
      .select({
        session: sessions,
        user: users,
      })
      .from(sessions)
      .innerJoin(users, eq(sessions.userId, users.id))
      .where(and(eq(sessions.token, token), gt(sessions.expiresAt, now)))
      .get();

    if (!result || !result.user) {
      return { authenticated: false, error: "Session expired or invalid" };
    }

    return {
      authenticated: true,
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        tier: result.user.tier,
        googleConnected: Boolean(result.user.googleId),
        googleEmail: result.user.googleEmail,
        avatarUrl: result.user.avatarUrl,
        createdAt: result.user.createdAt
          ? new Date(result.user.createdAt).toISOString().split("T")[0]
          : null,
      },
    };
  } catch (err) {
    console.error("Error validating session in D1:", err);
    return { authenticated: false, error: "Database session validation failed" };
  }
}
