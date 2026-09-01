import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { sendTelegramAlert } from "@/lib/notifications/telegram";
import { getCloudflareContext } from "@opennextjs/cloudflare";

async function getAuthenticatedUser(env?: CloudflareEnv) {
  try {
    const auth = getAuth(env);
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

/**
 * POST /api/notifications/test-telegram
 * Sends a test Telegram notification to the specified or configured Telegram Chat ID.
 */
export async function POST(request: Request) {
  let env: CloudflareEnv | undefined;
  try {
    env = getCloudflareContext().env;
  } catch {
    // Fallback outside Cloudflare context
  }

  const authUser = await getAuthenticatedUser(env);
  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { chatId?: string };
    const chatId = body?.chatId?.trim();

    if (!chatId) {
      return NextResponse.json({ error: "Please provide a valid Telegram Chat ID" }, { status: 400 });
    }

    const botToken =
      (env as Record<string, string> | undefined)?.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;

    const message = `[ALERT] <b>Quran API Alert System Test</b>\n\nHello <b>${authUser.name || "Developer"}</b>!\nYour Telegram notification setup for rate limits and quota alerts is working successfully.`;

    const result = await sendTelegramAlert({
      chatId,
      message,
      botToken,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to send Telegram test message" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Test message sent to Telegram successfully!",
    });
  } catch (err) {
    console.error("POST /api/notifications/test-telegram error:", err);
    return NextResponse.json({ error: "Failed to send Telegram test message" }, { status: 500 });
  }
}
