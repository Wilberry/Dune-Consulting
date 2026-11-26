"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function VideoShowcase({ src, title }: { src: string; title: string }) {
  const [muted, setMuted] = useState(true);

  return (
    <div className="group bg-deep-navy relative isolate overflow-hidden rounded-2xl border border-white/15 shadow-[0_24px_70px_rgba(8,23,43,0.28)] ring-1 ring-black/5">
      <video
        aria-label={title}
        autoPlay
        controls
        loop
        muted={muted}
        playsInline
        preload="metadata"
        className="aspect-video w-full object-cover"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video element.
      </video>
      <button
        type="button"
        aria-label={muted ? "Unmute video" : "Mute video"}
        aria-pressed={!muted}
        onClick={() => setMuted((current) => !current)}
        className="bg-deep-navy/80 hover:bg-deep-navy focus-visible:outline-amber absolute top-3 right-3 z-10 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {muted ? (
          <VolumeX size={16} aria-hidden="true" />
        ) : (
          <Volume2 size={16} aria-hidden="true" />
        )}
        {muted ? "Unmute" : "Mute"}
      </button>
    </div>
  );
}
