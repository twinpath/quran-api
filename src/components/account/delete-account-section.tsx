"use client";

import { useState } from "react";
import { AlertTriangle, Trash2, ShieldAlert, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PasswordInput } from "@/components/common/password-input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { DeleteAccountSectionProps } from "@/types/account";

export function DeleteAccountSection({
  onDeleteAccount,
  isDeleting = false,
  isLoading = false,
}: DeleteAccountSectionProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setStep(1);
      setPassword("");
    }
  };

  const handleProceedToStep2 = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    const success = await onDeleteAccount(password);
    if (success) {
      setIsOpen(false);
      setPassword("");
      setStep(1);
    }
  };

  if (isLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
      {/* Left Column: Category Info */}
      <div className="lg:col-span-1 space-y-1">
        <h3 className="text-base font-semibold text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          Danger Zone
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Permanently delete your developer account and remove all associated API credentials and usage logs.
        </p>
      </div>

      {/* Right Column: Danger Action Card */}
      <div className="lg:col-span-2 space-y-3">
        <div className="p-4 border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-destructive/10 border border-destructive/20 shrink-0 mt-0.5">
              <ShieldAlert className="h-4 w-4 text-destructive" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Delete Account</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Once deleted, your account and API keys cannot be recovered.
              </p>
            </div>
          </div>

          <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
            <AlertDialogTrigger
              render={
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={isDeleting}
                  className="gap-1.5 text-xs shrink-0 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </Button>
              }
            />
            <AlertDialogContent className="max-w-md">
              {step === 1 ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      Delete Account Permanently?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2 pt-2">
                      <p>
                        This action is <strong>permanent and non-reversible</strong>.
                      </p>
                      <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                        <li>All active API Keys will be immediately revoked.</li>
                        <li>Telemetry usage history and logs will be permanently deleted.</li>
                        <li>Connected Google OAuth credentials will be unlinked.</li>
                      </ul>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="pt-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      onClick={handleProceedToStep2}
                    >
                      Proceed to Verification
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </>
              ) : (
                <form onSubmit={handleConfirmDelete}>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                      <ShieldAlert className="h-5 w-5 shrink-0" />
                      Authorize Account Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-3 pt-2">
                      <p>
                        Please enter your account password to authorize permanent deletion.
                      </p>
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                          <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                          Account Password
                        </label>
                        <PasswordInput
                          name="deleteConfirmPassword"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          autoFocus
                          className="text-xs"
                        />
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="pt-4">
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={!password || isDeleting}
                      className="text-xs gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {isDeleting ? "Deleting..." : "Permanently Delete Account"}
                    </Button>
                  </AlertDialogFooter>
                </form>
              )}
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
