"use client";

import { DeleteAccountSection } from "@/components/account/delete-account-section";
import { useAccountDelete } from "@/hooks/use-account-delete";

export default function DangerZoneSettingsPage() {
  const { isDeletingAccount, handleDeleteAccount } = useAccountDelete();

  return (
    <div className="space-y-8">
      <DeleteAccountSection
        onDeleteAccount={handleDeleteAccount}
        isDeleting={isDeletingAccount}
      />
    </div>
  );
}
