import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { SESSION_COOKIE_NAME } from "@/constants";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * DELETE /api/account/delete
 * Authenticates user, verifies provided password, and permanently erases
 * user record, sessions, OAuth accounts, and API keys from Cloudflare D1 DB.
 */
export async function DELETE(request: Request) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { password?: string };
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required to confirm account deletion" },
        { status: 400 }
      );
    }

    // Verify password via Better Auth signInEmail API
    try {
      await auth.api.signInEmail({
        body: {
          email: session.user.email,
          password: password,
        },
      });
    } catch {
      return NextResponse.json(
        { error: "Invalid password. Account deletion cancelled." },
        { status: 400 }
      );
    }

    const db = getDb();
    const userId = session.user.id;

    // Delete related records in cascading order
    await db.delete(schema.apiKeys).where(eq(schema.apiKeys.userId, userId));
    await db.delete(schema.account).where(eq(schema.account.userId, userId));
    await db.delete(schema.session).where(eq(schema.session.userId, userId));
    await db.delete(schema.user).where(eq(schema.user.id, userId));

    const response = NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });

    // Clear session cookies
    response.cookies.delete(SESSION_COOKIE_NAME);
    response.cookies.delete(`__Secure-${SESSION_COOKIE_NAME}`);

    return response;
  } catch (err) {
    console.error("Delete account API error:", err);
    return NextResponse.json(
      { error: "An error occurred while deleting account" },
      { status: 500 }
    );
  }
}
