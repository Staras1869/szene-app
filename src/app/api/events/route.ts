import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ── Date helpers ────────────────────────────────────────────────────────────

/** ISO date string N days from today */
const day = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}

function isThisWeekend(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const dow = d.getDay(); // 0=Sun 5=Fri 6=Sat
  const diffDays = Math.round((d.getTime() - Date.now()) / 86_400_000);
  return (dow === 5 || dow === 6 || dow === 0) && diffDays >= 0 && diffDays <= 3;
}

function isThisWeek(dateStr: string): boolean {
  const diffDays = Math.round((new Date(dateStr + "T00:00:00").getTime() - Date.now()) / 86_400_000);
  return diffDays >= 0 && diffDays <= 7;
}

function matchesDateFilter(dateStr: string, filter: string): boolean {
  switch (filter) {
    case "today":   return isToday(dateStr);
    case "weekend": return isThisWeekend(dateStr);
    case "week":    return isThisWeek(dateStr);
    default:        return true; // "all" or unknown — no filter
  }
}

// ── Mock events (dates always relative to today) ────────────────────────────

const MOCK_EVENTS = [
  // ── Mannheim ────────────────────────────────────────────────────────────
  {
    id: "1",
    title: "Rooftop Summer Sessions",
    venue: "Skybar Mannheim",
    date: day(0), // TODAY — shows in Tonight widget
    time: "21:00",
    city: "Mannheim",
    category: "Nightlife",
    price: "€15",
    description:
      "Experience summer nights on our spectacular rooftop terrace with panoramic city views, live DJs, and craft cocktails.",
    imageUrl:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.google.com/search?q=Skybar+Mannheim",
    status: "approved",
    lat: 49.4875,
    lon: 8.4661,
  },
  {
    id: "2",
    title: "Underground Electronic Night",
    venue: "MS Connexion",
    date: day(2),
    time: "23:00",
    city: "Mannheim",
    category: "Music",
    price: "€20",
    description:
      "Deep electronic beats in Mannheim's premier underground venue. International DJs, the best sound system in the region.",
    imageUrl:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.msconnexion.de",
    status: "approved",
    lat: 49.4875,
    lon: 8.4661,
  },
  {
    id: "4",
    title: "Techno Rave — Zeitraumexit",
    venue: "Zeitraumexit",
    date: day(5),
    time: "00:00",
    city: "Mannheim",
    category: "Music",
    price: "€12",
    description:
      "An all-night techno journey in Mannheim's iconic underground space. Resident DJs and international guests.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.zeitraumexit.de",
    status: "approved",
    lat: 49.4875,
    lon: 8.4661,
  },
  {
    id: "6",
    title: "Kulturherbst: Art & Music",
    venue: "Alte Feuerwache",
    date: day(10),
    time: "18:00",
    city: "Mannheim",
    category: "Art & Culture",
    price: "Free",
    description:
      "A celebration of local art and music — live performances, installations, and community spirit in Mannheim's cultural heart.",
    imageUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.altefeuerwache.com",
    status: "approved",
    lat: 49.4875,
    lon: 8.4661,
  },
  {
    id: "7",
    title: "Capitol Presents: Live Concert",
    venue: "Capitol Mannheim",
    date: day(14),
    time: "20:00",
    city: "Mannheim",
    category: "Music",
    price: "€28",
    description:
      "An unforgettable live concert night at Mannheim's legendary Capitol — great acoustics, brilliant artists.",
    imageUrl:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.capitol-mannheim.de",
    status: "approved",
    lat: 49.4875,
    lon: 8.4661,
  },

  // ── Heidelberg ───────────────────────────────────────────────────────────
  {
    id: "3",
    title: "Jazz & Wine Evening",
    venue: "Heidelberg Castle Gardens",
    date: day(1), // TOMORROW — shows in Tonight/Weekend widget
    time: "19:30",
    city: "Heidelberg",
    category: "Art & Culture",
    price: "€25",
    description:
      "Sophisticated evening with live jazz and premium Rhine Valley wines in the historic setting of Heidelberg Castle.",
    imageUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.heidelberg-marketing.de",
    status: "approved",
    lat: 49.4123,
    lon: 8.7153,
  },
  {
    id: "5",
    title: "Indie & Alternative Night",
    venue: "Schwimmbad Club",
    date: day(3),
    time: "22:00",
    city: "Heidelberg",
    category: "Music",
    price: "€10",
    description:
      "Your weekly dose of indie, alternative, and post-punk in Heidelberg's beloved student club.",
    imageUrl:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.schwimmbad-club.de",
    status: "approved",
    lat: 49.4123,
    lon: 8.7153,
  },
  {
    id: "8",
    title: "Karlstorbahnhof: World Music Night",
    venue: "Karlstorbahnhof",
    date: day(7),
    time: "21:00",
    city: "Heidelberg",
    category: "Music",
    price: "€18",
    description:
      "A vibrant celebration of world music, dance, and culture in Heidelberg's favourite cultural venue.",
    imageUrl:
      "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.karlstorbahnhof.de",
    status: "approved",
    lat: 49.4123,
    lon: 8.7153,
  },
  {
    id: "9",
    title: "halle02: Festival Warm-Up",
    venue: "halle02",
    date: day(12),
    time: "22:00",
    city: "Heidelberg",
    category: "Nightlife",
    price: "€22",
    description:
      "Pre-summer festival warm-up with top-tier DJs and the best crowd in Heidelberg. Doors open 22:00.",
    imageUrl:
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.halle02.de",
    status: "approved",
    lat: 49.4123,
    lon: 8.7153,
  },

  // ── Frankfurt ────────────────────────────────────────────────────────────
  {
    id: "10",
    title: "Batschkapp Presents: Rock Night",
    venue: "Batschkapp",
    date: day(0), // TODAY — Frankfurt tonight
    time: "20:00",
    city: "Frankfurt",
    category: "Music",
    price: "€18",
    description:
      "Live rock bands on Frankfurt's most legendary stage. Three acts, incredible sound, unforgettable night.",
    imageUrl:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.batschkapp.de",
    status: "approved",
    lat: 50.1375,
    lon: 8.7415,
  },
  {
    id: "11",
    title: "King Kamehameha: Saturday Night",
    venue: "King Kamehameha Club",
    date: day(4),
    time: "23:00",
    city: "Frankfurt",
    category: "Nightlife",
    price: "€15",
    description:
      "Frankfurt's most exclusive Saturday night. House, techno and R&B across multiple floors with a riverside terrace.",
    imageUrl:
      "https://images.unsplash.com/photo-1542319630-e4bff93bace2?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.king-kamehameha.de",
    status: "approved",
    lat: 50.1109,
    lon: 8.7205,
  },
  {
    id: "12",
    title: "Zoom Frankfurt: Electronic Weekender",
    venue: "Zoom Frankfurt",
    date: day(6),
    time: "22:00",
    city: "Frankfurt",
    category: "Music",
    price: "€20",
    description:
      "A full weekend of electronic music on the Zeil. International DJs, state-of-the-art sound system, three floors.",
    imageUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.zoom-frankfurt.de",
    status: "approved",
    lat: 50.1136,
    lon: 8.6826,
  },
  {
    id: "13",
    title: "Jazz im Frankfurter Hof",
    venue: "Frankfurter Hof",
    date: day(9),
    time: "20:30",
    city: "Frankfurt",
    category: "Music",
    price: "€25",
    description:
      "An intimate jazz evening in Frankfurt's most storied music venue. World-class musicians, perfect acoustics.",
    imageUrl:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://www.frankfurterhof.com",
    status: "approved",
    lat: 50.1104,
    lon: 8.6834,
  },
  {
    id: "14",
    title: "Tanzhaus West: Latin & Salsa Night",
    venue: "Tanzhaus West",
    date: day(16),
    time: "21:00",
    city: "Frankfurt",
    category: "Social",
    price: "€12",
    description:
      "Frankfurt's hottest Latin night — salsa, bachata, and live percussion in the iconic Tanzhaus West warehouse.",
    imageUrl:
      "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800&h=600&fit=crop&auto=format",
    sourceUrl: "https://tanzhaus-west.de",
    status: "approved",
    lat: 50.0992,
    lon: 8.6601,
  },
];

// ── GET ─────────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status   = searchParams.get("status");
    const city     = searchParams.get("city");
    const category = searchParams.get("category");
    const search   = searchParams.get("search");
    const date     = searchParams.get("date") ?? "all";
    const limit    = Math.min(Number.parseInt(searchParams.get("limit") ?? "20"), 50);

    // ── Try DB first ──────────────────────────────────────────────────────────
    let events: typeof MOCK_EVENTS = [];

    try {
      const where: Record<string, unknown> = {};
      if (status)                   where.status   = status;
      if (city && city !== "all")   where.city     = { equals: city,     mode: "insensitive" };
      if (category && category !== "all") where.category = { equals: category, mode: "insensitive" };
      if (search) {
        const q = search;
        where.OR = [
          { title:       { contains: q, mode: "insensitive" } },
          { venue:       { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ];
      }

      const rows = await prisma.event.findMany({ where, orderBy: { date: "asc" } });

      if (rows.length > 0) {
        events = rows
          .filter((e) => date === "all" || matchesDateFilter(e.date, date))
          .map((e) => ({
            id:          e.id,
            title:       e.title,
            venue:       e.venue,
            date:        e.date,
            time:        e.time ?? "TBD",
            city:        e.city,
            category:    e.category,
            price:       e.price ?? "TBD",
            description: e.description ?? "",
            imageUrl:    e.imageUrl ?? "",
            sourceUrl:   e.sourceUrl ?? "",
            status:      e.status,
            lat:         e.lat ?? 0,
            lon:         e.lon ?? 0,
          }));
      }
    } catch (dbErr) {
      console.error("DB query failed, falling back to mock:", dbErr);
    }

    // ── Fall back to mock events when DB is empty ─────────────────────────────
    if (events.length === 0) {
      events = [...MOCK_EVENTS];
      if (status)                   events = events.filter((e) => e.status === status);
      if (city && city !== "all")   events = events.filter((e) => e.city.toLowerCase() === city.toLowerCase());
      if (category && category !== "all")
        events = events.filter((e) => e.category.toLowerCase() === category.toLowerCase());
      if (search) {
        const q = search.toLowerCase();
        events = events.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.venue.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q)
        );
      }
      if (date !== "all") events = events.filter((e) => matchesDateFilter(e.date, date));
      events.sort((a, b) => a.date.localeCompare(b.date));
    }

    const total = events.length;
    const page  = events.slice(0, limit);

    return NextResponse.json({ events: page, total, hasMore: total > limit });
  } catch (error) {
    console.error("Events GET error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// ── POST ────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, venue, date, time, city, category, price, description } = body;

    if (!title || !venue || !date || !city) {
      return NextResponse.json(
        { error: "Missing required fields: title, venue, date, city" },
        { status: 400 }
      );
    }

    const newEvent = {
      id: Date.now().toString(),
      title, venue, date,
      time:        time        ?? "TBD",
      city,
      category:    category    ?? "Other",
      price:       price       ?? "TBD",
      description: description ?? "",
      imageUrl:    null,
      sourceUrl:   null,
      status:      "pending",
      lat:         null,
      lon:         null,
    };

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("Events POST error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
