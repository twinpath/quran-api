"use client";

import { useState, useEffect } from "react";
import { User, Mail, Calendar, Award, Activity, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_USER_PROFILE } from "@/constants/account";
import { useSession, authClient } from "@/lib/auth-client";
import type { ApiResponse } from "@/types/api";
import type { ProfileOverviewProps, UserProfile } from "@/types/account";
import type { RateLimitStatusResponse } from "@/types/rate-limit";
import { useRouter } from "next/navigation";

export function ProfileOverview({ isLoading = false }: ProfileOverviewProps) {
  const router = useRouter();
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
        const res = await fetch("/api/rate_limit?api_key=qr_live_8f01a4b2");
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

  const showSkeleton = isLoading || isSessionPending;
  const used = rateLimitData?.used ?? profile.apiUsageToday;
  const limit = rateLimitData?.limit ?? profile.apiUsageLimit;
  const usagePercentage = Math.round((used / limit) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Identity Card */}
        <Card className="md:col-span-2 border-border shadow-none">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  User Profile Information
                </CardTitle>
                <CardDescription>
                  Your personal identity and developer account details
                </CardDescription>
              </div>
              {showSkeleton ? (
                <Skeleton className="h-6 w-16" />
              ) : (
                <Badge variant="secondary" className="gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {showSkeleton ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Full Name</span>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    {profile.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Email Address</span>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {profile.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Account ID</span>
                  <p className="font-mono text-xs text-muted-foreground">
                    {profile.id}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-muted-foreground text-xs uppercase tracking-wider font-medium">Member Since</span>
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {profile.memberSince}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Plan & Tier Card */}
        <Card className="border-border shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Current Plan
            </CardTitle>
            <CardDescription>Your API access tier and quota limit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showSkeleton ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-primary">{profile.tier} Tier</span>
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5 text-primary" /> Hourly Quota
                    </span>
                    <span>{usagePercentage}% used</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {used.toLocaleString()} / {limit.toLocaleString()} req/hour
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
