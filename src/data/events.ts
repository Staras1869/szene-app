// src/data/events.ts
import type { Event } from "@/components/ui/EventCard";

// All dates are kept dynamic (always in the future relative to today)
const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString();

export const events: Event[] = [
  {
    id: "1",
    title: "Midnight Frequencies (Techno)",
    date: day(3),
    time: "23:00",
    category: "Electronic",
    venue: "Kesselhaus, Mannheim",
    cover: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format",
    price: "€12",
  },
  {
    id: "2",
    title: "Rooftop Sundowner",
    date: day(5),
    time: "18:00",
    category: "Rooftop",
    venue: "Skyline Bar, Heidelberg",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=450&fit=crop&auto=format",
    price: "€9",
  },
  {
    id: "3",
    title: "Live Jazz & Wine",
    date: day(7),
    time: "20:00",
    category: "Jazz",
    venue: "Kulturhaus, Mannheim",
    cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&h=450&fit=crop&auto=format",
  },
];