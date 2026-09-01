import { eq, and } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";

/**
 * Updates the lastUsedAt timestamp for a given API key hash in D1 database.
 * Fire-and-forget background helper.
 */
export async function updateApiKeyLastUsed(
  env: CloudflareEnv | undefined,
  keyHash: string,
): Promise<void> {
  try {
    const db = getDb(env);
    await db
      .update(apiKeys)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiKeys.keyHash, keyHash));
  } catch (err) {
    console.error("Error updating API key lastUsedAt in D1:", err);
  }
}

/**
 * Single Source of Truth for resolving the owning user ID of an active API key hash from D1 database.
 * Returns the userId if the key is valid and active, or null if unauthenticated/invalid.
 * Automatically touches lastUsedAt timestamp with 60-second write throttling.
 */
export async function getUserIdByApiKeyHash(
  env: CloudflareEnv | undefined,
  keyHash: string,
): Promise<string | null> {
  try {
    const db = getDb(env);
    const rows = await db
      .select({ userId: apiKeys.userId, lastUsedAt: apiKeys.lastUsedAt })
      .from(apiKeys)
      .where(and(eq(apiKeys.keyHash, keyHash), eq(apiKeys.status, "active")))
      .limit(1);

    if (rows.length > 0 && rows[0].userId) {
      const now = Date.now();
      const lastUsed = rows[0].lastUsedAt ? new Date(rows[0].lastUsedAt).getTime() : 0;

      // Write throttling: only update D1 if key was never used or if >60 seconds since last update
      if (now - lastUsed > 60000) {
        updateApiKeyLastUsed(env, keyHash).catch(() => {});
      }

      return rows[0].userId;
    }
  } catch (err) {
    console.error("D1 API key user lookup error:", err);
  }
  return null;
}

