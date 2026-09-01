import { useState, useEffect } from "react";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import type { LinkedAccount, UseAccountOauthReturn } from "@/types/account";

/**
 * Custom hook managing OAuth account linking/unlinking with Better Auth.
 * Handles listing linked accounts, Google OAuth connect/disconnect,
 * and Single Auth Provider Lockout Guard.
 */
export function useAccountOauth(): UseAccountOauthReturn {
  const { data: session } = useSession();
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [isUnlinkingGoogle, setIsUnlinkingGoogle] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleEmail, setGoogleEmail] = useState<string | undefined>(undefined);

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
          setGoogleConnected(Boolean(googleAccount));
          setGoogleEmail(
            googleAccount
              ? session?.user?.email || googleAccount.accountId
              : undefined
          );
        }
      } catch (err) {
        console.error("Failed to fetch linked accounts:", err);
      } finally {
        setIsLoadingAccounts(false);
      }
    }
    fetchLinkedAccounts();
  }, [session]);

  const handleLinkGoogle = async () => {
    setIsLinkingGoogle(true);
    try {
      toast.info("Redirecting to Google OAuth link consent...");
      await authClient.linkSocial({
        provider: "google",
        callbackURL: "/account/settings/security",
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
        setGoogleConnected(false);
        setGoogleEmail(undefined);
        toast.info("Google OAuth account disconnected");
      }
    } catch (err) {
      console.error("Google OAuth unlink error:", err);
      toast.error("Failed to disconnect Google account");
    } finally {
      setIsUnlinkingGoogle(false);
    }
  };

  return {
    linkedAccounts,
    isLoadingAccounts,
    isLinkingGoogle,
    isUnlinkingGoogle,
    googleConnected,
    googleEmail,
    handleLinkGoogle,
    handleUnlinkGoogle,
  };
}
