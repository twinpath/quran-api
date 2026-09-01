"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { AuthCardWrapper } from "./auth-card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AUTH_MESSAGES } from "@/constants/auth";
import type { ForgotPasswordFormProps, ForgotPasswordFormData } from "@/types/auth";

export function ForgotPasswordForm({ isLoading = false }: ForgotPasswordFormProps) {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error("Please enter your registered email address");
      return;
    }

    setIsSubmitting(true);
    toast.success(`Password reset link sent to ${formData.email}`);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 1200);
  };

  return (
    <AuthCardWrapper
      title={AUTH_MESSAGES.forgotPasswordTitle}
      description={AUTH_MESSAGES.forgotPasswordSubtitle}
      isLoading={isLoading}
    >
      {isSent ? (
        <div className="space-y-4 text-center py-2">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
            A password reset email has been sent to <strong>{formData.email}</strong>. Check your inbox and follow the link to reset your password.
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsSent(false)}
            className="w-full text-xs cursor-pointer"
          >
            Resend Email
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Registered Email Address
            </label>
            <Input
              type="email"
              placeholder="developer@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ email: e.target.value })}
              required
              className="text-xs"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full gap-2 py-2.5 text-xs font-semibold cursor-pointer"
          >
            <Send className="h-4 w-4" />
            {isSubmitting ? "Sending Reset Link..." : "Send Reset Link"}
          </Button>
        </form>
      )}

      <div className="pt-3 text-center border-t border-border mt-4">
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer font-medium"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Sign In
        </Link>
      </div>
    </AuthCardWrapper>
  );
}
