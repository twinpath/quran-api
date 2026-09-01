import { useState, useEffect, useSyncExternalStore } from "react";
import { useSession } from "@/lib/auth-client";
import { getAccountQuotaAction } from "@/lib/account-quota";
import type { UserProfile, UseAccountProfileReturn } from "@/types/account";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

/**
 * Custom hook managing profile state with reactive Better Auth session data
 * and real D1 rate limit quota queries via Server Action Component.
 * Safely prevents SSR hydration mismatches using client mount detection.
 */
export function useAccountProfile(): UseAccountProfileReturn {
  const { data: session, isPending } = useSession();
  const [rateLimitData, setRateLimitData] = useState<{ used: number; limit: number } | null>(null);
  const isMounted = useIsMounted();

  useEffect(() => {
    async function fetchQuota() {
      try {
        const data = await getAccountQuotaAction();
        setRateLimitData({
          used: data.used,
          limit: data.limit,
        });
      } catch {
        setRateLimitData({ used: 0, limit: 5000 });
      }
    }
    if (session?.user?.id) {
      fetchQuota();
    }
  }, [session?.user?.id]);

  const isSessionPending = !isMounted || isPending;

  const profile: UserProfile = {
    id: session?.user?.id ?? "-",
    name: session?.user?.name ?? "User",
    email: session?.user?.email ?? "-",
    avatarUrl: session?.user?.image ?? undefined,
    tier: (session?.user as unknown as { tier?: string })?.tier === "enterprise" ? "Enterprise" : "Developer",
    memberSince: session?.user?.createdAt
      ? new Date(session.user.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
      : "-",
    apiUsageToday: rateLimitData?.used ?? 0,
    apiUsageLimit: rateLimitData?.limit ?? 5000,
  };

  return { profile, rateLimitData, isSessionPending };
}
