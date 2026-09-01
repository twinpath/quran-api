"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, User, Mail, Key } from "lucide-react";
import { toast } from "sonner";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/common/password-input";
import { AUTH_MESSAGES } from "@/constants/auth";
import { authClient } from "@/lib/auth-client";
import type { SignUpFormProps, SignUpFormData } from "@/types/auth";

export function SignUpForm({ isLoading = false }: SignUpFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("Please accept the Terms of Service");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Failed to create account");
      } else {
        toast.success("Account created successfully!");
        router.push("/account");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      toast.error("An unexpected error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      toast.info("Redirecting to Google OAuth...");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/account",
      });
    } catch (err) {
      console.error("Google OAuth error:", err);
      toast.error("Failed to initiate Google authentication");
    }
  };

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
