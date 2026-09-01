import { getAuth } from "@/lib/auth";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Next.js App Router catch-all route handler for Better Auth (/api/auth/*).
 * Automatically handles sign-in, sign-up, social OAuth callbacks, session inspection, and sign-out.
 *
 * toNextJsHandler returns { GET, POST, PATCH, PUT, DELETE } handlers that are
 * exported directly for Next.js App Router consumption.
 *
 * The GET handler is wrapped to intercept Better Auth error redirects
 * (e.g. /api/auth/error?error=account_not_linked) and redirect
 * to /auth/signin with a user-friendly error query parameter.
 */
function getHandlers() {
  let env: CloudflareEnv | undefined;
  try {
    const cf = getCloudflareContext();
    env = cf.env;
  } catch {
    env = process.env as unknown as CloudflareEnv;
  }
  const auth = getAuth(env);
  return toNextJsHandler(auth);
}

export const GET = async (request: Request) => {
  const url = new URL(request.url);

  // Intercept /api/auth/error and redirect to /auth/signin with the error query param
  if (url.pathname === "/api/auth/error") {
    const errorCode = url.searchParams.get("error") || "internal_server_error";
    const signinUrl = new URL("/auth/signin", url.origin);
    signinUrl.searchParams.set("error", errorCode);
    return Response.redirect(signinUrl.toString(), 302);
  }

  return getHandlers().GET(request);
};

export const POST = (request: Request) => getHandlers().POST(request);

