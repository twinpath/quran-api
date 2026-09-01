import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { UseAccountPasswordReturn } from "@/types/account";

/**
 * Custom hook managing password update via Better Auth changePassword API.
 * Handles validation, error handling, and success notifications.
 */
export function useAccountPassword(): UseAccountPasswordReturn {
  const handleUpdatePassword = async (
    currentPass: string,
    newPass: string,
    confirmPass: string
  ) => {
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

  return {
    handleUpdatePassword,
  };
}
