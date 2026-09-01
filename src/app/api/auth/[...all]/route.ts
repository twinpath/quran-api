import { getAuth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Next.js App Router catch-all route handler for Better Auth (/api/auth/*).
 * Automatically handles sign-in, sign-up, social OAuth callbacks, session inspection, and sign-out.
 *
 * toNextJsHandler returns { GET, POST, PATCH, PUT, DELETE } handlers that are
 * exported directly for Next.js App Router consumption.
 */
function getHandlers() {
  const env = process.env as unknown as CloudflareEnv;
  const auth = getAuth(env);
  return toNextJsHandler(auth);
}

export const GET = (request: Request) => getHandlers().GET(request);
export const POST = (request: Request) => getHandlers().POST(request);
