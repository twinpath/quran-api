import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Single Source of Truth for resolving the Cloudflare KV namespace binding.
 * Safely reads from passed env parameter or Cloudflare runtime context.
 */
export function getKv(env?: CloudflareEnv): KVNamespace {
  let kvBinding = env?.KV;
  if (!kvBinding) {
    try {
      const cf = getCloudflareContext();
      kvBinding = cf?.env?.KV;
    } catch {
      // Outside Cloudflare context
    }
  }

  if (!kvBinding) {
    throw new Error(
      "Cloudflare KV namespace binding (env.KV) is missing. Ensure Cloudflare environment context is provided.",
    );
  }

  return kvBinding;
}
