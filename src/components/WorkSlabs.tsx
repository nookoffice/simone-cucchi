"use client";

import {
  Environment,
  Lightformer,
  MeshTransmissionMaterial,
  RoundedBox,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  type RefObject,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";

/**
 * Real-time WebGL glass for the work-index slabs, using the same material and
 * studio lighting as the homepage monogram: clear transmission glass that
 * refracts the page grey, a dark studio built from soft light panels for crisp
 * glints, and a Fresnel rim that draws the near-black outline on every rounded
 * edge. A click-through canvas sits above the flood and below the blocks + title;
 * each slab is positioned every frame from its block's live DOM rect, and the
 * open block's slab is hidden so its teaser image reads sharp.
 */

/** Fresnel dark-edge rim (shared across slabs) — same recipe as the hero mark. */
function useRimMaterial() {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color("#060608") },
          uPower: { value: 1.8 },
          uIntensity: { value: 1.7 },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uPower;
          uniform float uIntensity;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            float f = 1.0 - abs(dot(normalize(vView), normalize(vNormal)));
            f = pow(clamp(f, 0.0, 1.0), uPower);
            gl_FragColor = vec4(uColor, f * uIntensity);
          }
        `,
      }),
    [],
  );
}

/** Self-contained dark studio — identical rig to the homepage monogram. */
function Studio() {
  return (
    <>
      <ambientLight intensity={0.08} />
      {/* Narrow side/top panels only — no broad front light, so the flat slab
          faces stay clear (grey shows through) rather than washing white; the
          edges still catch bright streaks. */}
      <Environment resolution={512} environmentIntensity={0.4}>
        <color attach="background" args={["#07070a"]} />
        <Lightformer form="rect" intensity={1.8} color="#ffffff" position={[0, 5, 1]} scale={[10, 2.5, 1]} />
        <Lightformer form="rect" intensity={2.8} color="#eef2f8" position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[5, 9, 1]} />
        <Lightformer form="rect" intensity={2.8} color="#ffffff" position={[5, 0, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 9, 1]} />
        <Lightformer form="ring" intensity={1.2} color="#ffffff" position={[0, 0, -5]} scale={[7, 7, 1]} />
      </Environment>
    </>
  );
}

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
  const groups = useRef<(THREE.Group | null)[]>([]);
  const rim = useRimMaterial();
  // The glass refracts the page grey, so the bars read as clear glass on the
  // hero's backdrop (not black) — same as the monogram's opaque grey.
  const bg = useMemo(() => new THREE.Color("#e2e2e2"), []);
  const [dims, setDims] = useState({ w: 184, h: 40 });

  useEffect(() => {
    const measure = () => {
      const block = listRef.current?.querySelector<HTMLElement>(".work_block");
      if (!block) return;
      const r = block.getBoundingClientRect();
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
      const g = groups.current[i];
      if (!g) return;
      const r = b.getBoundingClientRect();
      g.position.set(
        r.left + r.width / 2 - size.width / 2,
        size.height / 2 - (r.top + r.height / 2),
        0,
      );
      g.visible = i !== activeIndex && r.width > 0 && r.height <= 60;
    });
  });

  // Depth/radius tuned to the bar (≈40px tall) so the glass has real thickness
  // at its edges, like the Figma slab.
  const depth = 13;
  const radius = Math.min(dims.h / 2.6, 8);
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <group
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length slab list
          key={i}
          ref={(el: THREE.Group | null) => {
            groups.current[i] = el;
          }}
          visible={false}
        >
          <RoundedBox args={[dims.w, dims.h, depth]} radius={radius} smoothness={5}>
            <MeshTransmissionMaterial
              background={bg}
              transmissionSampler
              transmission={1}
              thickness={7}
              roughness={0.06}
              ior={1.5}
              chromaticAberration={0.1}
              anisotropicBlur={0.1}
              samples={10}
              resolution={512}
              backside
              backsideThickness={2.5}
              color="#ffffff"
              attenuationColor="#eef0f4"
              attenuationDistance={40}
            />
          </RoundedBox>
          <RoundedBox
            args={[dims.w, dims.h, depth]}
            radius={radius}
            smoothness={5}
            material={rim}
            renderOrder={2}
          />
        </group>
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
          <Studio />
          <Slabs listRef={listRef} count={count} activeIndex={activeIndex} />
        </Suspense>
      </Canvas>
    </div>
  );
}
