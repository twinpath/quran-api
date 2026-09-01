import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import type { ApiResponse } from "@/types/api";
import type { UserProfile, UseAccountProfileReturn } from "@/types/account";
import type { RateLimitStatusResponse } from "@/types/rate-limit";

/**
 * Custom hook managing profile state with reactive Better Auth session data
 * and real D1 rate limit quota queries (5,000 req/hour for authenticated users).
 * Safely prevents SSR hydration mismatches using client mount detection.
 */
export function useAccountProfile(): UseAccountProfileReturn {
  const { data: session, isPending } = useSession();
  const [rateLimitData, setRateLimitData] = useState<{ used: number; limit: number } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchQuota() {
      try {
        const res = await fetch("/api/rate_limit");
        if (res.ok) {
          const json = (await res.json()) as ApiResponse<RateLimitStatusResponse>;
          if (json.success && json.data) {
            const data: RateLimitStatusResponse = json.data;
            setRateLimitData({
              used: data.rate.used ?? 0,
              limit: data.rate.limit ?? 5000,
            });
          }
        }
      } catch {
        setRateLimitData({ used: 0, limit: 5000 });
      }
    }
    fetchQuota();
  }, []);

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
