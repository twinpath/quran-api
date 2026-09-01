import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAuth } from "@/lib/auth";
import { createTelegramConnectToken, getTelegramBotDeepLink } from "@/lib/notifications/telegram";
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
 * GET /api/account/notifications/telegram-token
 * Generates a unique short-lived Telegram deep link token for the current user.
 */
export async function GET() {
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
    const botUsername =
      (env as Record<string, string> | undefined)?.TELEGRAM_BOT_USERNAME ||
      process.env.TELEGRAM_BOT_USERNAME;

    const token = await createTelegramConnectToken(authUser.id, env);
    const deepLink = getTelegramBotDeepLink(botUsername, token);

    return NextResponse.json({
      success: true,
      data: {
        token,
        deepLink,
        botUsername,
      },
    });
  } catch (err) {
    console.error("GET /api/account/notifications/telegram-token error:", err);
    return NextResponse.json({ error: "Failed to generate Telegram connect token" }, { status: 500 });
  }
}
