import type { ApiKeyStatus, ExpirationOption } from "./api-key";

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
  createdAt: string;
  expiresAt?: string | null;
  expiresLabel: string;
  isExpired: boolean;
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
  telegramChatId?: string;
  telegramConnected?: boolean;
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
  telegramChatId?: string;
  telegramBotUsername?: string;
  telegramConnectUrl?: string;
  isTestingTelegram?: boolean;
  isDisconnectingTelegram?: boolean;
  isConnectingTelegram?: boolean;
  onTogglePreference: (key: "usageAlerts" | "emailNotifications") => void;
  onUpdateTelegramChatId: (chatId: string) => void;
  onTestTelegramAlert: () => Promise<void>;
  onDisconnectTelegram: () => Promise<void>;
  onConnectTelegram?: () => Promise<void>;
  onSavePreferences: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

/** Component props for DeleteAccountSection */
export interface DeleteAccountSectionProps {
  onDeleteAccount: (password: string) => Promise<boolean>;
  isDeleting?: boolean;
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
  expirationOption: ExpirationOption;
  setExpirationOption: (option: ExpirationOption) => void;
  customDays: number;
  setCustomDays: (days: number) => void;
  isSheetOpen: boolean;
  setIsSheetOpen: (open: boolean) => void;
  isSubmitting: boolean;
  createdRawKey: string | null;
  isFetching: boolean;
  handleCreateKey: (e: React.FormEvent) => Promise<void>;
  handleRevokeKey: (id: string, name: string) => Promise<void>;
  handleDeleteKey: (id: string, name: string) => Promise<void>;
  handleCloseSheet: () => void;
}

/** Return type for useAccountOauth hook */
export interface UseAccountOauthReturn {
  linkedAccounts: LinkedAccount[];
  isLoadingAccounts: boolean;
  isLinkingGoogle: boolean;
  isUnlinkingGoogle: boolean;
  googleConnected: boolean;
  googleEmail?: string;
  handleLinkGoogle: () => void;
  handleUnlinkGoogle: () => void;
}

/** Return type for useAccountPassword hook */
export interface UseAccountPasswordReturn {
  handleUpdatePassword: (currentPass: string, newPass: string, confirmPass: string) => Promise<void>;
}

/** Return type for useAccountNotifications hook */
export interface UseAccountNotificationsReturn {
  usageAlerts: boolean;
  emailNotifications: boolean;
  telegramChatId: string;
  telegramBotUsername: string;
  telegramConnectUrl: string;
  isTestingTelegram: boolean;
  isDisconnectingTelegram: boolean;
  isConnectingTelegram: boolean;
  isLoadingNotifications: boolean;
  handleTogglePreference: (key: "usageAlerts" | "emailNotifications") => void;
  handleUpdateTelegramChatId: (chatId: string) => void;
  handleTestTelegramAlert: () => Promise<void>;
  handleDisconnectTelegram: () => Promise<void>;
  handleConnectTelegram: () => Promise<void>;
  handleSavePreferences: (e?: React.FormEvent) => void;
}

/** Return type for useAccountDelete hook */
export interface UseAccountDeleteReturn {
  isDeletingAccount: boolean;
  handleDeleteAccount: (password: string) => Promise<boolean>;
}

/** Settings sidebar navigation item */
export interface AccountSettingsSidebarItem {
  label: string;
  href: string;
  iconName: string;
  description: string;
}
