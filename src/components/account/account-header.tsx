import { ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_USER_PROFILE } from "@/constants/account";

export function AccountHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-border">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Account & Developer Settings
          </h1>
          <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20">
            <ShieldCheck className="h-3.5 w-3.5" />
            {DEFAULT_USER_PROFILE.tier} Tier
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile, authentication, and API access keys for Quran API.
        </p>
      </div>

      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 px-3 py-2 border border-border">
        <Zap className="h-4 w-4 text-amber-500" />
        <span>Rate Limit Quota: <strong>{DEFAULT_USER_PROFILE.apiUsageToday.toLocaleString()} / {DEFAULT_USER_PROFILE.apiUsageLimit.toLocaleString()} req/day</strong></span>
      </div>
    </div>
  );
}
