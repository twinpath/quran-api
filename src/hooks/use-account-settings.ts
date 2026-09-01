import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { DEFAULT_TELEGRAM_BOT_USERNAME } from "@/constants";
import type {
  AccountSettings,
  LinkedAccount,
  UseAccountSettingsReturn,
} from "@/types/account";

/**
 * Custom hook managing account settings state with real Better Auth backend
 * for OAuth linking/unlinking, password updates, and account deletion.
 */
export function useAccountSettings(): UseAccountSettingsReturn {
  const router = useRouter();
  const { data: session } = useSession();
  const [settings, setSettings] = useState<AccountSettings>({
    emailNotifications: true,
    usageAlerts: true,
    security2FA: false,
    themePreference: "system",
    googleConnected: false,
    googleEmail: undefined,
  });
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [isUnlinkingGoogle, setIsUnlinkingGoogle] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [telegramBotUsername, setTelegramBotUsername] = useState<string>(DEFAULT_TELEGRAM_BOT_USERNAME);
  const [isTestingTelegram, setIsTestingTelegram] = useState<boolean>(false);

  // Fetch real linked accounts and notification settings on mount
  useEffect(() => {
    async function fetchLinkedAccountsAndSettings() {
      try {
        const { data: accounts } = await authClient.listAccounts();
        if (accounts && Array.isArray(accounts)) {
          const mapped: LinkedAccount[] = accounts.map((a) => ({
            id: a.id,
            providerId: a.providerId,
            accountId: a.accountId,
          }));
          setLinkedAccounts(mapped);

          const googleAccount = mapped.find((a) => a.providerId === "google");
          setSettings((prev) => ({
            ...prev,
            googleConnected: Boolean(googleAccount),
            googleEmail: googleAccount ? session?.user?.email || googleAccount.accountId : undefined,
          }));
        }

        // Fetch notification settings
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
            setSettings((prev) => ({
              ...prev,
              telegramChatId: notifData.data?.telegramChatId || "",
              usageAlerts: notifData.data?.usageAlerts ?? true,
              emailNotifications: notifData.data?.emailNotifications ?? true,
            }));
            if (notifData.data.telegramBotUsername) {
              setTelegramBotUsername(notifData.data.telegramBotUsername);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch linked accounts or notification settings:", err);
      } finally {
        setIsLoadingAccounts(false);
      }
    }
    fetchLinkedAccountsAndSettings();
  }, [session]);

  const handleTogglePreference = (key: "usageAlerts" | "emailNotifications") => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleUpdateTelegramChatId = (chatId: string) => {
    setSettings((prev) => ({
      ...prev,
      telegramChatId: chatId,
    }));
  };

  const handleTestTelegramAlert = async () => {
    if (!settings.telegramChatId) {
      toast.error("Please enter a valid Telegram Chat ID first");
      return;
    }

    setIsTestingTelegram(true);
    try {
      const res = await fetch("/api/notifications/test-telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: settings.telegramChatId }),
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

  const handleLinkGoogle = async () => {
    setIsLinkingGoogle(true);
    try {
      toast.info("Redirecting to Google OAuth link consent...");
      await authClient.linkSocial({
        provider: "google",
        callbackURL: "/account/settings",
      });
    } catch (err) {
      console.error("Google OAuth link error:", err);
      toast.error("Failed to link Google account");
      setIsLinkingGoogle(false);
    }
  };

  const handleUnlinkGoogle = async () => {
    const googleAccount = linkedAccounts.find((a) => a.providerId === "google");
    if (!googleAccount) {
      toast.error("Google OAuth account not found");
      return;
    }

    // Single Auth Provider Lockout Guard
    const hasOtherAccounts = linkedAccounts.some((a) => a.providerId !== "google");
    if (!hasOtherAccounts && linkedAccounts.length <= 1) {
      toast.error(
        "Cannot disconnect Google OAuth because it is your only authentication method. Please set up a password first in Password Management."
      );
      return;
    }

    setIsUnlinkingGoogle(true);
    try {
      const { error } = await authClient.unlinkAccount({ accountId: googleAccount.id });
      if (error) {
        toast.error(error.message || "Failed to disconnect Google OAuth account");
      } else {
        setLinkedAccounts((prev) => prev.filter((a) => a.providerId !== "google"));
        setSettings((prev) => ({
          ...prev,
          googleConnected: false,
          googleEmail: undefined,
        }));
        toast.info("Google OAuth account disconnected");
      }
    } catch (err) {
      console.error("Google OAuth unlink error:", err);
      toast.error("Failed to disconnect Google account");
    } finally {
      setIsUnlinkingGoogle(false);
    }
  };

  const handleUpdatePassword = async (currentPass: string, newPass: string, confirmPass: string) => {
    if (!currentPass || !newPass) {
      toast.error("Please fill in current and new password");
      return;
    }

    if (newPass !== confirmPass) {
      toast.error("New passwords do not match");
      return;
    }

    try {
      const { error } = await authClient.changePassword({
        currentPassword: currentPass,
        newPassword: newPass,
        revokeOtherSessions: false,
      });

      if (error) {
        toast.error(error.message || "Failed to update password");
      } else {
        toast.success("Password updated successfully!");
      }
    } catch (err) {
      console.error("Password update error:", err);
      toast.error("An unexpected error occurred while updating password");
    }
  };

  const handleSavePreferences = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      const res = await fetch("/api/account/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telegramChatId: settings.telegramChatId,
          usageAlerts: settings.usageAlerts,
          emailNotifications: settings.emailNotifications,
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

  const handleDeleteAccount = async (password: string): Promise<boolean> => {
    if (!password) {
      toast.error("Please enter your password to confirm deletion");
      return false;
    }

    setIsDeletingAccount(true);
    try {
      const res = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const result = (await res.json()) as { error?: string; success?: boolean };
      if (!res.ok || result.error) {
        toast.error(result.error || "Failed to delete account");
        return false;
      }

      toast.success("Your developer account has been permanently deleted.");
      await authClient.signOut();
      router.push("/auth/signin");
      return true;
    } catch (err) {
      console.error("Delete account error:", err);
      toast.error("An unexpected error occurred while deleting account");
      return false;
    } finally {
      setIsDeletingAccount(false);
    }
  };

  return {
    settings,
    linkedAccounts,
    isLoadingAccounts,
    isLinkingGoogle,
    isUnlinkingGoogle,
    isDeletingAccount,
    telegramBotUsername,
    isTestingTelegram,
    handleTogglePreference,
    handleUpdateTelegramChatId,
    handleTestTelegramAlert,
    handleLinkGoogle,
    handleUnlinkGoogle,
    handleUpdatePassword,
    handleSavePreferences,
    handleDeleteAccount,
  };
}
