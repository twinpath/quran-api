"use client";

import Link from "next/link";
import { BookOpen, GitFork, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { NAV_ITEMS, GITHUB_REPO_URL, SITE_NAME } from "@/lib/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold tracking-tight">
          <BookOpen className="h-5 w-5 text-primary" />
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
            variant="outline"
            size="sm"
            className="hidden gap-2 sm:flex"
            nativeButton={false}
            render={<a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer" />}
          >
            <GitFork className="h-4 w-4" />
            <span>GitHub</span>
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
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <GitFork className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
