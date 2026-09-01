"use client";

import { usePathname, useRouter } from "next/navigation";
import { User, Key, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACCOUNT_TABS } from "@/constants/account";

const ICON_MAP = {
  User,
  Key,
  Settings,
} as const;

export function AccountNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  // Match current active pathname to tabs or default to /account
  const activeValue = ACCOUNT_TABS.some((tab) => tab.href === pathname)
    ? pathname
    : "/account";

  const handleTabChange = (value: string) => {
    router.push(value);
  };

  return (
    <div className="w-full mb-6">
      <Tabs value={activeValue} onValueChange={handleTabChange}>
        <TabsList className="inline-flex w-full sm:w-auto h-auto p-1 bg-muted/80 dark:bg-muted/60 border border-border justify-start gap-1">
          {ACCOUNT_TABS.map((tab) => {
            const Icon = ICON_MAP[tab.iconName as keyof typeof ICON_MAP] || User;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="py-2 px-4 text-sm font-medium transition-all rounded-none border border-transparent data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:border-border data-[state=active]:shadow-xs hover:text-foreground text-muted-foreground"
              >
                <Icon className="h-4 w-4 mr-2 text-primary" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
