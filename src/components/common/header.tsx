"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Logo } from "@/components/common/logo";
import { NAV_ITEMS, GITHUB_REPO_URL, SITE_NAME } from "@/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 font-heading text-lg font-bold tracking-tight hover:opacity-80 transition-opacity">
          <Logo size={32} variant="icon" />
          <span>{SITE_NAME}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isHash = item.href.includes("#");
            const className = "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
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

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            render={<a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" />}
          >
            <SiGithub className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Button>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t border-border/40 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV_ITEMS.map((item) => {
              const isHash = item.href.includes("#");
              const className = "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";
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
          </nav>
        </div>
      )}
    </header>
  );
}
