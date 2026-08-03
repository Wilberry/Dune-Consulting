import Image from "next/image";
import Link from "next/link";
export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-3"
      aria-label="Dune Consulting home"
    >
      <Image
        src="/icons/dune-mark.svg"
        alt=""
        width={42}
        height={42}
        priority
      />
      <span
        className={`font-heading text-[17px] leading-none font-extrabold tracking-tight ${inverse ? "text-white" : "text-navy"}`}
      >
        DUNE
        <br />
        <span className="text-amber text-[10px] tracking-[.2em]">
          CONSULTING
        </span>
      </span>
    </Link>
  );
}
