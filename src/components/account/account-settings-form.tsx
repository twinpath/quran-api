"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Save, Check } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_ACCOUNT_SETTINGS } from "@/constants/account";
import type { AccountSettingsFormProps, AccountSettings } from "@/types/account";

export function AccountSettingsForm({ isLoading = false }: AccountSettingsFormProps) {
  const [settings, setSettings] = useState<AccountSettings>(DEFAULT_ACCOUNT_SETTINGS);
  const [isSaved, setIsSaved] = useState(false);

  const handleToggle = (key: keyof AccountSettings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    toast.success("Account preferences saved successfully!");
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card className="border-border shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Developer Preferences & Notifications
          </CardTitle>
          <CardDescription>
            Configure how you receive API rate limit alerts and security notifications
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          ) : (
            <div className="space-y-4 divide-y divide-border">
              {/* Notification Toggle */}
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    Usage & Rate Limit Alerts
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Receive email notifications when your daily API key usage exceeds 80% quota.
                  </p>
                </div>
                <Button
                  type="button"
                  variant={settings.usageAlerts ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggle("usageAlerts")}
                  className="w-20"
                >
                  {settings.usageAlerts ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {/* Email Notifications Toggle */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    Platform Updates
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Get notified about new Quran API endpoints, dataset updates, and maintenance schedules.
                  </p>
                </div>
                <Button
                  type="button"
                  variant={settings.emailNotifications ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleToggle("emailNotifications")}
                  className="w-20"
                >
                  {settings.emailNotifications ? "Enabled" : "Disabled"}
                </Button>
              </div>

              {/* Security Setting */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    Two-Factor Authentication (2FA)
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Enhance your developer account security with 2FA verification.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {settings.security2FA ? "Active" : "Not Configured"}
                </Badge>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-border flex justify-end">
            <Button type="submit" disabled={isLoading} className="gap-2">
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
        </CardContent>
      </Card>
    </form>
  );
}
