import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeSession, SESSION_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    const env = process.env as unknown as CloudflareEnv;
    if (token) {
      await revokeSession(token, env);
    }

    const response = NextResponse.json({
      success: true,
      message: "Signed out successfully",
    });

    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  } catch (err) {
    console.error("Error during signout:", err);
    return NextResponse.json(
      { success: false, error: "Failed to sign out" },
      { status: 500 },
    );
  }
}
