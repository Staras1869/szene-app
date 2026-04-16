type Props = { title: string; subtitle: string; emoji: string; from: string; to: string };

export default function CategoryCard({ title, subtitle, emoji, from, to }: Props) {
  return (
    <div
      className="rounded-3xl p-6 text-center shadow-md transition-transform hover:-translate-y-1"
      style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-2xl">
        {emoji}
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-white/90">{subtitle}</p>
    </div>
  );
}