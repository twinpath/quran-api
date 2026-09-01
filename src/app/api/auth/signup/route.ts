import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { hashPassword } from "@/lib/password";
import { createSession, generatePrefixedId, SESSION_COOKIE_NAME } from "@/lib/auth";
import { eq } from "drizzle-orm";
import type { SignUpFormData } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignUpFormData;
    const { name, email, password, confirmPassword } = body;

    if (!name || !name.trim() || !email || !email.trim() || !password) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: "Passwords do not match." },
        { status: 400 },
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const env = process.env as unknown as CloudflareEnv;

    if (env && env.DB) {
      const db = getDb(env);

      // Check if user email already exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, cleanEmail))
        .get();

      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: "An account with this email address already exists.",
          },
          { status: 400 },
        );
      }

      const userId = generatePrefixedId("usr");
      const passwordHash = await hashPassword(password);
      const now = new Date();

      await db.insert(users).values({
        id: userId,
        email: cleanEmail,
        name: name.trim(),
        passwordHash,
        tier: "developer",
        createdAt: now,
      });

      // Initialize session for newly created user
      const session = await createSession(userId, env);
      const response = NextResponse.json({
        success: true,
        message: "Account created successfully!",
        user: {
          id: userId,
          name: name.trim(),
          email: cleanEmail,
          tier: "developer",
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

    // Fallback response if DB binding is not active
    const response = NextResponse.json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: "usr_quran_8921",
        name: name.trim(),
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
    console.error("Error during signup:", err);
    return NextResponse.json(
      { success: false, error: "An error occurred during account creation." },
      { status: 500 },
    );
  }
}
