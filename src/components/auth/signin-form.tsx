"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Key } from "lucide-react";
import { toast } from "sonner";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/common/password-input";
import { AUTH_MESSAGES } from "@/constants/auth";
import type { SignInFormProps, SignInFormData } from "@/types/auth";

export function SignInForm({ isLoading = false }: SignInFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: true,
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
    if (!formData.email || !formData.password) {
      toast.error("Please fill in both email and password");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = (await res.json()) as { success: boolean; error?: string; message?: string };
      if (json.success) {
        toast.success(json.message || "Signed in successfully!");
        router.push("/account");
      } else {
        toast.error(json.error || "Invalid email or password");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleGoogleAuth = () => {
    toast.info("Google OAuth initiated. Redirecting to Google Auth...");
    setTimeout(() => {
      router.push("/auth/create-password");
    }, 1200);
  };

  return (
    <AuthCardWrapper
      title={AUTH_MESSAGES.signInTitle}
      description={AUTH_MESSAGES.signInSubtitle}
      showGoogleAuth
      onGoogleAuth={handleGoogleAuth}
      footerText="Don't have a developer account?"
      footerLinkText="Sign Up"
      footerLinkHref="/auth/signup"
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
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

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Key className="h-3.5 w-3.5 text-muted-foreground" />
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[11px] font-medium text-primary hover:underline cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="text-xs"
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="accent-primary h-3.5 w-3.5 rounded-none cursor-pointer"
            />
            <span>Remember this device</span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full gap-2 py-2.5 text-xs font-semibold cursor-pointer"
        >
          <LogIn className="h-4 w-4" />
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}
