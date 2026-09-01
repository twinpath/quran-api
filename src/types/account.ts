import type { ApiKeyStatus } from "./api-key";

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

/** Linked OAuth account info */
export interface LinkedAccount {
  id: string;
  providerId: string;
  accountId: string;
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

/** Component props for OauthIntegrationsSection */
export interface OauthIntegrationsSectionProps {
  googleConnected: boolean;
  googleEmail?: string;
  onLinkGoogle: () => void;
  onUnlinkGoogle: () => void;
  isLinking: boolean;
  isUnlinking: boolean;
  isLoading?: boolean;
}

/** Component props for PasswordManagementSection */
export interface PasswordManagementSectionProps {
  onUpdatePassword: (currentPass: string, newPass: string, confirmPass: string) => void;
  isLoading?: boolean;
}

/** Component props for NotificationPreferencesSection */
export interface NotificationPreferencesSectionProps {
  usageAlerts: boolean;
  emailNotifications: boolean;
  onTogglePreference: (key: "usageAlerts" | "emailNotifications") => void;
  onSavePreferences: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

/** Return type for useAccountProfile hook */
export interface UseAccountProfileReturn {
  profile: UserProfile;
  rateLimitData: { used: number; limit: number } | null;
  isSessionPending: boolean;
}

/** Return type for useApiKeys hook */
export interface UseApiKeysReturn {
  keys: ApiKeyItem[];
  newKeyName: string;
  setNewKeyName: (name: string) => void;
  isCreating: boolean;
  setIsCreating: (creating: boolean) => void;
  isSubmitting: boolean;
  copiedId: string | null;
  isFetching: boolean;
  handleCreateKey: (e: React.FormEvent) => Promise<void>;
  handleCopyKey: (key: ApiKeyItem) => void;
  handleRevokeKey: (id: string, name: string) => Promise<void>;
}

/** Return type for useAccountSettings hook */
export interface UseAccountSettingsReturn {
  settings: AccountSettings;
  linkedAccounts: LinkedAccount[];
  isLoadingAccounts: boolean;
  isLinkingGoogle: boolean;
  isUnlinkingGoogle: boolean;
  handleTogglePreference: (key: "usageAlerts" | "emailNotifications") => void;
  handleLinkGoogle: () => void;
  handleUnlinkGoogle: () => void;
  handleUpdatePassword: (currentPass: string, newPass: string, confirmPass: string) => Promise<void>;
  handleSavePreferences: (e: React.FormEvent) => void;
}
