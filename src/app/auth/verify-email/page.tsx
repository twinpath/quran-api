import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailView } from "@/components/auth/verify-email-view";
import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { SITE_PAGE_METADATA } from "@/constants";
import { AUTH_MESSAGES } from "@/constants/auth";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.verifyEmail.title,
  description: SITE_PAGE_METADATA.verifyEmail.description,
  path: SITE_PAGE_METADATA.verifyEmail.path,
});

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthCardWrapper
          title={AUTH_MESSAGES.verifyEmailTitle}
          description={AUTH_MESSAGES.verifyEmailSubtitle}
          isLoading
        />
      }
    >
      <VerifyEmailView />
    </Suspense>
  );
}
