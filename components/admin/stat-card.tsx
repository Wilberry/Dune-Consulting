import Link from "next/link";

type StatCardProps = {
  label: string;
  value: number | null;
  href: string;
  restricted?: boolean;
};

export function StatCard({ label, value, href, restricted }: StatCardProps) {
  return (
    <Link
      href={href}
      className="border-line group rounded-xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <p className="text-muted text-sm font-semibold">{label}</p>
      <p className="text-navy mt-3 text-3xl font-extrabold">
        {restricted ? "Admin only" : (value ?? 0).toLocaleString()}
      </p>
      <p className="text-amber-text mt-3 text-xs font-bold group-hover:underline">
        View section
      </p>
    </Link>
  );
}
