import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

/**
 * Create a typed Drizzle client from Cloudflare D1 binding.
 */
export function getDb(env: CloudflareEnv) {
  return drizzle(env.DB, { schema });
}

/**
 * Get the KV namespace binding from Cloudflare environment.
 */
export function getKv(env: CloudflareEnv) {
  return env.KV;
}

