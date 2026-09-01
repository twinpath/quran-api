"use client";

import { ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccountProfile } from "@/hooks/use-account-profile";

export function AccountHeader() {
  const { profile, isSessionPending } = useAccountProfile();

  const used = profile.apiUsageToday;
  const limit = profile.apiUsageLimit;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Account & Developer Settings
          </h1>
          {isSessionPending ? (
            <Skeleton className="h-6 w-28" />
          ) : (
            <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              {profile.tier} Tier
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile, authentication, and API access keys for Quran API.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 border border-border">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>
            Quota: <strong>{used.toLocaleString()} / {limit.toLocaleString()} req/hour</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
