import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getKv } from "@/lib/db";
import { getAuth } from "@/lib/auth";
import { getAccountRateLimitStatus } from "@/lib/rate-limiter";
import type { ApiResponse } from "@/types/api";
import type { RateLimitStatusResponse } from "@/types/rate-limit";

/**
 * Resolves the authenticated user ID from the Better Auth session cookie.
 */
async function getSessionUserId(env?: CloudflareEnv): Promise<string | null> {
  try {
    const auth = getAuth(env);
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    return session?.user?.id ?? null;
  } catch {
    return null;
  }
}

/**
 * GET /api/account/rate_limit
 * Direct rate limit status introspection for the currently authenticated developer account.
 * Reads real-time KV usage for `rl:user:<userId>:core:<windowKey>` with 5,000 req/hour limit.
 */
export async function GET() {
  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env;
  } catch {
    env = process.env as unknown as CloudflareEnv;
  }

  const userId = await getSessionUserId(env);
  if (!userId) {
    // Unauthenticated fallback default status
    const data: RateLimitStatusResponse = {
      resources: {
        core: { limit: 5000, remaining: 5000, used: 0, reset: Math.floor(Date.now() / 1000) + 3600, resource: "core" },
        search: { limit: 600, remaining: 600, used: 0, reset: Math.floor(Date.now() / 1000) + 3600, resource: "search" },
      },
      rate: { limit: 5000, remaining: 5000, used: 0, reset: Math.floor(Date.now() / 1000) + 3600, resource: "core" },
    };
    return NextResponse.json({ success: true, data } satisfies ApiResponse<RateLimitStatusResponse>);
  }

  const kv = getKv(env);
  const data = await getAccountRateLimitStatus(kv, userId);

  return NextResponse.json(
    { success: true, data } satisfies ApiResponse<RateLimitStatusResponse>,
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-RateLimit-Limit": String(data.rate.limit),
        "X-RateLimit-Remaining": String(data.rate.remaining),
        "X-RateLimit-Used": String(data.rate.used),
        "X-RateLimit-Reset": String(data.rate.reset),
        "X-RateLimit-Resource": "core",
      },
    },
  );
}
