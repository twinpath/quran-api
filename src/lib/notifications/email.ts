export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
  provider?: "auto" | "resend" | "brevo" | "cloudflare";
  cfEnv?: CloudflareEnv;
}

export interface EmailDispatchResult {
  success: boolean;
  providerUsed?: string;
  error?: string;
}

/**
 * Multi-provider email dispatcher supporting Resend, Brevo, and Cloudflare Email Sending.
 * Auto-detects available credentials if provider is set to "auto" or omitted.
 */
export async function sendEmailNotification({
  to,
  subject,
  html,
  from,
  provider = "auto",
  cfEnv,
}: SendEmailParams): Promise<EmailDispatchResult> {
  const envProvider = ((cfEnv as Record<string, string> | undefined)?.EMAIL_PROVIDER ||
    process.env.EMAIL_PROVIDER ||
    provider) as "auto" | "resend" | "brevo" | "cloudflare";

  const resendApiKey = (cfEnv as Record<string, string> | undefined)?.RESEND_API_KEY || process.env.RESEND_API_KEY;
  const resendFrom = from || (cfEnv as Record<string, string> | undefined)?.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || "alerts@quran.dyzulk.com";

  const brevoApiKey = (cfEnv as Record<string, string> | undefined)?.BREVO_API_KEY || process.env.BREVO_API_KEY;
  const brevoFrom = from || (cfEnv as Record<string, string> | undefined)?.BREVO_FROM_EMAIL || process.env.BREVO_FROM_EMAIL || "alerts@quran.dyzulk.com";

  // 1. Resend Dispatcher
  if ((envProvider === "auto" || envProvider === "resend") && resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [to],
          subject,
          html,
        }),
      });

      if (res.ok) {
        return { success: true, providerUsed: "Resend" };
      }
      const errText = await res.text();
      if (envProvider === "resend") {
        return { success: false, providerUsed: "Resend", error: `Resend error: ${errText}` };
      }
    } catch (err) {
      if (envProvider === "resend") {
        return { success: false, providerUsed: "Resend", error: err instanceof Error ? err.message : String(err) };
      }
    }
  }

  // 2. Brevo Dispatcher
  if ((envProvider === "auto" || envProvider === "brevo") && brevoApiKey) {
    try {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { email: brevoFrom },
          to: [{ email: to }],
          subject,
          htmlContent: html,
        }),
      });

      if (res.ok) {
        return { success: true, providerUsed: "Brevo" };
      }
      const errText = await res.text();
      if (envProvider === "brevo") {
        return { success: false, providerUsed: "Brevo", error: `Brevo error: ${errText}` };
      }
    } catch (err) {
      if (envProvider === "brevo") {
        return { success: false, providerUsed: "Brevo", error: err instanceof Error ? err.message : String(err) };
      }
    }
  }

  // 3. Cloudflare Email Sending Binding (Worker Paid Plan / send_email binding)
  const cfEmailBinding = (cfEnv as { EMAIL?: { send: (msg: unknown) => Promise<void> } } | undefined)?.EMAIL;
  if ((envProvider === "auto" || envProvider === "cloudflare") && cfEmailBinding && typeof cfEmailBinding.send === "function") {
    try {
      await cfEmailBinding.send({
        to,
        from: from || "alerts@quran.dyzulk.com",
        subject,
        html,
      });
      return { success: true, providerUsed: "Cloudflare Email" };
    } catch (err) {
      return { success: false, providerUsed: "Cloudflare Email", error: err instanceof Error ? err.message : String(err) };
    }
  }

  return {
    success: false,
    error: "No active email provider configured. Please set RESEND_API_KEY or BREVO_API_KEY in .dev.vars.",
  };
}
