import type { LucideIcon } from "lucide-react";
export function FeatureItem({
  title,
  copy,
  icon: Icon,
}: {
  title: string;
  copy: string;
  icon: LucideIcon;
}) {
  return (
    <article>
      <div className="text-amber mb-5 flex size-11 items-center justify-center rounded-full border border-white/20">
        <Icon size={21} aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-white/65">{copy}</p>
    </article>
  );
}
