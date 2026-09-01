import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const SESSION_COOKIE_NAME = "better-auth.session_token";

/**
 * Initializes Better Auth server configuration for Cloudflare D1 environment.
 * Safely resolves environment secrets from Cloudflare Context (including .dev.vars) or process.env.
 */
export function getAuth(env?: CloudflareEnv) {
  let cfEnv = env;
  if (!cfEnv) {
    try {
      cfEnv = getCloudflareContext().env;
    } catch {
      // Ignore if outside Cloudflare context (e.g. static analysis)
    }
  }

  const db = getDb(cfEnv);

  const googleClientId =
    (cfEnv as unknown as Record<string, string>)?.GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    "mock-google-client-id";

  const googleClientSecret =
    (cfEnv as unknown as Record<string, string>)?.GOOGLE_CLIENT_SECRET ||
    process.env.GOOGLE_CLIENT_SECRET ||
    "mock-google-client-secret";

  const secret =
    (cfEnv as unknown as Record<string, string>)?.BETTER_AUTH_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    "quran-api-better-auth-secret-key-32-chars";

  const baseURL =
    (cfEnv as unknown as Record<string, string>)?.BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000";

  return betterAuth({
    baseURL,
    secret,
    database: drizzleAdapter(db, {
      provider: "sqlite",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },
  });
}

/**
 * Generates a prefixed UUID string for user or session IDs.
 */
export function generatePrefixedId(prefix: "usr" | "ses" | "key"): string {
  const uuid = crypto.randomUUID();
  return `${prefix}_${uuid}`;
}
