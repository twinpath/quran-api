import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export function getDb(env: CloudflareEnv) {
  return drizzle(env.DB, { schema });
}
