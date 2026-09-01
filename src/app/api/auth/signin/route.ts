import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/password";
import { createSession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { eq } from "drizzle-orm";
import type { SignInFormData } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignInFormData;
    const { email, password } = body;

    if (!email || !email.trim() || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter both email and password." },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const env = process.env as unknown as CloudflareEnv;

    if (env && env.DB) {
      const db = getDb(env);

      const userRecord = await db
        .select()
        .from(users)
        .where(eq(users.email, cleanEmail))
        .get();

      if (!userRecord || !userRecord.passwordHash) {
        return NextResponse.json(
          { success: false, error: "Invalid email address or password." },
          { status: 401 },
        );
      }

      const isValidPassword = await verifyPassword(
        password,
        userRecord.passwordHash,
      );

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: "Invalid email address or password." },
          { status: 401 },
        );
      }

      const session = await createSession(userRecord.id, env);
      const response = NextResponse.json({
        success: true,
        message: "Signed in successfully!",
        user: {
          id: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          tier: userRecord.tier,
        },
      });

      if (session) {
        response.cookies.set(SESSION_COOKIE_NAME, session.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          expires: session.expiresAt,
        });
      }

      return response;
    }

    // Fallback sign in response when DB binding is absent
    const response = NextResponse.json({
      success: true,
      message: "Signed in successfully!",
      user: {
        id: "usr_quran_8921",
        name: "Twinpath Developer",
        email: cleanEmail,
        tier: "developer",
      },
    });

    response.cookies.set(SESSION_COOKIE_NAME, "mock_session_token_dev", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Error during signin:", err);
    return NextResponse.json(
      { success: false, error: "An error occurred during authentication." },
      { status: 500 },
    );
  }
}
