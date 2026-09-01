"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, RefreshCw, CheckCircle2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AUTH_MESSAGES } from "@/constants/auth";
import type { VerifyEmailViewProps } from "@/types/auth";

export function VerifyEmailView({ isLoading = false, userEmail }: VerifyEmailViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || userEmail || "developer@example.com";

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    setIsVerifying(true);
    toast.success("Email verified successfully! Welcome to Quran Edge API.");
    setTimeout(() => {
      setIsVerifying(false);
      router.push("/account");
    }, 1200);
  };

  const handleResendCode = () => {
    setIsResending(true);
    toast.info(`A new 6-digit code has been sent to ${emailParam}`);
    setTimeout(() => setIsResending(false), 1500);
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-12 sm:py-16">
      <Card className="border-border shadow-none">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <MailCheck className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {AUTH_MESSAGES.verifyEmailTitle}
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            {AUTH_MESSAGES.verifyEmailSubtitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="p-3 bg-muted/40 border border-border text-center text-xs text-muted-foreground">
                Sent to <strong className="text-foreground font-mono">{emailParam}</strong>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground flex items-center justify-between">
                  <span>Verification Code</span>
                  <span className="text-[10px] text-muted-foreground">6-digit OTP</span>
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                  className="text-center font-mono text-lg tracking-widest uppercase h-11"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={isVerifying || isLoading}
                className="w-full gap-2 py-2.5 text-xs font-semibold cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isVerifying ? "Verifying..." : "Verify & Activate Account"}
              </Button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isResending ? "animate-spin" : ""}`} />
                  {isResending ? "Sending code..." : "Resend Verification Code"}
                </button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t border-border pt-4 text-xs text-muted-foreground">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
