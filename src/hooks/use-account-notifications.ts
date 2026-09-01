import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DEFAULT_TELEGRAM_BOT_USERNAME } from "@/constants";
import type { UseAccountNotificationsReturn } from "@/types/account";

/**
 * Custom hook managing notification preferences: email notifications,
 * Telegram bot connection, test alerts, and preferences persistence.
 */
export function useAccountNotifications(): UseAccountNotificationsReturn {
  const [usageAlerts, setUsageAlerts] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramBotUsername, setTelegramBotUsername] = useState<string>(DEFAULT_TELEGRAM_BOT_USERNAME);
  const [telegramConnectUrl, setTelegramConnectUrl] = useState<string>("");
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [isDisconnectingTelegram, setIsDisconnectingTelegram] = useState(false);
  const [isConnectingTelegram, setIsConnectingTelegram] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  useEffect(() => {
    async function fetchNotificationSettings() {
      try {
        const notifRes = await fetch("/api/account/notifications");
        if (notifRes.ok) {
          const notifData = (await notifRes.json()) as {
            success?: boolean;
            data?: {
              telegramChatId?: string;
              usageAlerts?: boolean;
              emailNotifications?: boolean;
              telegramBotUsername?: string;
            };
          };
          if (notifData.success && notifData.data) {
            setTelegramChatId(notifData.data.telegramChatId || "");
            setUsageAlerts(notifData.data.usageAlerts ?? true);
            setEmailNotifications(notifData.data.emailNotifications ?? true);
            if (notifData.data.telegramBotUsername) {
              setTelegramBotUsername(notifData.data.telegramBotUsername);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch notification settings:", err);
      } finally {
        setIsLoadingNotifications(false);
      }
    }
    fetchNotificationSettings();
  }, []);

  const handleConnectTelegram = async () => {
    setIsConnectingTelegram(true);
    try {
      const tokenRes = await fetch("/api/account/notifications/telegram-token");
      const tokenData = (await tokenRes.json()) as {
        success?: boolean;
        data?: { deepLink?: string };
        error?: string;
      };

      if (tokenRes.ok && tokenData.success && tokenData.data?.deepLink) {
        const link = tokenData.data.deepLink;
        setTelegramConnectUrl(link);
        window.open(link, "_blank", "noopener,noreferrer");
      } else {
        toast.error(tokenData.error || "Failed to generate Telegram connection link");
      }
    } catch (err) {
      console.error("Connect Telegram error:", err);
      toast.error("An error occurred while connecting Telegram Bot");
    } finally {
      setIsConnectingTelegram(false);
    }
  };

  const handleTogglePreference = (key: "usageAlerts" | "emailNotifications") => {
    const setter = key === "usageAlerts" ? setUsageAlerts : setEmailNotifications;
    const currentValue = key === "usageAlerts" ? usageAlerts : emailNotifications;
    const nextValue = !currentValue;
    const featureLabel =
      key === "usageAlerts"
        ? "Telegram Usage & Rate Limit Alerts"
        : "System & Security Email Notifications";

    setter(nextValue);

    if (nextValue) {
      toast.success(`${featureLabel} enabled`);
    } else {
      toast.info(`${featureLabel} disabled`);
    }
  };

  const handleUpdateTelegramChatId = (chatId: string) => {
    setTelegramChatId(chatId);
  };

  const handleDisconnectTelegram = async () => {
    setIsDisconnectingTelegram(true);
    try {
      const res = await fetch("/api/account/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramChatId: null,
          usageAlerts,
          emailNotifications,
        }),
      });

      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to disconnect Telegram");
      } else {
        setTelegramChatId("");
        toast.info("Telegram Bot account disconnected");
      }
    } catch (err) {
      console.error("Disconnect Telegram error:", err);
      toast.error("Failed to disconnect Telegram");
    } finally {
      setIsDisconnectingTelegram(false);
    }
  };

  const handleTestTelegramAlert = async () => {
    if (!telegramChatId) {
      toast.error("Please enter a valid Telegram Chat ID first");
      return;
    }

    setIsTestingTelegram(true);
    try {
      const res = await fetch("/api/notifications/test-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: telegramChatId }),
      });

      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to send Telegram test alert");
      } else {
        toast.success(data.message || "Test alert sent to your Telegram!");
      }
    } catch (err) {
      console.error("Test Telegram alert error:", err);
      toast.error("An error occurred while sending Telegram test alert");
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleSavePreferences = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch("/api/account/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramChatId,
          usageAlerts,
          emailNotifications,
        }),
      });

      const data = (await res.json()) as { error?: string; message?: string };
      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to save preferences");
      } else {
        toast.success("Developer preferences saved successfully!");
      }
    } catch (err) {
      console.error("Save preferences error:", err);
      toast.error("Failed to save developer preferences");
    }
  };

  return {
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
  };
}
