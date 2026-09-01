import type { Metadata } from "next";
import { Suspense } from "react";
import { SignUpForm } from "@/components/auth/signup-form";
import { AuthCardWrapper } from "@/components/auth/auth-card-wrapper";
import { SITE_PAGE_METADATA } from "@/constants";
import { AUTH_MESSAGES } from "@/constants/auth";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_PAGE_METADATA.signup.title,
  description: SITE_PAGE_METADATA.signup.description,
  path: SITE_PAGE_METADATA.signup.path,
});

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <AuthCardWrapper
          title={AUTH_MESSAGES.signUpTitle}
          description={AUTH_MESSAGES.signUpSubtitle}
          isLoading
        />
      }
    >
      <SignUpForm />
    </Suspense>
  );
}
