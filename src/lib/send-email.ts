/**
 * Thin wrapper around Resend for transactional emails.
 * Set RESEND_API_KEY in environment variables.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = "Szene <noreply@szene.app>"

interface SendOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendOptions): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping email send")
    return
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => "")
    console.error("[email] Resend error", res.status, body)
    throw new Error(`Email send failed: ${res.status}`)
  }
}

export function verificationEmailHtml(verifyUrl: string): string {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:480px;margin:40px auto;padding:0 20px">
    <div style="background:#13131a;border:1px solid #2a2a3a;border-radius:24px;overflow:hidden">
      <!-- Header -->
      <div style="background:linear-gradient(135deg,#7c3aed,#a855f7);padding:32px 32px 24px;text-align:center">
        <div style="font-size:32px;margin-bottom:8px">🎉</div>
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:900;letter-spacing:-0.5px">Fast geschafft!</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px">Bestätige deine E-Mail-Adresse</p>
      </div>
      <!-- Body -->
      <div style="padding:32px">
        <p style="margin:0 0 24px;color:#a0a0b8;font-size:15px;line-height:1.6">
          Klick auf den Button unten, um dein Szene-Konto zu aktivieren. Der Link ist <strong style="color:#e0e0f0">24 Stunden</strong> gültig.
        </p>
        <a href="${verifyUrl}"
           style="display:block;text-align:center;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;text-decoration:none;padding:16px 32px;border-radius:16px;font-weight:900;font-size:16px;letter-spacing:-0.3px">
          E-Mail bestätigen →
        </a>
        <p style="margin:24px 0 0;color:#4a4a6a;font-size:12px;text-align:center">
          Falls du kein Konto erstellt hast, kannst du diese E-Mail ignorieren.
        </p>
      </div>
    </div>
    <p style="text-align:center;color:#2a2a4a;font-size:11px;margin-top:20px">
      Szene Digital Solutions UG · Planken 7, 68161 Mannheim
    </p>
  </div>
</body>
</html>`
}
