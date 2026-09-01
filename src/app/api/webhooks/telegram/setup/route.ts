import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * GET/POST /api/webhooks/telegram/setup
 * Utility route to register the Telegram Webhook URL with Telegram Bot API.
 */
export async function GET(request: Request) {
  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env;
  } catch {
    // Fallback outside Cloudflare context
  }

  const botToken =
    (env as Record<string, string> | undefined)?.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken || botToken === "your-telegram-bot-token") {
    return NextResponse.json(
      { error: "TELEGRAM_BOT_TOKEN is not configured in environment variables." },
      { status: 400 }
    );
  }

  const url = new URL(request.url);
  const host = url.origin;
  const webhookUrl = `${host}/api/webhooks/telegram`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: webhookUrl,
        allowed_updates: ["message"],
      }),
    });

    const data = await res.json();
    return NextResponse.json({
      success: res.ok,
      webhookUrl,
      result: data,
    });
  } catch (err) {
    console.error("Setup webhook error:", err);
    return NextResponse.json({ error: "Failed to register Telegram webhook URL." }, { status: 500 });
  }
}
