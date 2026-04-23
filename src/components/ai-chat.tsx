"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Sparkles, ChevronDown } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const STARTERS: Record<string, string[]> = {
  mannheim: ["Where should I go tonight?", "Best spot for a date in Jungbusch?", "Hidden bar nobody knows?", "Afrobeats tonight?"],
  heidelberg: ["What's open in Altstadt tonight?", "Best student bar in HD?", "Something at halle02?", "Chill spot with views?"],
  frankfurt: ["Best techno club tonight?", "Latin night in FFM?", "Something at Robert Johnson?", "Chill cocktail bar downtown?"],
  stuttgart:    ["Best techno club tonight?", "Reggaeton in Stuttgart?", "Perkins Park or Climax?", "Hidden bar in Bohnenviertel?"],
  karlsruhe: ["Best club night at Substage?", "Student party this week?", "Afrobeats in KA?", "Outdoor spot in Karlsruhe?"],
}

const DEFAULT_STARTERS = ["Where should I go tonight?", "Best spot for a date?", "Hidden bar nobody knows?", "Something chill with good music?"]

export function AiChat({ city }: { city?: string }) {
  const [open, setOpen]       = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]     = useState("")
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const bottomRef             = useRef<HTMLDivElement>(null)
  const inputRef              = useRef<HTMLInputElement>(null)

  const starters: string[] = (city ? STARTERS[city] : undefined) ?? DEFAULT_STARTERS

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  // Animate open/close
  useEffect(() => {
    if (open) {
      setTimeout(() => setVisible(true), 10)
      setTimeout(() => inputRef.current?.focus(), 300)
    } else {
      setVisible(false)
    }
  }, [open])

  function openChat() { setOpen(true) }
  function closeChat() {
    setVisible(false)
    setTimeout(() => setOpen(false), 300)
  }

  async function send(text: string) {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: "user", content: text.trim() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text.trim(),
          city: city ?? "mannheim",
          // Send last 10 turns as history (excluding the new user message already handled server-side)
          history: messages.slice(-10),
        }),
      })
      const d = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: d.reply ?? "Sorry, something went wrong." }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Network error — try again in a sec." }])
    }
    setLoading(false)
  }

  const isEmpty = messages.length === 0

  return (
    <>
      {/* FAB */}
      <button onClick={openChat}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          open ? "opacity-0 pointer-events-none scale-75" : "opacity-100 scale-100"
        }`}
        style={{ backgroundColor: "var(--accent)", color: "var(--accent-fg)", boxShadow: "var(--shadow)" }}
        aria-label="Open Szene AI">
        <Sparkles className="w-5 h-5" />
        {/* Live dot */}
        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2"
          style={{ borderColor: "var(--bg-primary)" }} />
      </button>

      {/* Backdrop (mobile only) */}
      {open && (
        <div className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
          onClick={closeChat} />
      )}

      {/* Chat panel */}
      {open && (
        <div className={`fixed z-50 flex flex-col overflow-hidden transition-all duration-300
          /* mobile: full-width bottom sheet */
          bottom-0 left-0 right-0 rounded-t-3xl
          /* desktop: floating card bottom-right */
          md:bottom-6 md:right-6 md:left-auto md:w-[390px] md:rounded-3xl
          ${visible ? "translate-y-0 opacity-100" : "translate-y-full md:translate-y-4 opacity-0"}
        `}
          style={{
            maxHeight: "min(620px, 88vh)",
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            boxShadow: "0 -4px 60px rgba(0,0,0,0.4), var(--shadow)",
          }}>

          {/* Drag handle (mobile) */}
          <div className="md:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--border-strong)" }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.25)" }}>
                <Sparkles className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-szene">Szene AI</p>
                <p className="text-xs text-muted">{city ? `${city.charAt(0).toUpperCase() + city.slice(1)} concierge` : "Your night-out guide"}</p>
              </div>
            </div>
            <button onClick={closeChat} className="text-faint hover:text-szene transition-colors p-1 rounded-lg">
              <ChevronDown className="w-5 h-5 md:hidden" />
              <X className="w-4 h-4 hidden md:block" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isEmpty && (
              <div className="flex items-start gap-3 mb-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.20)" }}>
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed text-szene"
                  style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  Hey! I&apos;m your Szene concierge 👋 Tell me your vibe and I&apos;ll find the perfect spot tonight.
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
                    style={{ backgroundColor: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.18)" }}>
                    <Sparkles className="w-3 h-3 text-violet-400" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-2xl rounded-br-sm text-white"
                    : "rounded-2xl rounded-tl-sm text-szene"
                }`} style={msg.role === "user"
                  ? { backgroundColor: "var(--accent)" }
                  : { backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }
                }>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
                  style={{ backgroundColor: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.18)" }}>
                  <Sparkles className="w-3 h-3 text-violet-400" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-tl-sm"
                  style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400/50 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Starter prompts */}
          {isEmpty && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5 border-t" style={{ borderColor: "var(--border)" }}>
              <p className="w-full text-[10px] text-faint uppercase tracking-widest pt-3 pb-1">Quick ask</p>
              {starters.map(s => (
                <button key={s} onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border text-muted hover:text-szene transition-colors"
                  style={{ borderColor: "var(--border)" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-5 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
            <form onSubmit={e => { e.preventDefault(); send(input) }} className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask anything…"
                className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors text-szene placeholder:text-faint"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(168,85,247,0.50)")}
                onBlur={e => (e.target.style.borderColor = "var(--border)")}
              />
              <button type="submit" disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-40 text-white"
                style={{ backgroundColor: "var(--accent)" }}>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
