import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "light";
  className?: string;
  arrow?: boolean;
};
export function Button({
  href,
  children,
  variant = "primary",
  className,
  arrow = false,
}: ButtonProps) {
  const styles = {
    primary: "bg-amber text-deep-navy hover:bg-amber-hover",
    secondary: "border border-navy/20 bg-white text-navy hover:border-navy",
    light: "border border-white/35 text-white hover:bg-white hover:text-navy",
  };
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition-colors",
        styles[variant],
        className,
      )}
    >
      {children}
      {arrow && <ArrowUpRight aria-hidden="true" size={17} />}
    </Link>
  );
}
