import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Single Source of Truth for resolving the Cloudflare KV namespace binding.
 * Safely reads from passed env parameter or Cloudflare runtime context.
 */
export function getKv(env?: CloudflareEnv): KVNamespace | undefined {
  let kvBinding = env?.KV;
  if (!kvBinding) {
    try {
      const cf = getCloudflareContext();
      kvBinding = cf?.env?.KV;
    } catch {
      // Outside Cloudflare context (e.g. static analysis)
    }
  }
  return kvBinding;
}
