"use client";

import { OauthIntegrationsSection } from "@/components/account/oauth-integrations-section";
import { PasswordManagementSection } from "@/components/account/password-management-section";
import { useAccountOauth } from "@/hooks/use-account-oauth";
import { useAccountPassword } from "@/hooks/use-account-password";

export default function SecuritySettingsPage() {
  const {
    isLoadingAccounts,
    isLinkingGoogle,
    isUnlinkingGoogle,
    googleConnected,
    googleEmail,
    handleLinkGoogle,
    handleUnlinkGoogle,
  } = useAccountOauth();

  const { handleUpdatePassword } = useAccountPassword();

  return (
    <div className="space-y-8">
      <OauthIntegrationsSection
        googleConnected={googleConnected}
        googleEmail={googleEmail}
        onLinkGoogle={handleLinkGoogle}
        onUnlinkGoogle={handleUnlinkGoogle}
        isLinking={isLinkingGoogle}
        isUnlinking={isUnlinkingGoogle}
        isLoading={isLoadingAccounts}
      />

      <div className="border-t border-border" />

      <PasswordManagementSection
        onUpdatePassword={handleUpdatePassword}
        isLoading={isLoadingAccounts}
      />
    </div>
  );
}
