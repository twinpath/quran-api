"use client";

import { useState } from "react";
import { Bell, Zap, Mail, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { NotificationPreferencesSectionProps } from "@/types/account";

export function NotificationPreferencesSection({
  usageAlerts,
  emailNotifications,
  onTogglePreference,
  onSavePreferences,
  isLoading = false,
}: NotificationPreferencesSectionProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    onSavePreferences(e);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Category Info */}
      <div className="lg:col-span-1 space-y-1">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notifications & Alerts
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Configure automated email warnings for API key quota usage and platform changelog updates.
        </p>
      </div>

      {/* Right Column: Preferences Cards */}
      <div className="lg:col-span-2 space-y-3">
        {/* Usage Alert Card */}
        <div className="p-4 border border-border bg-card hover:bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Usage & Rate Limit Alerts</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Receive instant email notifications when daily key consumption reaches 80% quota.
            </p>
          </div>
          <Button
            type="button"
            variant={usageAlerts ? "default" : "outline"}
            size="sm"
            onClick={() => onTogglePreference("usageAlerts")}
            className={`w-24 shrink-0 cursor-pointer text-xs font-semibold ${
              usageAlerts
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "text-muted-foreground"
            }`}
          >
            {usageAlerts ? "Enabled" : "Disabled"}
          </Button>
        </div>

        {/* Platform Updates Card */}
        <div className="p-4 border border-border bg-card hover:bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Platform & API Updates</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Stay informed about new Quran API endpoints, dataset updates, and scheduled maintenance.
            </p>
          </div>
          <Button
            type="button"
            variant={emailNotifications ? "default" : "outline"}
            size="sm"
            onClick={() => onTogglePreference("emailNotifications")}
            className={`w-24 shrink-0 cursor-pointer text-xs font-semibold ${
              emailNotifications
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "text-muted-foreground"
            }`}
          >
            {emailNotifications ? "Enabled" : "Disabled"}
          </Button>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            size="sm"
            className="gap-2 cursor-pointer text-xs font-semibold"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
