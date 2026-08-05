import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getSiteImage } from "@/data/images";

export function ImagePlaceholder({
  src,
  alt,
  className,
  fit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const manifestImage = getSiteImage(src);
  const accessibleAlt = alt || manifestImage?.alt || "Image unavailable";
  if (manifestImage?.status === "approved") {
    return (
      <div
        className={cn("relative h-full min-h-64 overflow-hidden", className)}
      >
        <Image
          src={src}
          alt={accessibleAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={cn(
            fit === "contain" ? "object-contain" : "object-cover object-center",
            "h-full w-full",
          )}
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={accessibleAlt}
      className={cn(
        "relative flex h-full min-h-64 items-center justify-center overflow-hidden bg-[#dfe5ea]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,35,63,.08),rgba(16,35,63,.22))]" />
      <div className="relative mx-6 rounded-lg border border-white/60 bg-white/75 px-5 py-4 text-center shadow-sm backdrop-blur">
        <ImageIcon className="text-navy/60 mx-auto mb-2" aria-hidden="true" />
        <span className="text-navy block text-sm font-semibold">
          Image unavailable
        </span>
        {process.env.NODE_ENV === "development" && (
          <span className="text-muted mt-1 block text-xs">{src}</span>
        )}
      </div>
    </div>
  );
}
