import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  inverse?: boolean;
  variant?: "primary" | "footer";
};

export function Brand({ variant = "primary" }: BrandProps) {
  const src = variant === "footer" ? "/images/logo2.png" : "/images/mainlogo.png";
  const isFooter = variant === "footer";
  const logoSizeClass = isFooter
    ? "h-16 sm:h-20 md:h-24"
    : "h-10 sm:h-11 md:h-12 lg:h-14";
  const textColor = isFooter ? "text-white" : "text-navy";

  return (
    <Link
      href="/"
      className="flex shrink-0 items-center gap-3"
      aria-label="Dune Consulting home"
    >
      <div className={`relative ${logoSizeClass} w-auto flex-shrink-0`}>
        <Image
          src={src}
          alt="Dune Consulting"
          width={160}
          height={160}
          priority
          className="h-full w-auto"
        />
      </div>
      <span className={`${textColor} font-bold leading-tight ${isFooter ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`}>
        Dune Consulting
      </span>
    </Link>
  );
}
