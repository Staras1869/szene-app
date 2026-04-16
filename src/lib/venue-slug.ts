const GERMAN_MAP: Record<string, string> = {
  ä: "ae", ö: "oe", ü: "ue", ß: "ss",
  Ä: "ae", Ö: "oe", Ü: "ue",
}

function slugify(s: string): string {
  return s
    .replace(/[äöüßÄÖÜ]/g, (c) => GERMAN_MAP[c] ?? c)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function makeVenueSlug(name: string, city: string): string {
  return `${slugify(name)}-${slugify(city)}`
}

const CITIES = ["mannheim", "heidelberg", "frankfurt"] as const

export function parseVenueSlug(slug: string): { nameQuery: string; cityGuess: string } {
  for (const city of CITIES) {
    if (slug.endsWith(`-${city}`)) {
      const name = slug.slice(0, -(city.length + 1)).replace(/-/g, " ")
      return { nameQuery: name, cityGuess: city }
    }
  }
  return { nameQuery: slug.replace(/-/g, " "), cityGuess: "" }
}
