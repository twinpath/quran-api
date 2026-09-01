import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { UseAccountDeleteReturn } from "@/types/account";

/**
 * Custom hook managing account deletion flow:
 * password-verified deletion via API, sign out, and redirect.
 */
export function useAccountDelete(): UseAccountDeleteReturn {
  const router = useRouter();
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
    isDeletingAccount,
    handleDeleteAccount,
  };
}
