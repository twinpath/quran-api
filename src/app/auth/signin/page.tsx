import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/components/auth/signin-form";
import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { SITE_PAGE_METADATA } from "@/constants";
import { AUTH_MESSAGES } from "@/constants/auth";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.signin.title,
  description: SITE_PAGE_METADATA.signin.description,
  path: SITE_PAGE_METADATA.signin.path,
});

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <AuthCardWrapper
          title={AUTH_MESSAGES.signInTitle}
          description={AUTH_MESSAGES.signInSubtitle}
          isLoading
        />
      }
    >
      <SignInForm />
    </Suspense>
  );
}
