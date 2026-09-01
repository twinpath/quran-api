import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";

/**
 * POST /api/account/set-password
 * Allows authenticated users (e.g. Google OAuth signups without a credential password)
 * to set an initial password, creating a linked credential account in D1 DB.
 */
export async function POST(request: Request) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { newPassword?: string };
    const { newPassword } = body;

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    await auth.api.setPassword({
      body: {
        newPassword,
      },
      headers: request.headers,
    });

    return NextResponse.json({
      success: true,
      message: "Password set successfully",
    });
  } catch (err: unknown) {
    console.error("Set password API error:", err);
    const errorMessage = err instanceof Error ? err.message : "An error occurred while setting password";
    return NextResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }
}
