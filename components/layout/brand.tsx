import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { company } from "@/data/company";

type BrandProps = {
  inverse?: boolean;
  variant?: "primary" | "footer";
  className?: string;
  logoClassName?: string;
  textClassName?: string;
};

export function Brand({
  variant = "primary",
  className,
  logoClassName,
  textClassName,
}: BrandProps) {
  const src =
    variant === "footer" ? "/images/logo2.svg" : "/images/mainlogo.svg";
  const isFooter = variant === "footer";
  const defaultLogoSizeClass = isFooter
    ? "h-12 sm:h-14 md:h-16"
    : "h-7 sm:h-8 md:h-9 lg:h-10";
  const logoSize = logoClassName ?? defaultLogoSizeClass;
  const textColor = isFooter ? "text-white" : "text-navy";

  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center gap-2.5 sm:gap-3", className)}
      aria-label={`${company.name} home`}
    >
      <div className={`relative ${logoSize} w-auto flex-shrink-0`}>
        <Image
          src={src}
          alt={company.name}
          width={160}
          height={160}
          priority
          className="h-full w-auto object-contain"
        />
      </div>
      <span
        className={`${textColor} font-heading leading-tight font-semibold whitespace-nowrap ${textClassName ?? (isFooter ? "text-lg sm:text-xl" : "text-sm sm:text-base md:text-lg")}`}
      >
        {company.name}
      </span>
    </Link>
  );
}
