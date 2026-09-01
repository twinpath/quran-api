import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyEmailView } from "@/components/auth/verify-email-view";
import { SITE_PAGE_METADATA } from "@/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.verifyEmail.title,
  description: SITE_PAGE_METADATA.verifyEmail.description,
  path: SITE_PAGE_METADATA.verifyEmail.path,
});

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailView isLoading />}>
      <VerifyEmailView />
    </Suspense>
  );
}
