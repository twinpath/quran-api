import { DEFAULT_TELEGRAM_BOT_USERNAME } from "@/constants";

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
