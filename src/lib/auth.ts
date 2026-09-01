import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const SESSION_COOKIE_NAME = "better-auth.session_token";

/**
 * Initializes Better Auth server configuration for Cloudflare D1 environment.
 */
export function getAuth(env: CloudflareEnv) {
  const db = getDb(env);

  return betterAuth({
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
        clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
      },
    },
    secret: process.env.BETTER_AUTH_SECRET || "quran-api-better-auth-secret-key-32-chars",
  });
}

/**
 * Generates a prefixed UUID string for user or session IDs.
 */
export function generatePrefixedId(prefix: "usr" | "ses" | "key"): string {
  const uuid = crypto.randomUUID();
  return `${prefix}_${uuid}`;
}
