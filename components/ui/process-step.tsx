export function ProcessStep({
  number,
  title,
  copy,
}: {
  number: number;
  title: string;
  copy: string;
}) {
  return (
    <li className="relative pl-16 lg:pt-16 lg:pl-0">
      <div className="bg-amber font-heading text-deep-navy absolute top-0 left-0 z-10 flex size-10 items-center justify-center rounded-full font-extrabold lg:left-0">
        {number}
      </div>
      <h3 className="text-navy text-lg font-extrabold">{title}</h3>
      <p className="text-muted mt-2 text-sm leading-6">{copy}</p>
    </li>
  );
}
