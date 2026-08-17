"use client";

import { useAppStore } from "@/store/useAppStore";

export function FilmGrain({ opacity = 0.035 }: { opacity?: number }) {
  const motionMode = useAppStore((state) => state.motionMode);

  if (motionMode === "minimal") return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] h-full w-full select-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg className="h-full w-full opacity-100" xmlns="http://www.w3.org/2000/svg">
        <filter id="rexer-film-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#rexer-film-grain)" />
      </svg>
    </div>
  );
}
