import { prisma } from "@/lib/prisma"
import ResolveButton from "./resolve-button"

export default async function AdminNotificationsPage() {
    let notes: Awaited<ReturnType<typeof prisma.adminNotification.findMany>> = []
    let validations: Awaited<ReturnType<typeof prisma.eventValidation.findMany>> = []

    try {
        notes = await prisma.adminNotification.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
        validations = await prisma.eventValidation.findMany({ orderBy: { createdAt: 'desc' }, take: 100 })
    } catch (error) {
        console.warn("AdminNotificationsPage: unable to load notifications or validations", error)
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Notifications</h1>
            <ul className="space-y-2 mb-8">
                {notes.map((n) => (
                    <li key={n.id} className="p-3 border rounded flex justify-between items-start">
                        <div>
                            <div className="text-sm text-muted">{n.type} — {new Date(n.createdAt).toLocaleString()}</div>
                            <div className="font-medium">{n.message}</div>
                            <pre className="text-xs mt-2">{JSON.stringify(n.meta, null, 2)}</pre>
                            {n.resolved && <div className="text-sm text-green-600 mt-2">Resolved at {new Date(n.resolvedAt!).toLocaleString()}</div>}
                        </div>
                        <div>
                            {/* Client-only resolve button */}
                            {!n.resolved ? (
                                <ResolveButton id={n.id} />
                            ) : (
                                <div className="text-sm text-gray-500">Done</div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-bold mb-4">Recent Event Validations</h2>
            <ul className="space-y-2">
                {validations.map((v) => (
                    <li key={v.id} className="p-3 border rounded">
                        <div className="text-sm text-muted">{new Date(v.createdAt).toLocaleString()}</div>
                        <div>External ID: {v.externalId ?? '—'}</div>
                        <div>Verdict: {v.verdict ? 'ACCEPT' : 'REJECT'}</div>
                        <div>Confidence: {v.confidence ?? '—'}</div>
                        <pre className="text-xs mt-2">{v.rawResponse}</pre>
                        {v.reason && <div className="mt-2 text-sm">Reason: {v.reason}</div>}
                    </li>
                ))}
            </ul>
        </div>
    )
}
