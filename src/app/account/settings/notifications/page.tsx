"use client";

import { NotificationPreferencesSection } from "@/components/account/notification-preferences-section";
import { useAccountNotifications } from "@/hooks/use-account-notifications";

export default function NotificationsSettingsPage() {
  const {
    usageAlerts,
    emailNotifications,
    telegramChatId,
    telegramBotUsername,
    telegramConnectUrl,
    isTestingTelegram,
    isDisconnectingTelegram,
    isConnectingTelegram,
    isLoadingNotifications,
    handleTogglePreference,
    handleUpdateTelegramChatId,
    handleTestTelegramAlert,
    handleDisconnectTelegram,
    handleConnectTelegram,
    handleSavePreferences,
  } = useAccountNotifications();

  return (
    <div className="space-y-8">
      <NotificationPreferencesSection
        usageAlerts={usageAlerts}
        emailNotifications={emailNotifications}
        telegramChatId={telegramChatId}
        telegramBotUsername={telegramBotUsername}
        telegramConnectUrl={telegramConnectUrl}
        isTestingTelegram={isTestingTelegram}
        isDisconnectingTelegram={isDisconnectingTelegram}
        isConnectingTelegram={isConnectingTelegram}
        onTogglePreference={handleTogglePreference}
        onUpdateTelegramChatId={handleUpdateTelegramChatId}
        onTestTelegramAlert={handleTestTelegramAlert}
        onDisconnectTelegram={handleDisconnectTelegram}
        onConnectTelegram={handleConnectTelegram}
        onSavePreferences={handleSavePreferences}
        isLoading={isLoadingNotifications}
      />
    </div>
  );
}
