"use client";

import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, Suspense, useEffect, useRef, useState } from "react";
import type * as THREE from "three";

/**
 * Real-time WebGL glass for the work-index slabs. A transparent, click-through
 * canvas is layered just above the page flood and below the blocks + title; it
 * draws one frosted-glass slab per project block, positioned each frame from the
 * block's live DOM rect. The slab is translucent, so the flood behind it shows
 * through as the slab's tint (matching the Figma, where each bar takes the
 * project colour); soft studio panels give it a glassy sheen. When a block opens
 * (grows to reveal its teaser) its slab is hidden, so the sharp image shows.
 */
function Slabs({
  listRef,
  count,
  activeIndex,
}: {
  listRef: RefObject<HTMLElement | null>;
  count: number;
  activeIndex: number | null;
}) {
  const { size } = useThree();
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  // The resting slab size (all bars share it); measured from the DOM so the glass
  // matches the real block dimensions at any viewport width.
  const [dims, setDims] = useState({ w: 184, h: 40 });

  useEffect(() => {
    const measure = () => {
      const block = listRef.current?.querySelector<HTMLElement>(".work_block");
      if (!block) return;
      const r = block.getBoundingClientRect();
      // Clamp the height to the resting bar (a block mid-open would over-report).
      setDims({ w: r.width, h: Math.min(r.height, 44) });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [listRef]);

  useFrame(() => {
    const list = listRef.current;
    if (!list) return;
    const blocks = list.querySelectorAll<HTMLElement>(".work_block");
    blocks.forEach((b, i) => {
      const m = meshes.current[i];
      if (!m) return;
      const r = b.getBoundingClientRect();
      m.position.set(
        r.left + r.width / 2 - size.width / 2,
        size.height / 2 - (r.top + r.height / 2),
        0,
      );
      // Hide the slab for the open block (tall) so its teaser image reads sharp.
      m.visible = i !== activeIndex && r.width > 0 && r.height <= 60;
    });
  });

  const radius = Math.min(dims.h / 2.6, 8);
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <RoundedBox
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length slab list
          key={i}
          ref={(el: THREE.Mesh | null) => {
            meshes.current[i] = el;
          }}
          args={[dims.w, dims.h, 11]}
          radius={radius}
          smoothness={5}
          visible={false}
        >
          <meshPhysicalMaterial
            transparent
            opacity={0.34}
            roughness={0.45}
            metalness={0}
            clearcoat={1}
            clearcoatRoughness={0.3}
            color="#f7f8fa"
            envMapIntensity={1.7}
            transmission={0}
          />
        </RoundedBox>
      ))}
    </>
  );
}

function hasWebGL() {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export default function WorkSlabs({
  listRef,
  count,
  activeIndex,
  onReady,
}: {
  listRef: RefObject<HTMLElement | null>;
  count: number;
  activeIndex: number | null;
  onReady?: () => void;
}) {
  const [ok] = useState(
    () =>
      hasWebGL() &&
      !(
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ),
  );
  if (!ok) return null;

  return (
    <div className="work_slabs" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 100], zoom: 1 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        onCreated={() => onReady?.()}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          {/* Soft studio panels on a mid surround — bright sheen, no harsh darks,
              so the bars read as light frosted glass rather than smoked glass. */}
          <Environment resolution={256}>
            <color attach="background" args={["#b9bcc4"]} />
            <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 3, 3]} scale={[9, 3, 1]} />
            <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[-4, 0, 3]} rotation={[0, Math.PI / 2, 0]} scale={[4, 6, 1]} />
            <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[4, 0, 3]} rotation={[0, -Math.PI / 2, 0]} scale={[4, 6, 1]} />
          </Environment>
          <Slabs listRef={listRef} count={count} activeIndex={activeIndex} />
        </Suspense>
      </Canvas>
    </div>
  );
}
