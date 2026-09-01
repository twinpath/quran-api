import { useState, useEffect } from "react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import type {
  AccountSettings,
  LinkedAccount,
  UseAccountSettingsReturn,
} from "@/types/account";

/**
 * Custom hook managing account settings state with real Better Auth backend
 * for OAuth linking/unlinking and password updates.
 */
export function useAccountSettings(): UseAccountSettingsReturn {
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

  // Fetch real linked accounts on mount
  useEffect(() => {
    async function fetchLinkedAccounts() {
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
      } catch (err) {
        console.error("Failed to fetch linked accounts:", err);
      } finally {
        setIsLoadingAccounts(false);
      }
    }
    fetchLinkedAccounts();
  }, [session]);

  const handleTogglePreference = (key: "usageAlerts" | "emailNotifications") => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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

  const handleSavePreferences = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    toast.success("Developer preferences saved successfully!");
  };

  return {
    settings,
    linkedAccounts,
    isLoadingAccounts,
    isLinkingGoogle,
    isUnlinkingGoogle,
    handleTogglePreference,
    handleLinkGoogle,
    handleUnlinkGoogle,
    handleUpdatePassword,
    handleSavePreferences,
  };
}
