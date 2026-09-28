"use client";

import React, { useEffect, useState } from "react";

export function GrainOverlay() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <svg
      className="grain-overlay h-full w-full"
    >
      <filter id="grain">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0 0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
