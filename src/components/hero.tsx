"use client"

const CITIES = [
  { id: "mannheim",     label: "Mannheim",     flag: "🏙️" },
  { id: "heidelberg",   label: "Heidelberg",   flag: "🏰" },
  { id: "frankfurt",    label: "Frankfurt",    flag: "🌆" },
  { id: "ludwigshafen", label: "Ludwigshafen", flag: "🌊" },
  { id: "karlsruhe",    label: "Karlsruhe",    flag: "🎡" },
]

export function Hero({ city, onCityPick }: { city: string | null; onCityPick: (c: string) => void }) {
  return (
    <section className="relative bg-black text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-violet-700/15 blur-[100px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 pt-16 pb-12 text-center">
        {/* Logo — first thing visible */}
        <div className="mb-8">
          <p className="text-7xl sm:text-8xl font-black tracking-tighter text-white">SZENE</p>
          <p className="text-white/40 text-xs mt-3 tracking-[0.3em] uppercase">Nightlife · Events · Venues</p>
        </div>

        {!city ? (
          <>
            <p className="text-white/55 text-base mb-7 font-medium">Pick your city to get started</p>
            <div className="flex flex-wrap justify-center gap-3">
              {CITIES.map(c => (
                <button
                  key={c.id}
                  onClick={() => onCityPick(c.id)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/20 text-white font-bold text-sm hover:bg-white hover:text-black hover:border-white transition-all duration-200 active:scale-95"
                >
                  <span>{c.flag}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <p className="text-white/50 text-sm">
              What&apos;s on in{" "}
              <span className="text-white font-bold">{CITIES.find(c => c.id === city)?.label}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
