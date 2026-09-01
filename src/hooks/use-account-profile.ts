import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { DEFAULT_USER_PROFILE } from "@/constants/account";
import type { ApiResponse } from "@/types/api";
import type { UserProfile, UseAccountProfileReturn } from "@/types/account";
import type { RateLimitStatusResponse } from "@/types/rate-limit";

/**
 * Custom hook managing profile state with reactive Better Auth session data
 * and real D1 rate limit quota queries.
 */
export function useAccountProfile(): UseAccountProfileReturn {
  const { data: session, isPending: isSessionPending } = useSession();
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [rateLimitData, setRateLimitData] = useState<{ used: number; limit: number } | null>(null);

  useEffect(() => {
    if (session?.user) {
      setProfile((prev) => ({
        ...prev,
        id: session.user.id || prev.id,
        name: session.user.name || prev.name,
        email: session.user.email || prev.email,
        avatarUrl: session.user.image || undefined,
        tier: (session.user as unknown as { tier?: string }).tier === "enterprise" ? "Enterprise" : "Developer",
        memberSince: session.user.createdAt
          ? new Date(session.user.createdAt).toISOString().split("T")[0]
          : prev.memberSince,
      }));
    }
  }, [session]);

  useEffect(() => {
    async function fetchQuota() {
      try {
        const res = await fetch("/api/rate_limit");
        if (res.ok) {
          const json = (await res.json()) as ApiResponse<RateLimitStatusResponse>;
          if (json.success && json.data) {
            const data: RateLimitStatusResponse = json.data;
            setRateLimitData({
              used: data.rate.used,
              limit: data.rate.limit,
            });
          }
        }
      } catch {
        // Fallback to static profile defaults if fetch fails
      }
    }
    fetchQuota();
  }, []);

  return { profile, rateLimitData, isSessionPending };
}
