"use client";

import { UserPlus, User, Mail, Key } from "lucide-react";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/common/password-input";
import { AUTH_MESSAGES } from "@/constants/auth";
import { useSignUpForm } from "@/hooks/use-sign-up-form";
import type { SignUpFormProps } from "@/types/auth";

export function SignUpForm({ isLoading = false }: SignUpFormProps) {
  const {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleGoogleAuth,
  } = useSignUpForm();

  return (
    <AuthCardWrapper
      title={AUTH_MESSAGES.signUpTitle}
      description={AUTH_MESSAGES.signUpSubtitle}
      showGoogleAuth
      onGoogleAuth={handleGoogleAuth}
      footerText="Already have a developer account?"
      footerLinkText="Sign In"
      footerLinkHref="/auth/signin"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Full Name
          </label>
          <Input
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Email Address
          </label>
          <Input
            type="email"
            name="email"
            placeholder="developer@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-muted-foreground" />
            Password
          </label>
          <PasswordInput
            name="password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={handleChange}
            required
            className="text-xs"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-muted-foreground" />
            Confirm Password
          </label>
          <PasswordInput
            name="confirmPassword"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="text-xs"
          />
        </div>

        <div className="flex items-center gap-2 pt-1 text-xs">
          <label className="flex items-start gap-2 cursor-pointer text-muted-foreground leading-snug">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="accent-primary h-3.5 w-3.5 mt-0.5 rounded-none cursor-pointer"
            />
            <span>
              I agree to the Terms of Service and Privacy Policy for Quran Edge API.
            </span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full gap-2 py-2.5 text-xs font-semibold cursor-pointer mt-2"
        >
          <UserPlus className="h-4 w-4" />
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}
