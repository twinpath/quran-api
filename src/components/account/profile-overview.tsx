"use client";

import { User, Mail, Calendar, Award, Activity, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAccountProfile } from "@/hooks/use-account-profile";
import type { ProfileOverviewProps } from "@/types/account";

export function ProfileOverview({ isLoading = false }: ProfileOverviewProps) {
  const { profile, rateLimitData, isSessionPending } = useAccountProfile();

  const showSkeleton = isLoading || isSessionPending;
  const used = rateLimitData?.used ?? profile.apiUsageToday;
  const limit = rateLimitData?.limit ?? profile.apiUsageLimit;
  const usagePercentage = Number(((used / limit) * 100).toFixed(2));

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
