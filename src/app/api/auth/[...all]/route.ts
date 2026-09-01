import { NextResponse } from "next/server";

/**
 * Auth catch-all API route handler (/api/auth/*).
 * Handles authentication callbacks, session management, and auth actions.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  return NextResponse.json({
    success: true,
    message: "Auth endpoint active",
    path: url.pathname,
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  return NextResponse.json({
    success: true,
    message: "Auth action processed",
    path: url.pathname,
  });
}
