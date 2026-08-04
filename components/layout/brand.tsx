import Image from "next/image";
import Link from "next/link";

type BrandProps = {
  inverse?: boolean;
  variant?: "primary" | "footer";
};

export function Brand({ variant = "primary" }: BrandProps) {
  const src = variant === "footer" ? "/images/logo2.png" : "/images/mainlogo.png";

  return (
    <Link
      href="/"
      className="flex shrink-0 items-center"
      aria-label="Dune Consulting home"
    >
      <Image src={src} alt="Dune Consulting" width={56} height={84} priority />
    </Link>
  );
}
