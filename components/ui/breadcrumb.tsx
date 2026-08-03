import Link from "next/link";
import { ChevronRight } from "lucide-react";
export type BreadcrumbItem = { label: string; href?: string };
export function Breadcrumb({
  items,
  inverse = false,
}: {
  items: BreadcrumbItem[];
  inverse?: boolean;
}) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        className={`flex flex-wrap items-center gap-1.5 text-xs font-semibold ${inverse ? "text-white/60" : "text-muted"}`}
      >
        <li>
          <Link href="/" className="hover:text-amber">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight size={13} aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="hover:text-amber">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
