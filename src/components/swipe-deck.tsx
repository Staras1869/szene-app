"use client"

import { useCallback, useRef, useState } from "react"
import { Heart, X, RotateCcw, Clock, Ticket, Users } from "lucide-react"

export type SwipeCard = {
  id: string
  title: string
  venue: string
  date?: string
  time?: string
  cat?: string
  emoji?: string
  grad?: string
  image?: string
  price?: string
  going?: number
  desc?: string
  hot?: boolean
}

const THRESHOLD = 110      // px past which a drag becomes a swipe
const FLY_MS     = 300     // exit animation duration

export function SwipeDeck({
  cards,
  onLike,
  onSkip,
  onReset,
}: {
  cards: SwipeCard[]
  onLike: (card: SwipeCard) => void
  onSkip: (card: SwipeCard) => void
  onReset?: () => void
}) {
  const [index, setIndex]   = useState(0)
  const [drag, setDrag]     = useState({ x: 0, y: 0 })
  const [leaving, setLeaving] = useState<null | "left" | "right">(null)

  const dragRef     = useRef({ x: 0, y: 0 })
  const startRef    = useRef<{ x: number; y: number } | null>(null)
  const draggingRef = useRef(false)

  const current = cards[index]
  const next    = cards[index + 1]

  const setDragBoth = (d: { x: number; y: number }) => { dragRef.current = d; setDrag(d) }

  const commit = useCallback((dir: "left" | "right") => {
    const card = cards[index]
    if (!card || leaving) return
    setLeaving(dir)
    const flyX = (typeof window !== "undefined" ? window.innerWidth : 500) * (dir === "right" ? 1 : -1)
    setDragBoth({ x: flyX, y: dragRef.current.y })
    setTimeout(() => {
      dir === "right" ? onLike(card) : onSkip(card)
      setIndex(i => i + 1)
      setDragBoth({ x: 0, y: 0 })
      setLeaving(null)
    }, FLY_MS)
  }, [cards, index, leaving, onLike, onSkip])

  function onPointerDown(e: React.PointerEvent) {
    if (leaving) return
    draggingRef.current = true
    startRef.current = { x: e.clientX, y: e.clientY }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !startRef.current) return
    setDragBoth({ x: e.clientX - startRef.current.x, y: e.clientY - startRef.current.y })
  }
  function onPointerUp() {
    if (!draggingRef.current) return
    draggingRef.current = false
    startRef.current = null
    const { x } = dragRef.current
    if (x > THRESHOLD) commit("right")
    else if (x < -THRESHOLD) commit("left")
    else setDragBoth({ x: 0, y: 0 })
  }

  // ─── Empty state ────────────────────────────────────────────────────────────
  if (!current) {
    return (
      <div className="szene-card flex flex-col items-center justify-center text-center gap-4"
        style={{ height: "68vh", maxHeight: 560 }}>
        <span className="text-5xl">🎉</span>
        <div>
          <p className="text-base font-bold text-szene">You&apos;re all caught up</p>
          <p className="text-xs text-muted mt-1">You&apos;ve seen every event in this city</p>
        </div>
        <button
          onClick={() => { setIndex(0); setDragBoth({ x: 0, y: 0 }); onReset?.() }}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-full"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}>
          <RotateCcw className="w-3.5 h-3.5" /> Start over
        </button>
      </div>
    )
  }

  const rot        = Math.max(-15, Math.min(15, drag.x / 18))
  const likeOp     = Math.max(0, Math.min(1, drag.x / THRESHOLD))
  const nopeOp     = Math.max(0, Math.min(1, -drag.x / THRESHOLD))
  const moving     = leaving !== null || !draggingRef.current

  return (
    <div>
      {/* Card stack */}
      <div className="relative select-none" style={{ height: "68vh", maxHeight: 560 }}>
        {/* Card behind (peek) */}
        {next && (
          <SwipeCardFace
            card={next}
            style={{ transform: "scale(0.94) translateY(14px)", opacity: 0.6, zIndex: 1 }}
          />
        )}

        {/* Top / active card */}
        <SwipeCardFace
          card={current}
          style={{
            transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rot}deg)`,
            transition: moving ? `transform ${FLY_MS}ms ease-out` : "none",
            zIndex: 2,
            cursor: "grab",
            touchAction: "pan-y",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {/* LIKE / NOPE stamps */}
          <div className="absolute top-6 left-5 rotate-[-18deg] pointer-events-none"
            style={{ opacity: likeOp }}>
            <span className="text-2xl font-black tracking-widest px-3 py-1 rounded-lg border-4"
              style={{ color: "#22c55e", borderColor: "#22c55e" }}>SAVE</span>
          </div>
          <div className="absolute top-6 right-5 rotate-[18deg] pointer-events-none"
            style={{ opacity: nopeOp }}>
            <span className="text-2xl font-black tracking-widest px-3 py-1 rounded-lg border-4"
              style={{ color: "#ef4444", borderColor: "#ef4444" }}>SKIP</span>
          </div>
        </SwipeCardFace>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          onClick={() => commit("left")}
          aria-label="Skip"
          className="w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
          <X className="w-6 h-6" style={{ color: "#ef4444" }} />
        </button>
        <button
          onClick={() => commit("right")}
          aria-label="Save"
          className="w-16 h-16 rounded-full flex items-center justify-center transition-transform active:scale-90"
          style={{ backgroundColor: "var(--accent)", boxShadow: "0 8px 24px var(--accent-glow)" }}>
          <Heart className="w-7 h-7 text-white" fill="#fff" />
        </button>
      </div>

      <p className="text-[10px] text-faint text-center mt-3">
        {cards.length - index} left · drag or tap the buttons
      </p>
    </div>
  )
}

// ─── Single card face ──────────────────────────────────────────────────────────
function SwipeCardFace({
  card, style, children, ...handlers
}: {
  card: SwipeCard
  style?: React.CSSProperties
  children?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className="absolute inset-0 rounded-3xl overflow-hidden border border-szene shadow-2xl"
      style={{ backgroundColor: "var(--bg-secondary)", ...style }}
      {...handlers}
    >
      {/* Image or gradient */}
      {card.image ? (
        <img src={card.image} alt={card.title} draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${card.grad ?? "from-violet-800 to-purple-900"} flex items-center justify-center`}>
          <span className="text-7xl opacity-80">{card.emoji ?? "🎉"}</span>
        </div>
      )}

      {/* Legibility gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10 pointer-events-none" />

      {/* Top badges */}
      <div className="absolute top-4 right-4 flex gap-1.5">
        {card.hot && <span className="text-[10px] font-black bg-orange-500 text-white px-2.5 py-1 rounded-full">🔥 HOT</span>}
        {card.cat && <span className="text-[10px] font-semibold text-white/85 bg-black/45 border border-white/15 px-2.5 py-1 rounded-full">{card.cat}</span>}
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none">
        <h3 className="text-2xl font-black text-white leading-tight">{card.title}</h3>
        <p className="text-sm text-white/75 mt-1">{card.venue}</p>
        {card.desc && <p className="text-xs text-white/55 mt-2 line-clamp-2">{card.desc}</p>}
        <div className="flex items-center gap-3 mt-3 text-xs text-white/70 flex-wrap">
          {(card.date || card.time) && (
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{[card.date, card.time].filter(Boolean).join(" · ")}</span>
          )}
          {card.price && <span className="flex items-center gap-1"><Ticket className="w-3.5 h-3.5" />{card.price}</span>}
          {typeof card.going === "number" && card.going > 0 && (
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{card.going} going</span>
          )}
        </div>
      </div>

      {children}
    </div>
  )
}
