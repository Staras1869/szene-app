// Simple in-memory store for emails (persists per Vercel function instance)
// For production scale, swap this for a database table

export type EmailThread = {
  id: string
  from: string
  fromName: string
  subject: string
  body: string
  receivedAt: string
  draft: string        // AI-drafted reply
  status: "pending" | "sent" | "ignored"
  sentAt?: string
}

// Global store — survives within a single serverless instance
// Emails are also logged to Vercel logs as backup
const store: Map<string, EmailThread> = new Map()

export function saveEmail(email: EmailThread) {
  store.set(email.id, email)
}

export function getEmails(): EmailThread[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
  )
}

export function getEmail(id: string): EmailThread | undefined {
  return store.get(id)
}

export function updateEmail(id: string, patch: Partial<EmailThread>) {
  const email = store.get(id)
  if (email) store.set(id, { ...email, ...patch })
}
