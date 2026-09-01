import type { Metadata } from "next";
import { Suspense } from "react";
import { CreatePasswordForm } from "@/components/auth/create-password-form";
import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { SITE_PAGE_METADATA } from "@/constants";
import { AUTH_MESSAGES } from "@/constants/auth";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.createPassword.title,
  description: SITE_PAGE_METADATA.createPassword.description,
  path: SITE_PAGE_METADATA.createPassword.path,
});

export default function CreatePasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthCardWrapper
          title={AUTH_MESSAGES.createPasswordTitle}
          description={AUTH_MESSAGES.createPasswordSubtitle}
          isLoading
        />
      }
    >
      <CreatePasswordForm />
    </Suspense>
  );
}
