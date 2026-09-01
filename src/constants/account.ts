import type { AccountTab, AccountSettingsSidebarItem } from "@/types/account";

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

/** Default Telegram bot username for rate limit & quota alerts */
export const DEFAULT_TELEGRAM_BOT_USERNAME = "QuranApiAlertsBot";

/** Sidebar navigation items for /account/settings sub-pages */
export const ACCOUNT_SETTINGS_NAV_ITEMS: AccountSettingsSidebarItem[] = [
  {
    label: "Security & Credentials",
    href: "/account/settings/security",
    iconName: "ShieldCheck",
    description: "OAuth integrations and password management",
  },
  {
    label: "Notifications & Alerts",
    href: "/account/settings/notifications",
    iconName: "Bell",
    description: "Telegram alerts and email preferences",
  },
  {
    label: "Danger Zone",
    href: "/account/settings/danger-zone",
    iconName: "AlertTriangle",
    description: "Account deletion and data removal",
  },
];
