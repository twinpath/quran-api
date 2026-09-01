"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, authClient } from "@/lib/auth-client";

export function AccountAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      async function checkPasswordCondition() {
        try {
          const { data: accounts } = await authClient.listAccounts();
          if (accounts && accounts.length > 0) {
            const hasCredential = accounts.some((a) => a.providerId === "credential");
            const isOAuthOnly = !hasCredential && accounts.some((a) => a.providerId === "google");
            if (isOAuthOnly) {
              router.push("/auth/create-password");
            }
          }
        } catch (err) {
          console.error("Error checking layout account password condition:", err);
        }
      }
      checkPasswordCondition();
    }
  }, [session, router]);

  return <>{children}</>;
}
