import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getDb } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { getAuth } from "@/lib/auth";
import { DEFAULT_TELEGRAM_BOT_USERNAME } from "@/constants";
import { eq } from "drizzle-orm";
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
 * GET /api/account/notifications
 * Retrieves the current user's notification preferences and Telegram settings.
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
    const db = getDb(env);
    const rows = await db.select().from(user).where(eq(user.id, authUser.id)).limit(1);
    const userData = rows[0];

    const telegramBotUsername =
      (env as Record<string, string> | undefined)?.TELEGRAM_BOT_USERNAME ||
      process.env.TELEGRAM_BOT_USERNAME ||
      DEFAULT_TELEGRAM_BOT_USERNAME;

    return NextResponse.json({
      success: true,
      data: {
        telegramChatId: userData?.telegramChatId || "",
        usageAlerts: userData?.usageAlertsEnabled ?? true,
        emailNotifications: userData?.emailNotificationsEnabled ?? true,
        telegramBotUsername,
      },
    });
  } catch (err) {
    console.error("GET /api/account/notifications error:", err);
    return NextResponse.json({ error: "Failed to fetch notification settings" }, { status: 500 });
  }
}

/**
 * POST /api/account/notifications
 * Updates the current user's notification preferences and Telegram Chat ID.
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
    const body = (await request.json()) as {
      telegramChatId?: string;
      usageAlerts?: boolean;
      emailNotifications?: boolean;
    };
    const { telegramChatId, usageAlerts, emailNotifications } = body;

    const db = getDb(env);
    await db
      .update(user)
      .set({
        telegramChatId: typeof telegramChatId === "string" ? telegramChatId.trim() : null,
        usageAlertsEnabled: Boolean(usageAlerts),
        emailNotificationsEnabled: Boolean(emailNotifications),
        updatedAt: new Date(),
      })
      .where(eq(user.id, authUser.id));

    return NextResponse.json({
      success: true,
      message: "Notification preferences updated successfully",
    });
  } catch (err) {
    console.error("POST /api/account/notifications error:", err);
    return NextResponse.json({ error: "Failed to save notification settings" }, { status: 500 });
  }
}
