"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useAuthError } from "./use-auth-error";
import type { SignInFormData, UseSignInFormReturn } from "@/types/auth";

/**
 * Custom hook to manage SignIn form state, validation, email/password submission,
 * Google OAuth redirection, and error parameter detection.
 */
export function useSignInForm(): UseSignInFormReturn {
  const router = useRouter();
  useAuthError();

  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in both email and password");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password");
      } else {
        toast.success("Signed in successfully!");
        router.push("/account");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast.error("An unexpected error occurred during authentication");
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

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleGoogleAuth,
  };
}
