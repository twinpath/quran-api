import type { AccountTab, UserProfile, ApiKeyItem, AccountSettings } from "@/types/account";

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

/** Mock default user profile for developer account view */
export const DEFAULT_USER_PROFILE: UserProfile = {
  id: "usr_quran_8921",
  name: "Twinpath Developer",
  email: "developer@twinpath.id",
  tier: "Developer",
  memberSince: "September 2026",
  apiUsageToday: 1420,
  apiUsageLimit: 5000,
};

/** Mock default API keys list */
export const DEFAULT_API_KEYS: ApiKeyItem[] = [
  {
    id: "key_live_01",
    name: "Production Web App",
    keyMasked: "quran_live_8f...4a1b",
    createdAt: "2026-08-15",
    lastUsed: "Just now",
    status: "active",
    rateLimit: "5,000 req/day",
  },
  {
    id: "key_live_02",
    name: "Mobile App Staging",
    keyMasked: "quran_live_3c...9x2e",
    createdAt: "2026-08-20",
    lastUsed: "2 hours ago",
    status: "active",
    rateLimit: "5,000 req/day",
  },
];

/** Mock default account settings */
export const DEFAULT_ACCOUNT_SETTINGS: AccountSettings = {
  emailNotifications: true,
  usageAlerts: true,
  security2FA: false,
  themePreference: "system",
  googleConnected: true,
  googleEmail: "developer@gmail.com",
};
