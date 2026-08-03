import { publicEnv } from "@/lib/env";

export function ReviewBanner() {
  if (!publicEnv.reviewMode) return null;

  return (
    <aside
      aria-label="Website review notice"
      className="bg-amber text-deep-navy px-4 py-2 text-center text-sm font-semibold"
    >
      Preview website for review. Some images and company details are awaiting
      approval.
    </aside>
  );
}
