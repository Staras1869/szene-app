import Link from "next/link";

export type CategoryCardProps = {
  title: string;
  subtitle?: string;
  emoji?: string;
  from: string;
  to: string;
  href?: string;
};

export default function CategoryCard({
  title,
  subtitle,
  emoji = "✨",
  from,
  to,
  href,
}: CategoryCardProps) {
  return href ? (
    <Link href={href} className="block rounded-lg p-4 shadow-md transition hover:shadow-lg">
      <div className={`flex items-center justify-between rounded-lg p-4`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
        <div className="flex items-center">
          <span className="text-2xl">{emoji}</span>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
      </div>
    </Link>
  ) : (
    <div className="block rounded-lg p-4 shadow-md transition hover:shadow-lg">
      <div className={`flex items-center justify-between rounded-lg p-4`} style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}>
        <div className="flex items-center">
          <span className="text-2xl">{emoji}</span>
          <div className="ml-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}