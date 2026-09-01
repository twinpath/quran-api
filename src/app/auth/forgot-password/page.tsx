import type { Metadata } from "next";
import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { SITE_PAGE_METADATA } from "@/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.forgotPassword.title,
  description: SITE_PAGE_METADATA.forgotPassword.description,
  path: SITE_PAGE_METADATA.forgotPassword.path,
});

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<ForgotPasswordForm isLoading />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
