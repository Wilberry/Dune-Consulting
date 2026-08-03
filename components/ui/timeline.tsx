export type TimelineItem = { title: string; copy: string };
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="before:bg-line relative grid gap-8 before:absolute before:top-0 before:bottom-0 before:left-5 before:w-px lg:grid-cols-6 lg:gap-5 lg:before:top-5 lg:before:right-0 lg:before:bottom-auto lg:before:left-0 lg:before:h-px lg:before:w-full">
      {items.map((item, index) => (
        <li key={item.title} className="relative pl-16 lg:pt-16 lg:pl-0">
          <span className="bg-amber font-heading text-deep-navy absolute top-0 left-0 z-10 flex size-10 items-center justify-center rounded-full font-extrabold">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="text-navy text-lg font-extrabold">{item.title}</h3>
          <p className="text-muted mt-2 text-sm leading-6">{item.copy}</p>
        </li>
      ))}
    </ol>
  );
}
