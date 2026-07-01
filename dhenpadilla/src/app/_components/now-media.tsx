import React from "react";

type ImgProps = { avif: string; webp: string; w: number; h: number };

// A single film frame: AVIF with WebP fallback, full content-column width,
// natural aspect ratio. Intrinsic w/h prevent layout shift.
export function Img({ avif, webp, w, h }: ImgProps) {
  return (
    <picture>
      <source srcSet={avif} type="image/avif" />
      <source srcSet={webp} type="image/webp" />
      <img
        src={webp}
        width={w}
        height={h}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full h-auto"
      />
    </picture>
  );
}

// Muted, autoplaying, looping, controls-free video with a poster frame.
// Client component (autoplay needs a ref) — see now-video.tsx.
export { Vid } from "./now-video";

// One child → full width. Two children → side by side, widths weighted by
// aspect ratio so the wider frame gets more room (unequal, notebook-style).
export function MediaRow({ children }: { children: React.ReactNode }) {
  const items = React.Children.toArray(children) as React.ReactElement<{ w: number; h: number }>[];
  if (items.length === 1) {
    return <div className="my-6">{items[0]}</div>;
  }
  return (
    <div className="my-6 flex flex-row gap-2 items-start">
      {items.map((child, i) => (
        <div key={i} className="min-w-0" style={{ flex: child.props.w / child.props.h }}>
          {child}
        </div>
      ))}
    </div>
  );
}
