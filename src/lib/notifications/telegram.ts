import { DEFAULT_TELEGRAM_BOT_USERNAME } from "@/constants";
import { getDb } from "@/lib/db";
import { telegramConnectTokens } from "@/lib/db/schema";
import { eq, and, gt } from "drizzle-orm";

interface SendTelegramAlertParams {
  chatId: string;
  message: string;
  botToken?: string;
}

interface TelegramResponse {
  ok: boolean;
  description?: string;
}

/**
 * Pure helper for sending Telegram alerts via Telegram Bot API.
 * Formats messages using HTML mode for clean presentation.
 */
export async function sendTelegramAlert({
  chatId,
  message,
  botToken,
}: SendTelegramAlertParams): Promise<{ success: boolean; error?: string }> {
  const token = botToken || process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    return {
      success: false,
      error: "Telegram bot token is not configured (TELEGRAM_BOT_TOKEN missing).",
    };
  }

  if (!chatId) {
    return {
      success: false,
      error: "Telegram Chat ID is required.",
    };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const data = (await response.json()) as TelegramResponse;

    if (!response.ok || !data.ok) {
      return {
        success: false,
        error: data.description || `Telegram API error (${response.status})`,
      };
    }

    return { success: true };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown network error";
    return { success: false, error: errorMessage };
  }
}

/**
 * Generates a Telegram Bot deep link to start a conversation with the bot.
 */
export function getTelegramBotDeepLink(botUsername?: string, startParam?: string): string {
  const username = botUsername || process.env.TELEGRAM_BOT_USERNAME || DEFAULT_TELEGRAM_BOT_USERNAME;
  if (startParam) {
    return `https://t.me/${username}?start=${encodeURIComponent(startParam)}`;
  }
  return `https://t.me/${username}`;
}

/**
 * Creates a unique, short-lived connection token for a user to link Telegram Bot via deep link.
 */
export async function createTelegramConnectToken(
  userId: string,
  env?: CloudflareEnv
): Promise<string> {
  const db = getDb(env);
  const now = new Date();

  // Check if an unexpired token already exists for this user
  try {
    const existing = await db
      .select()
      .from(telegramConnectTokens)
      .where(and(eq(telegramConnectTokens.userId, userId), gt(telegramConnectTokens.expiresAt, now)))
      .limit(1);

    if (existing.length > 0 && existing[0].token) {
      return existing[0].token;
    }
  } catch {
    // Fall back to creating a new token
  }

  const rawId = crypto.randomUUID().replace(/-/g, "");
  const token = `tok_${rawId.slice(0, 16)}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes TTL

  await db.insert(telegramConnectTokens).values({
    id: `tgt_${rawId}`,
    userId,
    token,
    expiresAt,
    createdAt: new Date(),
  });

  return token;
}

/**
 * Verifies and consumes a Telegram connection token, returning the associated userId if valid.
 */
export async function verifyAndConsumeTelegramToken(
  token: string,
  env?: CloudflareEnv
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const db = getDb(env);
  const now = new Date();

  try {
    const rows = await db
      .select()
      .from(telegramConnectTokens)
      .where(and(eq(telegramConnectTokens.token, token), gt(telegramConnectTokens.expiresAt, now)))
      .limit(1);

    if (!rows.length) {
      return { success: false, error: "Connection token is invalid or expired." };
    }

    const record = rows[0];

    // Delete token once consumed to ensure single-use
    await db.delete(telegramConnectTokens).where(eq(telegramConnectTokens.id, record.id));

    return { success: true, userId: record.userId };
  } catch (err) {
    console.error("verifyAndConsumeTelegramToken error:", err);
    return { success: false, error: "Failed to verify connection token." };
  }
}
