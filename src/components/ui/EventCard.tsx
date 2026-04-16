import Image from "next/image";

export type Event = {
  id: string;
  title: string;
  date: string;      // ISO string
  time?: string;     // e.g. "22:00"
  category: string;  // e.g. "Electronic"
  venue: string;     // e.g. "Club XYZ, Mannheim"
  cover?: string;    // optional image url
  price?: string;    // e.g. "€12"
};

export default function EventCard(e: Event) {
  return (
    <article className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      {e.cover ? (
        <div className="relative aspect-[16/9]">
          <Image src={e.cover} alt={e.title} fill className="object-cover" />
        </div>
      ) : null}

      <div className="p-4">
        <div className="mb-1 text-xs text-gray-500">
          {new Date(e.date).toLocaleDateString()} {e.time ? `• ${e.time}` : ""}
        </div>
        <h3 className="text-lg font-semibold">{e.title}</h3>
        <div className="mt-1 text-sm text-gray-600">{e.venue}</div>
        <div className="mt-3 flex items-center gap-3 text-sm">
          <span className="rounded-full bg-purple-50 px-2 py-0.5 text-purple-700">
            {e.category}
          </span>
          {e.price ? <span className="text-gray-600">{e.price}</span> : null}
        </div>
      </div>
    </article>
  );
}