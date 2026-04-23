import { db } from "@/lib/db"

export type EventSubmission = {
  id: string
  promoterName: string; promoterEmail: string; promoterInstagram?: string | null
  title: string; venue: string; city: string; date: string; time: string
  genre: string; price: string; dresscode?: string | null; description: string
  ticketUrl?: string | null; instagram?: string | null; website?: string | null
  status: string; reviewNote?: string | null
  submittedAt: Date; reviewedAt?: Date | null
}

export async function addSubmission(data: Omit<EventSubmission, "id" | "status" | "submittedAt">): Promise<EventSubmission> {
  return db.eventSubmission.create({ data: { ...data, status: "pending" } })
}

export async function getSubmissions(status?: string): Promise<EventSubmission[]> {
  return db.eventSubmission.findMany({
    where: status ? { status } : undefined,
    orderBy: { submittedAt: "desc" },
  })
}

export async function getSubmission(id: string): Promise<EventSubmission | null> {
  return db.eventSubmission.findUnique({ where: { id } })
}

export async function updateStatus(id: string, status: string, note?: string): Promise<EventSubmission | null> {
  return db.eventSubmission.update({
    where: { id },
    data: { status, reviewNote: note, reviewedAt: new Date() },
  })
}
