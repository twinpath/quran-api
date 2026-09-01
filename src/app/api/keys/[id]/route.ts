import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { apiKeys } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * DELETE /api/keys/[id]
 * Revoke or delete an API key by ID.
 */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  const mockUserId = "usr_quran_8921";

  if (!id) {
    return NextResponse.json(
      { success: false, error: "API key ID is required" },
      { status: 400 },
    );
  }

  try {
    const env = process.env as unknown as CloudflareEnv;
    if (env && env.DB) {
      const db = getDb(env);
      await db
        .update(apiKeys)
        .set({ status: "revoked" })
        .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, mockUserId)));
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
