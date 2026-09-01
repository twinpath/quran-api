"use client";

import { useState } from "react";
import { Settings, Bell, Lock, KeyRound, Save, Check, Zap, Mail, ShieldCheck, Unlink, Link2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/common/password-input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_ACCOUNT_SETTINGS } from "@/constants/account";
import type { AccountSettingsFormProps, AccountSettings } from "@/types/account";

export function AccountSettingsForm({ isLoading = false }: AccountSettingsFormProps) {
  const [settings, setSettings] = useState<AccountSettings>(DEFAULT_ACCOUNT_SETTINGS);
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isSavedPreferences, setIsSavedPreferences] = useState(false);

  const handleTogglePreference = (key: "usageAlerts" | "emailNotifications") => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleGoogleConnectToggle = () => {
    if (settings.googleConnected) {
      setSettings((prev) => ({
        ...prev,
        googleConnected: false,
        googleEmail: undefined,
      }));
      toast.info("Google OAuth account unlinked successfully");
    } else {
      setSettings((prev) => ({
        ...prev,
        googleConnected: true,
        googleEmail: "developer@gmail.com",
      }));
      toast.success("Google OAuth account linked successfully as developer@gmail.com");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordState((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordState.currentPassword || !passwordState.newPassword) {
      toast.error("Please fill in current and new password");
      return;
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsUpdatingPassword(true);
    toast.success("Password updated successfully!");
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }, 1000);
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedPreferences(true);
    toast.success("Developer preferences saved successfully!");
    setTimeout(() => setIsSavedPreferences(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Developer Account Settings
          </CardTitle>
          <CardDescription>
            Manage your connected OAuth accounts, password security credentials, and developer notifications
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              {/* Section 1: Connected OAuth Accounts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                <div className="lg:col-span-1 space-y-1">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-primary" />
                    OAuth Integrations
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Connect or disconnect social OAuth providers. Single Email policy ensures seamless multi-login access.
                  </p>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <div className="p-4 border border-border bg-card hover:bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-muted border border-border shrink-0 mt-0.5">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">Google OAuth</span>
                          {settings.googleConnected ? (
                            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Not Linked
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {settings.googleConnected
                            ? `Linked to ${settings.googleEmail}`
                            : "Link your Google account for one-click sign in."}
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant={settings.googleConnected ? "outline" : "default"}
                      size="sm"
                      onClick={handleGoogleConnectToggle}
                      className="gap-1.5 text-xs shrink-0 cursor-pointer"
                    >
                      {settings.googleConnected ? (
                        <>
                          <Unlink className="h-3.5 w-3.5 text-destructive" />
                          Disconnect
                        </>
                      ) : (
                        <>
                          <Link2 className="h-3.5 w-3.5" />
                          Connect Google
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Section 2: Password Management */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-1">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    Password & Credentials
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Update your account password. Per Unified Hybrid policy, password login is enabled for all registered accounts.
                  </p>
                </div>

                <div className="lg:col-span-2">
                  <form onSubmit={handleUpdatePassword} className="p-4 border border-border bg-card space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-foreground">Current Password</label>
                      <PasswordInput
                        name="currentPassword"
                        placeholder="••••••••"
                        value={passwordState.currentPassword}
                        onChange={handlePasswordChange}
                        className="text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">New Password</label>
                        <PasswordInput
                          name="newPassword"
                          placeholder="Min 8 characters"
                          value={passwordState.newPassword}
                          onChange={handlePasswordChange}
                          className="text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-foreground">Confirm New Password</label>
                        <PasswordInput
                          name="confirmPassword"
                          placeholder="Re-enter new password"
                          value={passwordState.confirmPassword}
                          onChange={handlePasswordChange}
                          className="text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isUpdatingPassword}
                        size="sm"
                        className="gap-1.5 text-xs font-semibold cursor-pointer"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {isUpdatingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="border-t border-border" />

              {/* Section 3: Developer Preferences & Notifications */}
              <form onSubmit={handleSavePreferences} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-1">
                  <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    Notifications & Alerts
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Configure automated email warnings for API key quota usage and platform changelog updates.
                  </p>
                </div>

                <div className="lg:col-span-2 space-y-3">
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
                      onClick={() => handleTogglePreference("usageAlerts")}
                      className={`w-24 shrink-0 cursor-pointer text-xs font-semibold ${
                        settings.usageAlerts
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {settings.usageAlerts ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

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
                      onClick={() => handleTogglePreference("emailNotifications")}
                      className={`w-24 shrink-0 cursor-pointer text-xs font-semibold ${
                        settings.emailNotifications
                          ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                          : "text-muted-foreground"
                      }`}
                    >
                      {settings.emailNotifications ? "Enabled" : "Disabled"}
                    </Button>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      size="sm"
                      className="gap-2 cursor-pointer text-xs font-semibold"
                    >
                      {isSavedPreferences ? (
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
