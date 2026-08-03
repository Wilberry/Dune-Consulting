import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
export function ImagePlaceholder({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "relative flex h-full min-h-64 items-center justify-center overflow-hidden bg-[#dfe5ea]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,35,63,.08),rgba(16,35,63,.22))]" />
      <div className="relative mx-6 rounded-lg border border-white/60 bg-white/75 px-5 py-4 text-center shadow-sm backdrop-blur">
        <ImageIcon className="text-navy/60 mx-auto mb-2" aria-hidden="true" />
        <span className="text-navy block text-sm font-semibold">
          Approved project image coming soon
        </span>
        {process.env.NODE_ENV === "development" && (
          <span className="text-muted mt-1 block text-xs">{src}</span>
        )}
      </div>
    </div>
  );
}
