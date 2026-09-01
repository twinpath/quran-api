"use client";

import { KeyRound, Unlink, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import type { OauthIntegrationsSectionProps } from "@/types/account";

export function OauthIntegrationsSection({
  googleConnected = false,
  googleEmail,
  onLinkGoogle,
  onUnlinkGoogle,
  isLinking,
  isUnlinking,
  isLoading = false,
}: OauthIntegrationsSectionProps) {
  const isProcessing = isLinking || isUnlinking;

  if (isLoading) {
    return <Skeleton className="h-24 w-full" />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
      {/* Left Column: Category Info */}
      <div className="lg:col-span-1 space-y-1">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-primary" />
          OAuth Integrations
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Connect or disconnect social OAuth providers. Single Email policy ensures seamless multi-login access.
        </p>
      </div>

      {/* Right Column: Integration Card */}
      <div className="lg:col-span-2 space-y-3">
        <div className="p-4 border border-border bg-card hover:bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-muted border border-border shrink-0 mt-0.5">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">Google OAuth</span>
                {googleConnected ? (
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] text-muted-foreground">
                    Not Linked
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {googleConnected
                  ? `Linked to ${googleEmail}`
                  : "Link your Google account for one-click sign in."}
              </p>
            </div>
          </div>

          {googleConnected ? (
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isProcessing}
                    className="gap-1.5 text-xs shrink-0 cursor-pointer"
                  >
                    <Unlink className="h-3.5 w-3.5 text-destructive" />
                    {isUnlinking ? "Disconnecting..." : "Disconnect"}
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Disconnect Google OAuth?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to disconnect Google OAuth account{" "}
                    <span className="font-semibold text-foreground">{googleEmail || "linked to your profile"}</span>?
                    You can reconnect it at any time.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={onUnlinkGoogle} className="cursor-pointer">
                    Disconnect Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              type="button"
              variant="default"
              size="sm"
              disabled={isProcessing}
              onClick={onLinkGoogle}
              className="gap-1.5 text-xs shrink-0 cursor-pointer"
            >
              <Link2 className="h-3.5 w-3.5" />
              {isLinking ? "Connecting..." : "Connect Google"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
