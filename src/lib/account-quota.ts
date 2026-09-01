"use server";

import { headers } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getKv } from "@/lib/kv";
import { getAuth } from "@/lib/auth";
import { getAccountRateLimitStatus } from "@/lib/rate-limiter";
import type { RateLimitStatusResponse } from "@/types/rate-limit";

/**
 * Server Action Component for direct introspection of developer account rate limit quota.
 * Reads real-time KV usage for `rl:user:<userId>:core:<windowKey>` on the server.
 * Eliminates client-side REST API fetch calls.
 */
export async function getAccountQuotaAction(): Promise<{ used: number; limit: number; remaining: number }> {
  try {
    let env: CloudflareEnv | undefined;
    try {
      env = getCloudflareContext().env;
    } catch {
      env = process.env as unknown as CloudflareEnv;
    }

    const auth = getAuth(env);
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user?.id) {
      return { used: 0, limit: 5000, remaining: 5000 };
    }

    const kv = getKv(env);
    const status: RateLimitStatusResponse = await getAccountRateLimitStatus(kv, session.user.id);

    return {
      used: status.rate.used ?? 0,
      limit: status.rate.limit ?? 5000,
      remaining: status.rate.remaining ?? 5000,
    };
  } catch (err) {
    console.error("Error executing getAccountQuotaAction Server Action:", err);
    return { used: 0, limit: 5000, remaining: 5000 };
  }
}
