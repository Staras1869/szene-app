"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  text: string
}

const STARTERS = [
  "Where should I go tonight?",
  "Best spot for a date?",
  "Chill bar with good music?",
  "Something in Jungbusch?",
]

export function AiChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hey! I'm your Szene concierge 👋 Tell me your vibe and I'll find the perfect spot tonight." },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: "user", text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text.trim() }),
      })
      const d = await res.json()
      setMessages((prev) => [...prev, { role: "assistant", text: d.reply ?? "Sorry, I'm having trouble right now." }])
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Network error — try again in a sec." }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-2xl shadow-violet-900/50 flex items-center justify-center transition-all duration-200 hover:scale-110 ${open ? "opacity-0 pointer-events-none scale-90" : ""}`}
        aria-label="Open AI chat"
      >
        <Sparkles className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-black" />
      </button>

      {/* Chat drawer */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-full sm:w-[380px] bg-zinc-950 border border-white/[0.12] rounded-3xl shadow-2xl shadow-black/60 flex flex-col overflow-hidden"
          style={{ maxHeight: "min(600px, 85vh)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-violet-600/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-violet-600/30 border border-violet-500/30 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-white text-sm font-bold">Szene AI</p>
                <p className="text-white/40 text-xs">Your night-out concierge</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-violet-600 text-white rounded-br-sm"
                    : "bg-white/[0.07] border border-white/[0.10] text-white/80 rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/[0.07] border border-white/[0.10] px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-1.5 h-1.5 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Starters */}
          {messages.length === 1 && (
            <div className="px-4 pb-3 pt-2 flex flex-wrap gap-2 border-t border-white/[0.06]">
              {STARTERS.map((s) => (
                <button key={s} onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-white/[0.12] text-white/50 hover:border-violet-400/50 hover:text-violet-300 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-3 border-t border-white/[0.06]">
            <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 bg-white/[0.06] border border-white/[0.12] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              <button type="submit" disabled={!input.trim() || loading}
                className="w-10 h-10 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
