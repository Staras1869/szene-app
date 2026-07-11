"use client"

import { useState } from "react"

export default function ResolveButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    async function resolveOne() {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/notifications`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
            if (res.ok) setDone(true)
        } catch (err) {
            console.warn(err)
        } finally {
            setLoading(false)
        }
    }

    if (done) return <button className="px-3 py-1 rounded bg-green-600 text-white text-sm">Resolved</button>
    return (
        <button onClick={resolveOne} disabled={loading} className="px-3 py-1 rounded bg-yellow-500 text-white text-sm">
            {loading ? "..." : "Resolve"}
        </button>
    )
}
