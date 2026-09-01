import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { getAuth } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface RouteParams {
  params: Promise<{ id: string }>;
}

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
 * PATCH /api/keys/[id]
 * Revoke an active API key by ID (sets status to 'revoked').
 */
export async function PATCH(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "API key ID is required" },
      { status: 400 },
    );
  }

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
    if (env && env.DB) {
      const db = getDb(env);
      await db
        .update(apiKeys)
        .set({ status: "revoked" })
        .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));
    }

    return NextResponse.json({
      success: true,
      message: `API key ${id} revoked successfully`,
      id,
    });
  } catch (err) {
    console.error("Error revoking API key:", err);
    return NextResponse.json(
      { success: false, error: "Failed to revoke API key" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/keys/[id]
 * Hard delete an API key by ID (permanently removes row from database).
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { success: false, error: "API key ID is required" },
      { status: 400 },
    );
  }

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
    if (env && env.DB) {
      const db = getDb(env);
      await db
        .delete(apiKeys)
        .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));
    }

    return NextResponse.json({
      success: true,
      message: `API key ${id} deleted successfully`,
      id,
    });
  } catch (err) {
    console.error("Error deleting API key:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete API key" },
      { status: 500 },
    );
  }
}
