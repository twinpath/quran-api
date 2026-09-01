import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants";

/**
 * Next.js Edge Middleware for route protection using Better Auth session token.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken =
    request.cookies.get(SESSION_COOKIE_NAME)?.value ||
    request.cookies.get(`__Secure-${SESSION_COOKIE_NAME}`)?.value;

  // Protect /account and /auth/create-password routes (requires active session)
  if (pathname.startsWith("/account") || pathname === "/auth/create-password") {
    if (!sessionToken) {
      const signinUrl = new URL("/auth/signin", request.url);
      signinUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(signinUrl);
    }
  }

  // Redirect authenticated users away from public auth pages to /account
  if (pathname === "/auth/signin" || pathname === "/auth/signup") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/auth/signin",
    "/auth/signup",
    "/auth/create-password",
  ],
};

