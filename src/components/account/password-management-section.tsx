"use client";

import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/common/password-input";
import { Skeleton } from "@/components/ui/skeleton";
import type { PasswordManagementSectionProps } from "@/types/account";

export function PasswordManagementSection({
  onUpdatePassword,
  isLoading = false,
}: PasswordManagementSectionProps) {
  const [passwordState, setPasswordState] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onUpdatePassword(
      passwordState.currentPassword,
      passwordState.newPassword,
      passwordState.confirmPassword
    );
    setTimeout(() => {
      setIsSubmitting(false);
      setPasswordState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }, 1000);
  };

  if (isLoading) {
    return <Skeleton className="h-32 w-full" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Category Info */}
      <div className="lg:col-span-1 space-y-1">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          Password & Credentials
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Update your account password. Per Unified Hybrid policy, password login is enabled for all registered accounts.
        </p>
      </div>

      {/* Right Column: Password Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="p-4 border border-border bg-card space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Current Password</label>
            <PasswordInput
              name="currentPassword"
              placeholder="••••••••"
              value={passwordState.currentPassword}
              onChange={handleChange}
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">New Password</label>
              <PasswordInput
                name="newPassword"
                placeholder="Min 8 characters"
                value={passwordState.newPassword}
                onChange={handleChange}
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Confirm New Password</label>
              <PasswordInput
                name="confirmPassword"
                placeholder="Re-enter new password"
                value={passwordState.confirmPassword}
                onChange={handleChange}
                className="text-xs"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
