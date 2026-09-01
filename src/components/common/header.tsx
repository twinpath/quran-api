"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, LogIn, LogOut, User } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Logo } from "@/components/common/logo";
import { NAV_ITEMS, GITHUB_REPO_URL, SITE_NAME } from "@/constants";
import { useSession, authClient } from "@/lib/auth-client";

export function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      toast.info("Logged out successfully");
      router.push("/");
    } catch {
      toast.error("Failed to sign out");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 align-middle font-heading text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          <Logo size={32} variant="icon" className="shrink-0" />
          <span className="leading-none">{SITE_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isHash = item.href.includes("#");
            const className = "px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
            return isHash ? (
              <a key={item.href} href={item.href} className={className}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Dynamic Auth Navigation */}
        <div className="flex items-center gap-2">
          {/* GitHub Link */}
          <Button
            variant="outline"
            size="icon"
            nativeButton={false}
            render={<a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" />}
            className="hidden sm:inline-flex"
          >
            <SiGithub className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Button>

          <ThemeToggle />

          {/* Dynamic Desktop Auth Buttons (No Ghost Variant) */}
          <div className="hidden md:flex items-center gap-2 ml-1">
            {session?.user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/account" />}
                  className="gap-1.5 text-xs font-semibold cursor-pointer"
                >
                  <User className="h-3.5 w-3.5 text-primary" />
                  Account
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="gap-1.5 text-xs font-semibold cursor-pointer text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log Out
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                nativeButton={false}
                render={<Link href="/auth/signin" />}
                className="gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="border-t border-border/40 md:hidden bg-background">
          <nav className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4">
            {NAV_ITEMS.map((item) => {
              const isHash = item.href.includes("#");
              const className = "px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors rounded-none";
              return isHash ? (
                <a
                  key={item.href}
                  href={item.href}
                  className={className}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={className}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-border flex flex-col gap-2">
              {session?.user ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href="/account" />}
                    onClick={() => setMobileOpen(false)}
                    className="w-full gap-2 text-xs font-semibold justify-start cursor-pointer"
                  >
                    <User className="h-4 w-4 text-primary" />
                    Account
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMobileOpen(false);
                      handleSignOut();
                    }}
                    className="w-full gap-2 text-xs font-semibold justify-start cursor-pointer text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  nativeButton={false}
                  render={<Link href="/auth/signin" />}
                  onClick={() => setMobileOpen(false)}
                  className="w-full gap-2 text-xs font-semibold justify-start cursor-pointer"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
