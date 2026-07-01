"use client";

import { useEffect, useRef } from "react";

type VidProps = { mp4: string; poster: string; w: number; h: number };

// Muted autoplay is blocked by browsers unless the element is genuinely muted
// before play() is attempted. React doesn't reliably emit the `muted` attribute
// (SSR + property quirk), so we force it via a ref and start playback on mount.
export function Vid({ mp4, poster, w, h }: VidProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {
      /* if the browser still refuses, the poster stays — acceptable fallback */
    });
  }, []);

  return (
    <video
      ref={ref}
      src={mp4}
      poster={poster}
      width={w}
      height={h}
      muted
      autoPlay
      loop
      playsInline
      preload="metadata"
      className="w-full h-auto"
    />
  );
}
