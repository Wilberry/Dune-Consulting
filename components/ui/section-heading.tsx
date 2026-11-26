import { cn } from "@/lib/utils";
export function SectionHeading({
  eyebrow,
  title,
  copy,
  align = "center",
  inverse = false,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: "left" | "center" | "center-all";
  inverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl lg:max-w-4xl",
        align === "center" && "mx-auto text-center sm:mx-0 sm:text-left",
        align === "center-all" && "mx-auto text-center",
      )}
    >
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className={cn("section-title", inverse ? "text-white" : "text-navy")}>
        {title}
      </h2>
      {copy && (
        <p
          className={cn(
            "mt-5 text-base leading-7",
            inverse ? "text-white/70" : "text-muted",
          )}
        >
          {copy}
        </p>
      )}
    </div>
  );
}
