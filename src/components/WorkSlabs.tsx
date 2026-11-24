"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Real-time WebGL glass for the work-index slabs, matching the reference build:
 * delicate dispersive glass bars (MeshPhysicalMaterial — transmission, dispersion,
 * a crisp clearcoat) floating over a living, dark maroon gradient field. The glass
 * refracts that dark backdrop, which is why it reads as deep clear glass rather
 * than a bright chrome button. A click-through canvas sits above the CSS flood and
 * below the blocks + title; each slab is positioned every frame from its block's
 * live DOM rect, and the open block's slab is hidden so its teaser image reads
 * sharp. The field's palette drifts toward the hovered project.
 */

/** Per-project field palettes. Resting is the maroon default; each project shifts
    the gradient's glow / base / shadow toward its own key. Editable here. */
type Palette = { glow: string; base: string; shadow: string };
// Resting is a neutral charcoal field (reference default); each project floods the
// field toward its own brand palette on hover.
const DEFAULT_PALETTE: Palette = { glow: "#6a6a6a", base: "#2a2a2a", shadow: "#000000" };
const PALETTES: Record<string, Palette> = {
  "christies-app": { glow: "#76384a", base: "#4c0012", shadow: "#000000" },
  "christies-3-0": { glow: "#5b3f78", base: "#26103f", shadow: "#000000" },
  burberry: { glow: "#3b4a6b", base: "#0e1a3a", shadow: "#000000" },
};

// Slab geometry is built at unit width (so the physical material's thickness /
// attenuation read in slab-relative units, exactly as the reference tunes them),
// then each mesh is uniformly scaled to its pixel width. Resting height ratio.
const HEIGHT_RATIO = 45 / 192;
const CORNER = 0.035;

/** A rounded-rectangle shape, unit width, centred, `h` tall (ratio of width). */
function roundedRect(h: number) {
  const s = new THREE.Shape();
  const r = -h / 2;
  s.moveTo(-0.5 + CORNER, r);
  s.lineTo(0.5 - CORNER, r);
  s.quadraticCurveTo(0.5, r, 0.5, r + CORNER);
  s.lineTo(0.5, r + h - CORNER);
  s.quadraticCurveTo(0.5, r + h, 0.5 - CORNER, r + h);
  s.lineTo(-0.5 + CORNER, r + h);
  s.quadraticCurveTo(-0.5, r + h, -0.5, r + h - CORNER);
  s.lineTo(-0.5, r + CORNER);
  s.quadraticCurveTo(-0.5, r, -0.5 + CORNER, r);
  return s;
}

/** The extruded, bevelled slab — a thin pane with a soft rounded edge. */
function useSlabGeometry() {
  return useMemo(() => {
    const geo = new THREE.ExtrudeGeometry(roundedRect(HEIGHT_RATIO), {
      depth: 0.09,
      bevelEnabled: true,
      bevelThickness: 0.018,
      bevelSize: 0.018,
      bevelSegments: 3,
      curveSegments: 6,
    });
    geo.translate(0, 0, -0.045);
    return geo;
  }, []);
}

/** The living dark gradient that fills the page and that the glass refracts.
    Ported from the reference: fbm-warped radial blends of glow → base → shadow,
    with a faint second glow and dithered to kill banding in the dark falloff. */
const FIELD_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const FIELD_FRAG = `
  uniform vec3 uGlow;
  uniform vec3 uBase;
  uniform vec3 uShadow;
  uniform float uTime;
  uniform vec2 uSize;
  uniform vec2 uCentre;
  uniform vec2 uSpread;
  uniform vec2 uRoam;
  uniform float uWarp;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y) * 2.0 - 1.0;
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    float aspect = uSize.x / uSize.y;
    vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
    vec2 q = vec2(uv.x * aspect, uv.y);
    float t = uTime * 0.06;
    vec2 warp = vec2(fbm(q * 0.9 + vec2(t, -t * 0.7)), fbm(q * 0.9 + vec2(5.2 - t * 0.8, 1.3 + t)));
    vec2 w = uv + warp * uWarp;

    vec2 centre = uCentre + vec2(fbm(vec2(t * 0.9, 3.1)), fbm(vec2(7.4, t * 0.8))) * vec2(0.14, 0.08);
    float breathe = 1.0 + 0.15 * fbm(vec2(t * 0.7, 11.0));
    float d = length((w - centre) / (uSpread * breathe));
    vec3 colour = mix(uGlow, uBase, smoothstep(-0.05, 0.55, d));
    colour = mix(colour, mix(uBase, uShadow, 0.5), smoothstep(0.3, 0.95, d));
    colour = mix(colour, uShadow, smoothstep(0.6, 1.4, d));

    vec2 roam = uRoam + vec2(fbm(vec2(t * 0.6, 19.0)), fbm(vec2(23.0, t * 0.7))) * vec2(0.3, 0.15);
    float r = length((w - roam) / vec2(0.8, 0.6));
    colour += uGlow * exp(-r * r * 2.2) * 0.3;

    gl_FragColor = vec4(colour, 1.0);
    #include <colorspace_fragment>
    gl_FragColor.rgb += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) / 255.0;
  }
`;

function Field({ activeSlug }: { activeSlug: string | null }) {
  const { size, scene } = useThree();
  const material = useMemo(() => {
    const p = DEFAULT_PALETTE;
    return new THREE.ShaderMaterial({
      vertexShader: FIELD_VERT,
      fragmentShader: FIELD_FRAG,
      uniforms: {
        uGlow: { value: new THREE.Color(p.glow) },
        uBase: { value: new THREE.Color(p.base) },
        uShadow: { value: new THREE.Color(p.shadow) },
        uTime: { value: 0 },
        uSize: { value: new THREE.Vector2(1, 1) },
        // The reference's resting field: a tighter, off-centre glow so most of the
        // page falls to deep shadow (a broad glow reads as a flat pink wash).
        uCentre: { value: new THREE.Vector2(0.32, -0.059) },
        uSpread: { value: new THREE.Vector2(1.242, 1.012) },
        uRoam: { value: new THREE.Vector2(0.622, 0.792) },
        uWarp: { value: 0.108 },
      },
    });
  }, []);
  const target = useRef({
    glow: new THREE.Color(DEFAULT_PALETTE.glow),
    base: new THREE.Color(DEFAULT_PALETTE.base),
    shadow: new THREE.Color(DEFAULT_PALETTE.shadow),
  });

  useEffect(() => () => material.dispose(), [material]);

  useFrame((_, delta) => {
    const u = material.uniforms;
    u.uTime.value += delta;
    u.uSize.value.set(size.width, size.height);
    const p = (activeSlug && PALETTES[activeSlug]) || DEFAULT_PALETTE;
    target.current.glow.set(p.glow);
    target.current.base.set(p.base);
    target.current.shadow.set(p.shadow);
    const k = 1 - Math.exp(-4 * delta);
    (u.uGlow.value as THREE.Color).lerp(target.current.glow, k);
    (u.uBase.value as THREE.Color).lerp(target.current.base, k);
    (u.uShadow.value as THREE.Color).lerp(target.current.shadow, k);
    // A slow drift of the reflected environment keeps the glass alive.
    scene.environmentRotation.set(0, 0.5 * Math.sin(0.1 * u.uTime.value), 0);
  });

  return (
    <mesh position={[0, 0, -500]} scale={[size.width, size.height, 1]} renderOrder={-1} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

/** A dim studio so the clearcoat catches a faint top glint against the dark
    field (envMapIntensity on the material does the amplifying). Children-only, so
    it sets scene.environment without touching scene.background. */
function Studio() {
  return (
    <Environment resolution={256}>
      <color attach="background" args={["#070708"]} />
      {/* One narrow, dim band high overhead: it rims the top bevel with a faint
          glint and no more. Everything else stays near-black so the glass body
          reads darker than the field, as in the reference. */}
      <Lightformer form="rect" intensity={0.32} color="#d7d2d4" position={[0, 9, 5]} scale={[9, 0.7, 1]} />
      <Lightformer form="rect" intensity={0.05} color="#2a2a2e" position={[0, -6, 3]} scale={[12, 3, 1]} />
    </Environment>
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
  const geometry = useSlabGeometry();
  const groups = useRef<(THREE.Group | null)[]>([]);

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      transmission: 1,
      thickness: 0.12,
      ior: 1.6,
      roughness: 0.04,
      dispersion: 0.25,
      envMapIntensity: 2.4,
      specularIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      attenuationColor: new THREE.Color("#c9d0d8"),
      attenuationDistance: 400,
    });
    return m;
  }, []);
  useEffect(() => () => material.dispose(), [material]);
  useEffect(() => () => geometry.dispose(), [geometry]);

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
      // Uniform scale by the slab's pixel width (geometry is unit-width).
      g.scale.setScalar(r.width / 1.036);
      g.visible = i !== activeIndex && r.width > 0 && r.height <= 60;
    });
  });

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
          <mesh geometry={geometry} material={material} />
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
  activeSlug = null,
  onReady,
}: {
  listRef: RefObject<HTMLElement | null>;
  count: number;
  activeIndex: number | null;
  activeSlug?: string | null;
  onReady?: () => void;
}) {
  const ok = useMemo(
    () =>
      hasWebGL() &&
      !(
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ),
    [],
  );
  if (!ok) return null;

  return (
    <div className="work_slabs" aria-hidden="true">
      <Canvas
        orthographic
        camera={{ position: [0, 0, 1000], near: 1, far: 3000, zoom: 1 }}
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
        onCreated={() => onReady?.()}
      >
        <Suspense fallback={null}>
          <Studio />
          <Field activeSlug={activeSlug} />
          <Slabs listRef={listRef} count={count} activeIndex={activeIndex} />
        </Suspense>
      </Canvas>
    </div>
  );
}
