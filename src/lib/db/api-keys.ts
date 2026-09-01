import { eq, and } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";

/**
 * Single Source of Truth for resolving the owning user ID of an active API key hash from D1 database.
 * Returns the userId if the key is valid and active, or null if unauthenticated/invalid.
 */
export async function getUserIdByApiKeyHash(
  env: CloudflareEnv | undefined,
  keyHash: string,
): Promise<string | null> {
  try {
    const db = getDb(env);
    const rows = await db
      .select({ userId: apiKeys.userId })
      .from(apiKeys)
      .where(and(eq(apiKeys.keyHash, keyHash), eq(apiKeys.status, "active")))
      .limit(1);

    if (rows.length > 0 && rows[0].userId) {
      return rows[0].userId;
    }
  } catch (err) {
    console.error("D1 API key user lookup error:", err);
  }
  return null;
}
