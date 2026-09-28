"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { CLUSTERS, generateEmbeddingPoints } from "./embedding-data";

interface ThemeColors {
  accent: THREE.Color;
  fg: THREE.Color;
}

/** Reads the live computed CSS custom properties so colors follow the light/dark toggle. */
function readThemeColors(): ThemeColors {
  if (typeof window === "undefined") {
    return { accent: new THREE.Color("#e63312"), fg: new THREE.Color("#0e0e0c") };
  }
  const styles = getComputedStyle(document.documentElement);
  const accentHex = styles.getPropertyValue("--color-accent").trim() || "#e63312";
  const fgHex = styles.getPropertyValue("--color-fg").trim() || "#0e0e0c";
  return { accent: new THREE.Color(accentHex), fg: new THREE.Color(fgHex) };
}

const VERTEX_SHADER = /* glsl */ `
  attribute vec3 pointColor;
  varying vec3 vColor;
  uniform float uPixelRatio;
  void main() {
    vColor = pointColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 30.0 * uPixelRatio / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - vec2(0.5);
    float dist = length(uv);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, dist);
    gl_FragColor = vec4(vColor, alpha * 0.8);
  }
`;

const INFLUENCE_RADIUS = 1.35;
const ATTRACTION_STRENGTH = 0.35;
const LERP_SPEED = 6; // higher = snappier settle, frame-rate independent via delta

interface PointCloudProps {
  ambient: boolean;
  colors: MutableRefObject<ThemeColors>;
  labelRefs: MutableRefObject<Array<HTMLDivElement | null>>;
}

function PointCloud({ ambient, colors, labelRefs }: PointCloudProps) {
  const { viewport } = useThree();
  const points = useMemo(() => generateEmbeddingPoints(), []);
  const count = points.length;

  const basePositions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    points.forEach((p, i) => {
      arr[i * 3] = p.position[0];
      arr[i * 3 + 1] = p.position[1];
      arr[i * 3 + 2] = p.position[2];
    });
    return arr;
  }, [points, count]);

  const currentPositions = useMemo(() => basePositions.slice(), [basePositions]);
  const colorAttr = useMemo(() => new Float32Array(count * 3), [count]);

  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const cursorWorld = useRef(new THREE.Vector3(0, 0, 0));
  const clusterActivation = useRef<Float32Array>(new Float32Array(CLUSTERS.length));

  const uniforms = useMemo(
    () => ({
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1 },
    }),
    []
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Determine the "cursor" target in world space at z = 0.
    if (ambient) {
      cursorWorld.current.set(Math.sin(t * 0.15) * 1.1, Math.cos(t * 0.11) * 0.8, 0);
    } else {
      cursorWorld.current.set(
        (state.pointer.x * viewport.width) / 2,
        (state.pointer.y * viewport.height) / 2,
        0
      );
    }

    const lerpFactor = 1 - Math.exp(-LERP_SPEED * delta);
    const cx = cursorWorld.current.x;
    const cy = cursorWorld.current.y;

    for (let i = 0; i < count; i++) {
      const bx = basePositions[i * 3] ?? 0;
      const by = basePositions[i * 3 + 1] ?? 0;
      const bz = basePositions[i * 3 + 2] ?? 0;

      const dx = bx - cx;
      const dy = by - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const activation = Math.max(0, 1 - dist / INFLUENCE_RADIUS);

      let tx = bx;
      let ty = by;
      const tz = bz;

      if (activation > 0) {
        const pull = activation * ATTRACTION_STRENGTH;
        // Move slightly toward the cursor, proportional to activation.
        const dirX = dist > 0.0001 ? -dx / dist : 0;
        const dirY = dist > 0.0001 ? -dy / dist : 0;
        tx = bx + dirX * pull;
        ty = by + dirY * pull;
      }

      const curIndex = i * 3;
      const curX = currentPositions[curIndex] ?? bx;
      const curY = currentPositions[curIndex + 1] ?? by;
      const curZ = currentPositions[curIndex + 2] ?? bz;

      currentPositions[curIndex] = THREE.MathUtils.lerp(curX, tx, lerpFactor);
      currentPositions[curIndex + 1] = THREE.MathUtils.lerp(curY, ty, lerpFactor);
      currentPositions[curIndex + 2] = THREE.MathUtils.lerp(curZ, tz, lerpFactor);

      const color = colors.current.fg.clone().lerp(colors.current.accent, activation);
      colorAttr[curIndex] = color.r;
      colorAttr[curIndex + 1] = color.g;
      colorAttr[curIndex + 2] = color.b;
    }

    const geometry = geometryRef.current;
    if (geometry) {
      const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute | undefined;
      if (posAttr) posAttr.needsUpdate = true;
      const colAttr = geometry.getAttribute("pointColor") as THREE.BufferAttribute | undefined;
      if (colAttr) colAttr.needsUpdate = true;
    }

    // Per-cluster activation drives label opacity, applied via direct DOM
    // mutation (not React state) to avoid a re-render every frame.
    const activationArr = clusterActivation.current;
    for (let ci = 0; ci < CLUSTERS.length; ci++) {
      const cluster = CLUSTERS[ci];
      if (!cluster) continue;
      const [ccx, ccy] = cluster.center;
      const cdx = ccx - cx;
      const cdy = ccy - cy;
      const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
      const targetActivation = Math.max(0, 1 - cdist / INFLUENCE_RADIUS);
      const prev = activationArr[ci] ?? 0;
      const next = THREE.MathUtils.lerp(prev, targetActivation, lerpFactor);
      activationArr[ci] = next;

      const el = labelRefs.current[ci];
      if (el) {
        const opacity = Math.min(1, 0.15 + next * 1.1);
        el.style.opacity = opacity.toFixed(2);
      }
    }
  });

  return (
    <points>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[currentPositions, 3]} />
        <bufferAttribute attach="attributes-pointColor" args={[colorAttr, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

interface ClusterLabelsProps {
  labelRefs: MutableRefObject<Array<HTMLDivElement | null>>;
}

function ClusterLabels({ labelRefs }: ClusterLabelsProps) {
  return (
    <>
      {CLUSTERS.map((cluster, i) => (
        <Html
          key={cluster.id}
          position={[cluster.center[0], cluster.center[1] + 0.32, cluster.center[2]]}
          center
          occlude={false}
          style={{ pointerEvents: "none" }}
        >
          <div
            ref={(el) => {
              labelRefs.current[i] = el;
            }}
            className="font-mono text-xs whitespace-nowrap text-[var(--color-fg)] tracking-[0.08em]"
            style={{ opacity: 0.15, transition: "opacity 0.2s linear" }}
          >
            {cluster.label}
          </div>
        </Html>
      ))}
    </>
  );
}

interface SceneProps {
  ambient: boolean;
}

function Scene({ ambient }: SceneProps) {
  const colorsRef = useRef<ThemeColors>(readThemeColors());
  const groupRef = useRef<THREE.Group>(null);
  const labelRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const target = document.documentElement;
    const observer = new MutationObserver(() => {
      colorsRef.current = readThemeColors();
    });
    observer.observe(target, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <group ref={groupRef}>
      <PointCloud ambient={ambient} colors={colorsRef} labelRefs={labelRefs} />
      <ClusterLabels labelRefs={labelRefs} />
    </group>
  );
}

interface EmbeddingSpaceProps {
  /** Touch/no-hover devices: gentle ambient drift instead of cursor tracking. */
  ambient?: boolean;
}

export default function EmbeddingSpace({ ambient = false }: EmbeddingSpaceProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <Scene ambient={ambient} />
    </Canvas>
  );
}
