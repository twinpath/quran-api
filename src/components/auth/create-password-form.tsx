"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/common/password-input";
import { AUTH_MESSAGES } from "@/constants/auth";
import { authClient, useSession } from "@/lib/auth-client";
import type { CreatePasswordFormProps, CreatePasswordFormData } from "@/types/auth";
import { useEffect } from "react";

export function CreatePasswordForm({ isLoading = false }: CreatePasswordFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState<CreatePasswordFormData>({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      async function checkAlreadyHasPassword() {
        try {
          const { data: accounts } = await authClient.listAccounts();
          const hasCredential = accounts?.some((a) => a.providerId === "credential");
          if (hasCredential) {
            toast.info("Your account already has a password.");
            router.push("/account");
          }
        } catch {
          // ignore check failure
        }
      }
      checkAlreadyHasPassword();
    }
  }, [session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.password || !formData.confirmPassword) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: "",
        newPassword: formData.password,
        revokeOtherSessions: false,
      });

      if (error) {
        toast.error(error.message || "Failed to save password");
      } else {
        toast.success("Password created! Your account is now fully active with multi-login support.");
        router.push("/account");
      }
    } catch (err) {
      console.error("Create password error:", err);
      toast.error("An unexpected error occurred while saving password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCardWrapper
      title={AUTH_MESSAGES.createPasswordTitle}
      description={AUTH_MESSAGES.createPasswordSubtitle}
      isLoading={isLoading}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-muted/40 border border-border text-xs text-muted-foreground space-y-1">
          <div className="font-semibold text-foreground flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Unified Account Policy
          </div>
          <p className="text-[11px] leading-relaxed">
            Creating a password allows you to log in using either <strong>Google OAuth</strong> or <strong>Email & Password</strong> interchangeably.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
            New Password
          </label>
          <PasswordInput
            name="password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={handleChange}
            required
            className="text-xs"
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
            <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
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

        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full gap-2 py-2.5 text-xs font-semibold cursor-pointer mt-2"
        >
          <Check className="h-4 w-4" />
          {isSubmitting ? "Saving Password..." : "Save Password & Activate"}
        </Button>
      </form>
    </AuthCardWrapper>
  );
}
