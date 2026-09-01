"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { AuthCardWrapperProps } from "@/types/auth";

export function AuthCardWrapper({
  title,
  description,
  children,
  footerText,
  footerLinkText,
  footerLinkHref,
  showGoogleAuth = false,
  onGoogleAuth,
  isLoading = false,
}: AuthCardWrapperProps) {
  return (
    <div className="container max-w-md mx-auto px-4 py-12 sm:py-16">
      <Card className="border-border shadow-none">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              {showGoogleAuth && (
                <div className="space-y-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onGoogleAuth}
                    className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold cursor-pointer border-border hover:bg-muted/50"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
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
                    Continue with Google
                  </Button>

                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative bg-card px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                      Or with email
                    </div>
                  </div>
                </div>
              )}

              {children}
            </>
          )}
        </CardContent>

        {footerText && footerLinkText && footerLinkHref && (
          <CardFooter className="justify-center border-t border-border pt-4 text-xs text-muted-foreground">
            <span>{footerText}</span>{" "}
            <Link
              href={footerLinkHref}
              className="ml-1 font-semibold text-primary hover:underline cursor-pointer"
            >
              {footerLinkText}
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
