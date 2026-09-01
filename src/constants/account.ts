import type { AccountTab } from "@/types/account";

/** Account tab items for route-based tab navigation */
export const ACCOUNT_TABS: AccountTab[] = [
  {
    value: "/account",
    label: "Profile",
    href: "/account",
    iconName: "User",
  },
  {
    value: "/account/api-keys",
    label: "API Keys",
    href: "/account/api-keys",
    iconName: "Key",
  },
  {
    value: "/account/settings",
    label: "Settings",
    href: "/account/settings",
    iconName: "Settings",
  },
];
