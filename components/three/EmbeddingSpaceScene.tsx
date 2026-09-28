"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supportsWebGL, isTouchDevice } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { EmbeddingSpaceFallback } from "./EmbeddingSpaceFallback";

/**
 * Lazy-loaded: the r3f/drei/three bundle is fetched only on the client,
 * only after this wrapper has decided WebGL should actually be used, and
 * never included in the server-rendered HTML (ssr: false). The static SVG
 * fallback renders while the chunk streams in, so there's no blank gap or
 * layout shift.
 */
const EmbeddingSpace = dynamic(() => import("./EmbeddingSpace"), {
  ssr: false,
  loading: () => <EmbeddingSpaceFallback />,
});

type Capability = "checking" | "webgl" | "fallback";

export function EmbeddingSpaceScene() {
  const prefersReducedMotion = useReducedMotion();
  const [capability, setCapability] = useState<Capability>("checking");
  const [ambient, setAmbient] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCapability("fallback");
      return;
    }
    setCapability(supportsWebGL() ? "webgl" : "fallback");
    setAmbient(isTouchDevice() || window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, [prefersReducedMotion]);

  if (capability !== "webgl") {
    return <EmbeddingSpaceFallback />;
  }

  return <EmbeddingSpace ambient={ambient} />;
}
