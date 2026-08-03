export function LogoPlaceholder({ name }: { name: string }) {
  return (
    <div
      role="img"
      aria-label={`${name} logo placeholder`}
      className="border-line bg-off-white text-navy font-heading flex min-h-20 items-center justify-center rounded-lg border px-4 text-center text-sm font-extrabold"
    >
      {name}
    </div>
  );
}
