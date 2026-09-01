import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { sendTelegramAlert, verifyAndConsumeTelegramToken } from "@/lib/notifications/telegram";
import { eq } from "drizzle-orm";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      first_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      first_name?: string;
      type: string;
    };
    text?: string;
  };
}

/**
 * POST /api/webhooks/telegram
 * Serverless Telegram Webhook handler processing incoming bot commands & deep link connection tokens.
 */
export async function POST(request: Request) {
  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env;
  } catch {
    // Fallback outside Cloudflare context
  }

  try {
    const update = (await request.json()) as TelegramUpdate;
    const message = update?.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);
    const text = message.text.trim();
    const senderName = message.from?.first_name || "Developer";

    const botToken =
      (env as Record<string, string> | undefined)?.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

    // Check if text is a /start command
    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const tokenParam = parts[1]?.trim();

      if (tokenParam && tokenParam.startsWith("tok_")) {
        // Deep link token verification
        const verificationResult = await verifyAndConsumeTelegramToken(tokenParam, env);

        if (verificationResult.success && verificationResult.userId) {
          const db = getDb(env);
          await db
            .update(user)
            .set({
              telegramChatId: chatId,
              usageAlertsEnabled: true,
              updatedAt: new Date(),
            })
            .where(eq(user.id, verificationResult.userId));

          await sendTelegramAlert({
            chatId,
            botToken,
            message: `🤖 <b>Quran API Bot Connected!</b>\n\nSelamat datang, <b>${senderName}</b>!\nAkun Telegram Anda berhasil terhubung dengan akun Quran API.\n\nChat ID: <code>${chatId}</code>\nAnda sekarang akan menerima notifikasi instan saat penggunaan API Key mencapai 80% kuota harian.`,
          });
        } else {
          await sendTelegramAlert({
            chatId,
            botToken,
            message: `⚠️ <b>Token Koneksi Tidak Valid</b>\n\nToken koneksi Telegram ini tidak valid atau sudah kadaluarsa.\nSilakan buka halaman <b>Account Settings</b> pada dashboard Quran API dan klik tombol <b>Connect Telegram Bot</b> kembali.`,
          });
        }
      } else {
        // Plain /start command without token
        await sendTelegramAlert({
          chatId,
          botToken,
          message: `🤖 <b>Quran API Bot</b>\n\nHalo <b>${senderName}</b>!\n\nTelegram Chat ID Anda: <code>${chatId}</code>\n\nUntuk menghubungkan otomatis akun Quran API Anda, silakan klik tombol <b>Connect Telegram Bot</b> di halaman Account Settings dashboard Quran API.`,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("POST /api/webhooks/telegram error:", err);
    return NextResponse.json({ ok: true }); // Always return 200 OK to Telegram webhook to avoid retries
  }
}
