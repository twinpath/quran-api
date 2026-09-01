import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const SESSION_COOKIE_NAME = "quran_api.session_token";

/**
 * Resolves a required environment variable from Cloudflare context or process.env.
 * Throws a descriptive error if the variable is missing.
 */
function requireEnv(cfEnv: CloudflareEnv | undefined, key: string): string {
  const value =
    (cfEnv as unknown as Record<string, string>)?.[key] ||
    process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Run "pnpm run generate:vars" to create .dev.vars, or set it in your Cloudflare dashboard.`
    );
  }
  return value;
}

/**
 * Resolves baseURL from Cloudflare context or process.env with NEXT_PUBLIC_APP_URL fallback.
 * Throws a descriptive error if no URL is configured.
 */
function resolveBaseURL(cfEnv: CloudflareEnv | undefined): string {
  const value =
    (cfEnv as unknown as Record<string, string>)?.BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL;
  if (!value) {
    throw new Error(
      `Missing required environment variable: BETTER_AUTH_URL (or NEXT_PUBLIC_APP_URL). ` +
        `Run "pnpm run generate:vars" to create .dev.vars, or set it in your Cloudflare dashboard.`
    );
  }
  return value;
}

/**
 * Initializes Better Auth server configuration for Cloudflare D1 environment.
 * Resolves environment secrets from Cloudflare Context (including .dev.vars) or process.env.
 * Throws descriptive errors when required variables are missing.
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

  const secret = requireEnv(cfEnv, "BETTER_AUTH_SECRET");
  const baseURL = resolveBaseURL(cfEnv);
  const googleClientId = requireEnv(cfEnv, "GOOGLE_CLIENT_ID");
  const googleClientSecret = requireEnv(cfEnv, "GOOGLE_CLIENT_SECRET");

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
    advanced: {
      cookiePrefix: "quran_api",
    },
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
    },
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        prompt: "select_account consent",
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
