"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { useAuthError } from "./use-auth-error";
import type { SignUpFormData, UseSignUpFormReturn } from "@/types/auth";

/**
 * Custom hook to manage SignUp form state, field validation, account registration via Better Auth,
 * Google OAuth redirection, and error parameter detection.
 */
export function useSignUpForm(): UseSignUpFormReturn {
  const router = useRouter();
  useAuthError();

  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: true,
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

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleGoogleAuth,
  };
}
