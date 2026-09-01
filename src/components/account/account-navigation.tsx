"use client";

import { useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, Key, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACCOUNT_TABS } from "@/constants/account";

const ICON_MAP = {
  User,
  Key,
  Settings,
} as const;

const emptySubscribe = () => () => {};

export function AccountNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  // Hydration safety using React useSyncExternalStore
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Match current active pathname to tabs or default to /account
  const activeValue =
    ACCOUNT_TABS.find((tab) =>
      tab.href === "/account"
        ? pathname === "/account"
        : pathname.startsWith(tab.href)
    )?.value || "/account";

  const handleTabChange = (value: string) => {
    router.push(value);
  };

  if (!mounted) {
    return (
      <div className="w-full mb-6">
        <div className="grid w-full grid-cols-3 h-auto p-1 sm:p-1.5 bg-muted/80 dark:bg-muted border border-border gap-1 sm:gap-1.5">
          {ACCOUNT_TABS.map((tab) => {
            const Icon = ICON_MAP[tab.iconName as keyof typeof ICON_MAP] || User;
            const isActive = tab.href === (pathname || "/account");
            return (
              <div
                key={tab.value}
                className={`w-full flex items-center justify-center text-center py-2.5 sm:py-3 px-2 sm:px-5 text-xs sm:text-sm font-semibold transition-all rounded-none border text-muted-foreground ${
                  isActive
                    ? "bg-card text-card-foreground border-border shadow-xs"
                    : "border-transparent"
                }`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0 text-primary" />
                {tab.label}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-6">
      <Tabs value={activeValue} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 group-data-horizontal/tabs:h-auto h-auto p-1 sm:p-1.5 bg-muted/80 dark:bg-muted border border-border gap-1 sm:gap-1.5">
          {ACCOUNT_TABS.map((tab) => {
            const Icon = ICON_MAP[tab.iconName as keyof typeof ICON_MAP] || User;
            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="w-full flex items-center justify-center text-center py-2.5 sm:py-3 px-2 sm:px-5 text-xs sm:text-sm font-semibold transition-all rounded-none border border-transparent text-muted-foreground hover:text-foreground data-active:bg-card data-active:text-card-foreground data-active:border-border dark:data-active:bg-card dark:data-active:text-card-foreground dark:data-active:border-border shadow-xs cursor-pointer"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 shrink-0 text-primary" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
}
