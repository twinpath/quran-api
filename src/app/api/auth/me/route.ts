import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionFromToken, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 },
      );
    }

    const env = process.env as unknown as CloudflareEnv;
    const session = await getSessionFromToken(token, env);

    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { success: false, error: session.error || "Invalid session" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      user: session.user,
    });
  } catch (err) {
    console.error("Error fetching current user session:", err);
    return NextResponse.json(
      { success: false, error: "Failed to resolve session" },
      { status: 500 },
    );
  }
}
