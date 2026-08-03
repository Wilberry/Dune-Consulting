import type { LucideIcon } from "lucide-react";
import { Quote as QuoteIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function Badge({
  children,
  inverse = false,
}: {
  children: React.ReactNode;
  inverse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[11px] font-extrabold tracking-[.14em] uppercase",
        inverse ? "text-amber bg-white/10" : "bg-amber/15 text-amber-text",
      )}
    >
      {children}
    </span>
  );
}
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-line bg-off-white text-muted inline-flex rounded-full border px-3 py-1 text-xs font-semibold">
      {children}
    </span>
  );
}
export function IconBox({
  icon: Icon,
  inverse = false,
}: {
  icon: LucideIcon;
  inverse?: boolean;
}) {
  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-lg",
        inverse ? "text-amber bg-white/10" : "bg-navy text-amber",
      )}
    >
      <Icon size={22} aria-hidden="true" />
    </span>
  );
}
export function Callout({
  title,
  children,
  inverse = false,
}: {
  title: string;
  children: React.ReactNode;
  inverse?: boolean;
}) {
  return (
    <aside
      className={cn(
        "border-amber rounded-xl border-l-4 p-6",
        inverse ? "bg-white/8 text-white" : "bg-off-white text-ink",
      )}
    >
      <h3 className="font-heading text-lg font-extrabold">{title}</h3>
      <div
        className={cn(
          "mt-2 text-sm leading-6",
          inverse ? "text-white/70" : "text-muted",
        )}
      >
        {children}
      </div>
    </aside>
  );
}
export function Quote({
  children,
  attribution,
}: {
  children: React.ReactNode;
  attribution?: string;
}) {
  return (
    <blockquote className="border-line relative rounded-xl border bg-white p-7 shadow-sm">
      <QuoteIcon className="text-amber" aria-hidden="true" />
      <p className="text-navy font-heading mt-4 text-xl leading-8 font-bold">
        {children}
      </p>
      {attribution && (
        <footer className="text-muted mt-4 text-sm">{attribution}</footer>
      )}
    </blockquote>
  );
}
export function SectionDivider() {
  return (
    <div className="bg-line mx-auto h-px w-full max-w-7xl" aria-hidden="true" />
  );
}
export function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="border-line bg-off-white rounded-xl border border-dashed p-8 text-center">
      <h3 className="text-navy text-xl font-bold">{title}</h3>
      <p className="text-muted mx-auto mt-2 max-w-lg text-sm leading-6">
        {copy}
      </p>
    </div>
  );
}
