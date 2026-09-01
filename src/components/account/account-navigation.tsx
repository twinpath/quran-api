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
    <div className="w-full border-b border-border mb-6">
      <Tabs value={activeValue} onValueChange={handleTabChange}>
        <TabsList variant="line" className="w-full justify-start h-auto p-0 gap-6 bg-transparent border-b-0">
          {ACCOUNT_TABS.map((tab) => {
            const Icon = ICON_MAP[tab.iconName as keyof typeof ICON_MAP] || User;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="py-3 px-1 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary rounded-none bg-transparent hover:text-foreground"
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
