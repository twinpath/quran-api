"use client";

import { useState } from "react";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DEFAULT_ACCOUNT_SETTINGS } from "@/constants/account";
import { OauthIntegrationsSection } from "./oauth-integrations-section";
import { PasswordManagementSection } from "./password-management-section";
import { NotificationPreferencesSection } from "./notification-preferences-section";
import type { AccountSettingsFormProps, AccountSettings } from "@/types/account";

export function AccountSettingsForm({ isLoading = false }: AccountSettingsFormProps) {
  const [settings, setSettings] = useState<AccountSettings>(DEFAULT_ACCOUNT_SETTINGS);

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

  const handleUpdatePassword = (currentPass: string, newPass: string, confirmPass: string) => {
    if (!currentPass || !newPass) {
      toast.error("Please fill in current and new password");
      return;
    }

    if (newPass !== confirmPass) {
      toast.error("New passwords do not match");
      return;
    }

    toast.success("Password updated successfully!");
  };

  const handleSavePreferences = () => {
    toast.success("Developer preferences saved successfully!");
  };

  return (
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
        {/* Section 1: Connected OAuth Accounts */}
        <OauthIntegrationsSection
          googleConnected={settings.googleConnected}
          googleEmail={settings.googleEmail}
          onToggleConnect={handleGoogleConnectToggle}
          isLoading={isLoading}
        />

        <div className="border-t border-border" />

        {/* Section 2: Password & Credentials */}
        <PasswordManagementSection
          onUpdatePassword={handleUpdatePassword}
          isLoading={isLoading}
        />

        <div className="border-t border-border" />

        {/* Section 3: Developer Preferences & Notifications */}
        <NotificationPreferencesSection
          usageAlerts={settings.usageAlerts}
          emailNotifications={settings.emailNotifications}
          onTogglePreference={handleTogglePreference}
          onSavePreferences={handleSavePreferences}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
