import { ImagePlaceholder } from "@/components/ui/image-placeholder";
import { cn } from "@/lib/utils";

export function LeadConsultantPhoto({
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
      className={cn(
        "relative overflow-hidden rounded-[20px] border border-white/10 bg-white shadow-xl",
        className,
      )}
    >
      <ImagePlaceholder src={src} alt={alt} className="absolute inset-0" fit="cover" />
    </div>
  );
}
