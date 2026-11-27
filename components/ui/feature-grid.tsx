import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { IconBox } from "./primitives";
import { cn } from "@/lib/utils";
export type GridFeature = {
  title: string;
  copy: string;
  icon: LucideIcon;
  image?: { src: string; alt: string; objectPosition?: "center" | "top" };
};
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
            "group rounded-xl border p-6 transition-all duration-200 hover:-translate-y-1",
            inverse
              ? "border-white/10 bg-white/5 hover:bg-white/8"
              : "border-line hover:border-amber bg-white hover:shadow-lg",
          )}
        >
          {item.image && (
            <div className="-mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden rounded-t-xl">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                width={960}
                height={540}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                style={{
                  objectPosition: item.image.objectPosition ?? "center",
                }}
              />
            </div>
          )}
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
