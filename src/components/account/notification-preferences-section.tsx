"use client";

import { useState } from "react";
import { Bell, Send, ShieldAlert, Save, Check, ExternalLink, Loader2, Bot, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { DEFAULT_TELEGRAM_BOT_USERNAME } from "@/constants";
import type { NotificationPreferencesSectionProps } from "@/types/account";

export function NotificationPreferencesSection({
  usageAlerts,
  emailNotifications,
  telegramChatId = "",
  telegramBotUsername = DEFAULT_TELEGRAM_BOT_USERNAME,
  telegramConnectUrl: _telegramConnectUrl = "",
  isTestingTelegram = false,
  isDisconnectingTelegram = false,
  isConnectingTelegram = false,
  onTogglePreference,
  onUpdateTelegramChatId,
  onTestTelegramAlert,
  onDisconnectTelegram,
  onConnectTelegram,
  onSavePreferences,
  isLoading = false,
}: NotificationPreferencesSectionProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    onSavePreferences(e);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const isTelegramConnected = Boolean(telegramChatId && telegramChatId.trim().length > 0);

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Category Info */}
      <div className="lg:col-span-1 space-y-1">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notifications & Alerts
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Configure real-time Telegram quota alerts and multi-provider email security notifications.
        </p>
      </div>

      {/* Right Column: Preferences Cards */}
      <div className="lg:col-span-2 space-y-4">
        {/* Card 1: Usage & Rate Limit Alerts (via Telegram) */}
        <div className="p-4 border border-border bg-card hover:bg-muted/10 space-y-4 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Send className="h-4 w-4 text-sky-500" />
                <span className="text-sm font-medium text-foreground">Usage & Rate Limit Alerts</span>
                {isTelegramConnected ? (
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20">
                    Telegram Bot
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Receive instant alerts on Telegram when your key consumption reaches 80% daily quota or rate limit thresholds.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Switch
                id="usage-alerts-switch"
                checked={usageAlerts}
                onCheckedChange={() => onTogglePreference("usageAlerts")}
              />
              <label
                htmlFor="usage-alerts-switch"
                className="text-xs font-semibold w-16 cursor-pointer select-none text-muted-foreground"
              >
                {usageAlerts ? "Enabled" : "Disabled"}
              </label>
            </div>
          </div>

          {/* Telegram Bot Connection & Chat ID Setup */}
          {usageAlerts && (
            <div className="pt-3 border-t border-border space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Bot className="h-3.5 w-3.5 text-primary" />
                  Telegram Chat ID
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isConnectingTelegram}
                    onClick={onConnectTelegram}
                    className="h-7 text-xs gap-1.5 cursor-pointer font-medium"
                  >
                    {isConnectingTelegram ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Generating Link...
                      </>
                    ) : (
                      <>
                        <Bot className="h-3.5 w-3.5 text-sky-500" />
                        Connect Bot (@{telegramBotUsername})
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </>
                    )}
                  </Button>
                  {isTelegramConnected && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={isDisconnectingTelegram}
                      onClick={onDisconnectTelegram}
                      className="h-7 px-2 text-[11px] text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 cursor-pointer"
                    >
                      <Unlink className="h-3 w-3" />
                      Disconnect
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="e.g. 123456789 or @username"
                  value={telegramChatId}
                  onChange={(e) => onUpdateTelegramChatId(e.target.value)}
                  className="text-xs font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isTestingTelegram || !telegramChatId}
                  onClick={onTestTelegramAlert}
                  className="gap-1.5 text-xs shrink-0 cursor-pointer"
                >
                  {isTestingTelegram ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 text-sky-500" />
                      Test Alert
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Click <strong>Connect Telegram Bot</strong> to launch the bot with your unique one-click link, or paste your Chat ID manually.
              </p>
            </div>
          )}
        </div>

        {/* Card 2: System & Security Notifications (via Email Multi-Provider) */}
        <div className="p-4 border border-border bg-card hover:bg-muted/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-foreground">System & Security Notifications</span>
              <Badge variant="outline" className="text-[10px] text-muted-foreground">
                Email Multi-Provider
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Receive security alerts, password changes, and platform announcements via Email (Resend, Brevo, Cloudflare).
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Switch
              id="email-notif-switch"
              checked={emailNotifications}
              onCheckedChange={() => onTogglePreference("emailNotifications")}
            />
            <label
              htmlFor="email-notif-switch"
              className="text-xs font-semibold w-16 cursor-pointer select-none text-muted-foreground"
            >
              {emailNotifications ? "Enabled" : "Disabled"}
            </label>
          </div>
        </div>

        {/* Save Preferences Button */}
        <div className="pt-2 flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            size="sm"
            className="gap-2 cursor-pointer text-xs font-semibold"
          >
            {isSaved ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                Saved
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Preferences
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
