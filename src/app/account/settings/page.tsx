import { Suspense } from "react";
import { AccountSettingsForm } from "@/components/account/account-settings-form";

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={<AccountSettingsForm isLoading />}>
      <AccountSettingsForm />
    </Suspense>
  );
}
