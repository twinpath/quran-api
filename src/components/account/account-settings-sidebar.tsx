"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Bell, AlertTriangle } from "lucide-react";
import { ACCOUNT_SETTINGS_NAV_ITEMS } from "@/constants/account";

const ICON_MAP = {
  ShieldCheck,
  Bell,
  AlertTriangle,
} as const;

export function AccountSettingsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1" aria-label="Settings navigation">
      {ACCOUNT_SETTINGS_NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.iconName as keyof typeof ICON_MAP] || ShieldCheck;
        const isActive = pathname === item.href;
        const isDanger = item.iconName === "AlertTriangle";

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 px-4 py-3.5 text-sm transition-all border-l-2 ${
              isActive
                ? isDanger
                  ? "border-l-destructive bg-destructive/10 text-destructive font-medium"
                  : "border-l-primary bg-primary/10 text-foreground font-medium"
                : "border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 transition-colors ${
                isActive
                  ? isDanger
                    ? "text-destructive"
                    : "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            />
            <div className="flex flex-col gap-0.5">
              <span className="font-medium leading-none">{item.label}</span>
              <span
                className={`text-[11px] leading-tight ${
                  isActive ? "text-muted-foreground" : "text-muted-foreground/70"
                }`}
              >
                {item.description}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
