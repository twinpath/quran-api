"use client";

import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { OauthIntegrationsSection } from "./oauth-integrations-section";
import { PasswordManagementSection } from "./password-management-section";
import { NotificationPreferencesSection } from "./notification-preferences-section";
import { DeleteAccountSection } from "./delete-account-section";
import { useAccountSettings } from "@/hooks/use-account-settings";
import type { AccountSettingsFormProps } from "@/types/account";

export function AccountSettingsForm({ isLoading = false }: AccountSettingsFormProps) {
  const {
    settings,
    isLoadingAccounts,
    isLinkingGoogle,
    isUnlinkingGoogle,
    isDeletingAccount,
    telegramBotUsername,
    telegramConnectUrl,
    isTestingTelegram,
    isDisconnectingTelegram,
    handleTogglePreference,
    handleUpdateTelegramChatId,
    handleTestTelegramAlert,
    handleDisconnectTelegram,
    handleLinkGoogle,
    handleUnlinkGoogle,
    handleUpdatePassword,
    handleSavePreferences,
    handleDeleteAccount,
  } = useAccountSettings();

  const showSkeleton = isLoading || isLoadingAccounts;

  return (
    <Card className="border-border shadow-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Developer Account Settings
        </CardTitle>
        <CardDescription>
          Manage your connected OAuth accounts, password security credentials, developer notifications, and account deletion
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Section 1: Connected OAuth Accounts */}
        <OauthIntegrationsSection
          googleConnected={Boolean(settings.googleConnected)}
          googleEmail={settings.googleEmail}
          onLinkGoogle={handleLinkGoogle}
          onUnlinkGoogle={handleUnlinkGoogle}
          isLinking={isLinkingGoogle}
          isUnlinking={isUnlinkingGoogle}
          isLoading={showSkeleton}
        />

        <div className="border-t border-border" />

        {/* Section 2: Password & Credentials */}
        <PasswordManagementSection
          onUpdatePassword={handleUpdatePassword}
          isLoading={showSkeleton}
        />

        <div className="border-t border-border" />

        {/* Section 3: Developer Preferences & Notifications */}
        <NotificationPreferencesSection
          usageAlerts={settings.usageAlerts}
          emailNotifications={settings.emailNotifications}
          telegramChatId={settings.telegramChatId}
          telegramBotUsername={telegramBotUsername}
          telegramConnectUrl={telegramConnectUrl}
          isTestingTelegram={isTestingTelegram}
          isDisconnectingTelegram={isDisconnectingTelegram}
          onTogglePreference={handleTogglePreference}
          onUpdateTelegramChatId={handleUpdateTelegramChatId}
          onTestTelegramAlert={handleTestTelegramAlert}
          onDisconnectTelegram={handleDisconnectTelegram}
          onSavePreferences={handleSavePreferences}
          isLoading={showSkeleton}
        />

        <div className="border-t border-border" />

        {/* Section 4: Danger Zone - Delete Account */}
        <DeleteAccountSection
          onDeleteAccount={handleDeleteAccount}
          isDeleting={isDeletingAccount}
          isLoading={showSkeleton}
        />
      </CardContent>
    </Card>
  );
}
