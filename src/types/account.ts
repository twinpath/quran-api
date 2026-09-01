/** Account tab navigation item definition */
export interface AccountTab {
  value: string;
  label: string;
  href: string;
  iconName: string;
}

/** User profile details */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  tier: "Free" | "Developer" | "Enterprise";
  memberSince: string;
  apiUsageToday: number;
  apiUsageLimit: number;
}

/** API key item status */
export type ApiKeyStatus = "active" | "revoked" | "expired";

/** API Key item definition */
export interface ApiKeyItem {
  id: string;
  name: string;
  keyMasked: string;
  fullKey?: string;
  createdAt: string;
  lastUsed: string;
  status: ApiKeyStatus;
  rateLimit: string;
}

/** User account settings */
export interface AccountSettings {
  emailNotifications: boolean;
  usageAlerts: boolean;
  security2FA: boolean;
  themePreference: "system" | "light" | "dark";
  googleConnected?: boolean;
  googleEmail?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/** Component props for ProfileOverview */
export interface ProfileOverviewProps {
  isLoading?: boolean;
}

/** Component props for ApiKeysManager */
export interface ApiKeysManagerProps {
  isLoading?: boolean;
}

/** Component props for AccountSettingsForm */
export interface AccountSettingsFormProps {
  isLoading?: boolean;
}

