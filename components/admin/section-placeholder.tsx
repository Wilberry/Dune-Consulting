type SectionPlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyCopy: string;
};

export function SectionPlaceholder({
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyCopy,
}: SectionPlaceholderProps) {
  return (
    <div className="mx-auto max-w-7xl">
      <p className="text-amber-text text-xs font-extrabold tracking-[.18em] uppercase">{eyebrow}</p>
      <h1 className="text-navy mt-2 text-3xl font-extrabold">{title}</h1>
      <p className="text-muted mt-2 max-w-2xl text-sm leading-6">{description}</p>
      <section className="border-line mt-8 rounded-xl border bg-white p-8 text-center shadow-sm">
        <p className="text-navy font-extrabold">{emptyTitle}</p>
        <p className="text-muted mx-auto mt-2 max-w-xl text-sm leading-6">{emptyCopy}</p>
      </section>
    </div>
  );
}
