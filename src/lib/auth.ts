import { getDb } from "@/lib/db";
import { users, sessions } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  tier: string;
  googleConnected: boolean;
  googleEmail?: string | null;
  avatarUrl?: string | null;
}

export interface SessionResult {
  authenticated: boolean;
  user?: SessionUser | null;
  error?: string | null;
}

/**
 * Generates a prefixed UUID string for user or session IDs.
 * Examples: `usr_9b1deb4d...`, `ses_a1b2c3d4...`
 */
export function generatePrefixedId(prefix: "usr" | "ses" | "key"): string {
  const uuid = crypto.randomUUID();
  return `${prefix}_${uuid}`;
}

/**
 * Validates a session token against the D1 database.
 */
export async function getSessionFromToken(
  token: string,
  env?: CloudflareEnv,
): Promise<SessionResult> {
  if (!token || !env || !env.DB) {
    return { authenticated: false };
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
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        tier: result.user.tier,
        googleConnected: Boolean(result.user.googleId),
        googleEmail: result.user.googleEmail,
        avatarUrl: result.user.avatarUrl,
      },
    };
  } catch (err) {
    console.error("Error validating session in D1:", err);
    return { authenticated: false, error: "Database session validation failed" };
  }
}
