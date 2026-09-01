"use client";

import { useState } from "react";
import { Settings, Bell, Shield, Save, Check, Zap, Mail, ShieldAlert } from "lucide-react";
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
            Developer Preferences & Settings
          </CardTitle>
          <CardDescription>
            Manage your notification alerts, security policies, and developer preferences
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              {/* Section 1: Notifications & Quota Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                {/* Left Column: Category Summary */}
                <div className="lg:col-span-1 space-y-1">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Notifications & Alerts
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Configure automated email warnings for API key quota usage and platform changelog updates.
                  </p>
                </div>

                {/* Right Column: Setting Item Cards */}
                <div className="lg:col-span-2 space-y-3">
                  {/* Usage Alert Item */}
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
                      variant={settings.usageAlerts ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggle("usageAlerts")}
                      className={`w-24 shrink-0 cursor-pointer text-xs font-semibold ${
                        settings.usageAlerts
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {settings.usageAlerts ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  {/* Platform Updates Item */}
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
                      variant={settings.emailNotifications ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggle("emailNotifications")}
                      className={`w-24 shrink-0 cursor-pointer text-xs font-semibold ${
                        settings.emailNotifications
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {settings.emailNotifications ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Section 2: Security & Authentication */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Category Summary */}
                <div className="lg:col-span-1 space-y-1">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    Security & Authentication
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Protect your developer credentials and manage multi-factor authentication options.
                  </p>
                </div>

                {/* Right Column: Setting Item Card */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="p-4 border border-border bg-card hover:bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Two-Factor Authentication (2FA)</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {settings.security2FA ? "Active" : "Not Configured"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Require an authenticator app code in addition to your credentials when signing in.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle("security2FA")}
                      className="shrink-0 cursor-pointer text-xs"
                    >
                      {settings.security2FA ? "Configure 2FA" : "Enable 2FA"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-border flex justify-end">
            <Button type="submit" disabled={isLoading} className="gap-2 cursor-pointer font-semibold">
              {isSaved ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  Preferences Saved
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
