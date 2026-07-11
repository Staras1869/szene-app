import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL
const slackWebhook = process.env.SLACK_WEBHOOK_URL

const resendClient = resendApiKey ? new Resend(resendApiKey) : null

export async function sendAdminEmail(subject: string, text: string) {
    if (!resendClient || !adminEmail) return
    try {
        await resendClient.emails.send({
            from: "notifications@szene.app",
            to: adminEmail,
            subject,
            text,
        })
    } catch (err) {
        console.warn("[notifier] failed to send admin email:", err)
    }
}

export async function sendSlackNotification(text: string) {
    if (!slackWebhook) return
    try {
        await fetch(slackWebhook, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        })
    } catch (err) {
        console.warn("[notifier] failed to send slack notification:", err)
    }
}

export async function sendAdminAlert(subject: string, message: string) {
    // Fire-and-forget
    sendAdminEmail(subject, message).catch(() => { })
    sendSlackNotification(`${subject}\n${message}`).catch(() => { })
}
