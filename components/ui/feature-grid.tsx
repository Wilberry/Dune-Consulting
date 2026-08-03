import type { LucideIcon } from "lucide-react";
import { IconBox } from "./primitives";
import { cn } from "@/lib/utils";
export type GridFeature = { title: string; copy: string; icon: LucideIcon };
export function FeatureGrid({
  items,
  columns = 3,
  inverse = false,
}: {
  items: GridFeature[];
  columns?: 2 | 3 | 4;
  inverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-5",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {items.map((item) => (
        <article
          key={item.title}
          className={cn(
            "rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1",
            inverse
              ? "border-white/10 bg-white/5 hover:bg-white/8"
              : "border-line hover:border-amber bg-white hover:shadow-lg",
          )}
        >
          <IconBox icon={item.icon} inverse={inverse} />
          <h3
            className={cn(
              "mt-5 text-xl font-extrabold",
              inverse ? "text-white" : "text-navy",
            )}
          >
            {item.title}
          </h3>
          <p
            className={cn(
              "mt-3 text-sm leading-6",
              inverse ? "text-white/65" : "text-muted",
            )}
          >
            {item.copy}
          </p>
        </article>
      ))}
    </div>
  );
}
