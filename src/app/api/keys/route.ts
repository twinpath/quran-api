import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { generateApiKey, hashApiKey, maskApiKey } from "@/lib/api-key";
import { generatePrefixedId, getAuth } from "@/lib/auth";
import { API_KEY_PREFIX, DEFAULT_DEVELOPER_RATE_LIMIT, MAX_KEYS_PER_USER } from "@/constants/api-key";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CreateApiKeyPayload } from "@/types/api-key";
import type { ApiKeyItem } from "@/types/account";

/**
 * Resolves the authenticated user ID from the Better Auth session cookie.
 * Returns null if no valid session exists.
 */
async function getSessionUserId(env?: CloudflareEnv): Promise<string | null> {
  try {
    const auth = getAuth(env);
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * GET /api/keys
 * List active and revoked API keys for the current authenticated user.
 */
export async function GET() {
  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env;
  } catch {
    env = process.env as unknown as CloudflareEnv;
  }

  const userId = await getSessionUserId(env);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    if (!env || !env.DB) {
      return NextResponse.json({ success: true, data: [] });
    }

    const db = getDb(env);
    const dbKeys = await db
      .select()
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))
      .all();

    const formattedKeys: ApiKeyItem[] = dbKeys.map((k) => ({
      id: k.id,
      name: k.name,
      keyMasked: `${k.keyPrefix}${k.keyHash.substring(0, 4)}...${k.keyHash.substring(k.keyHash.length - 4)}`,
      createdAt: k.createdAt ? new Date(k.createdAt).toISOString().split("T")[0] : "Recently",
      lastUsed: k.lastUsedAt ? new Date(k.lastUsedAt).toISOString() : "Never",
      status: (k.status as "active" | "revoked" | "expired") || "active",
      rateLimit: `${k.rateLimit.toLocaleString()} req/hour`,
    }));

    return NextResponse.json({ success: true, data: formattedKeys });
  } catch (err) {
    console.error("Error fetching API keys:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch API keys" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/keys
 * Create a new API Key, return raw key ONCE to the user, and store SHA-256 hash in D1.
 */
export async function POST(request: Request) {
  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env;
  } catch {
    env = process.env as unknown as CloudflareEnv;
  }

  const userId = await getSessionUserId(env);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as CreateApiKeyPayload;
    if (!body || !body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: "API key name is required" },
        { status: 400 },
      );
    }

    const rawKey = generateApiKey();
    const keyHash = await hashApiKey(rawKey);
    const keyMasked = maskApiKey(rawKey);
    const keyId = generatePrefixedId("key");
    const now = new Date();

    if (env && env.DB) {
      const db = getDb(env);

      // Check max key count limit
      const existingKeys = await db
        .select()
        .from(apiKeys)
        .where(eq(apiKeys.userId, userId))
        .all();

      const activeKeysCount = existingKeys.filter((k) => k.status === "active").length;
      if (activeKeysCount >= MAX_KEYS_PER_USER) {
        return NextResponse.json(
          {
            success: false,
            error: `Maximum limit of ${MAX_KEYS_PER_USER} active API keys reached.`,
          },
          { status: 400 },
        );
      }

      await db.insert(apiKeys).values({
        id: keyId,
        userId,
        name: body.name.trim(),
        keyPrefix: API_KEY_PREFIX,
        keyHash,
        status: "active",
        rateLimit: DEFAULT_DEVELOPER_RATE_LIMIT,
        createdAt: now,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: keyId,
        name: body.name.trim(),
        rawKey,
        keyPrefix: API_KEY_PREFIX,
        keyMasked,
        rateLimit: `${DEFAULT_DEVELOPER_RATE_LIMIT.toLocaleString()} req/hour`,
        createdAt: now.toISOString().split("T")[0],
        status: "active",
      },
    });
  } catch (err) {
    console.error("Error creating API key:", err);
    return NextResponse.json(
      { success: false, error: "Failed to create API key" },
      { status: 500 },
    );
  }
}
