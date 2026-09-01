import { Suspense } from "react";
import { ApiKeysManager } from "@/components/account/api-keys-manager";

export default function AccountApiKeysPage() {
  return (
    <Suspense fallback={<ApiKeysManager isLoading />}>
      <ApiKeysManager />
    </Suspense>
  );
}
