"use client";

import { Environment, MeshTransmissionMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const PRELOAD_KEY = "sc-preloaded";

/* The Simone Cucchi mark as three vector paths in a 300×300 space: the outer
   ring, the S (offset), and the underbar (offset). Composed here so SVGLoader
   extrudes the whole monogram as one piece of glass. */
const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
<path d="M150 0C67.2912 0 0 67.2912 0 150C0 232.709 67.2912 300 150 300C232.709 300 300 232.709 300 150C300 67.2912 232.709 0 150 0ZM150 280.113C78.26 280.113 19.8869 221.747 19.8869 150C19.8869 78.2532 78.26 19.8869 150 19.8869C221.74 19.8869 280.113 78.2532 280.113 150C280.113 221.747 221.747 280.113 150 280.113Z"/>
<path transform="translate(100.08 46.57)" d="M63.9188 73.8656L44.4407 66.5622C38.0229 64.164 33.0154 61.4798 29.3637 58.3049H98.1401L97.6019 46.4709C96.3278 15.0293 75.4871 0 49.9182 0C24.3494 0 2.43222 16.0308 2.43222 42.6148C2.43222 62.5017 13.7962 75.8891 36.7284 84.8208L56.411 92.533C70.4115 98.0106 80.3515 105.723 80.3515 117.693C80.3515 131.292 68.1769 142.043 51.3353 142.043C29.6226 142.043 21.0996 130.277 19.4781 113.428H0C2.43221 144.27 22.3191 159.088 50.327 159.088C79.9564 159.088 99.8365 141.027 99.8365 116.072C99.8365 97.4043 88.4725 82.995 63.9188 73.8656ZM49.7139 17.0459C64.5933 17.0459 74.6491 23.8997 78.3758 39.1879H22.0534C23.0549 29.0639 29.6907 17.0459 49.7139 17.0459Z"/>
<path transform="translate(100.08 224.12)" d="M99.8365 0H0V19.4781H99.8365V0Z"/>
</svg>`;

/** Build one centred, extruded glass geometry from the composed mark SVG. */
function useMarkGeometry() {
  return useMemo(() => {
    const { paths } = new SVGLoader().parse(MARK_SVG);
    const geos: THREE.ExtrudeGeometry[] = [];
    for (const path of paths) {
      for (const shape of path.toShapes()) {
        geos.push(
          new THREE.ExtrudeGeometry(shape, {
            depth: 34,
            bevelEnabled: true,
            // Rounder, fuller bevels: the edges roll over more so light refracts
            // around them, catching the dark surround and reading as thick glass.
            bevelThickness: 4,
            bevelSize: 2.6,
            bevelSegments: 6,
            curveSegments: 88,
          }),
        );
      }
    }
    const geo = mergeGeometries(geos, false);
    geo.center();
    geo.computeVertexNormals();
    return geo;
  }, []);
}

/** Normalised (-1..1) cursor position over the whole window, shared with the frame loop. */
function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
  return pointer;
}

function Mark({ firstVisit }: { firstVisit: boolean }) {
  const geo = useMarkGeometry();
  // Fresnel dark-edge rim: transparent across the flat faces, near-black at
  // grazing angles — draws the dark outline the reference has on every rounded
  // edge, which real-time transmission alone won't produce.
  const rimMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uColor: { value: new THREE.Color("#0a0a0d") },
          uPower: { value: 2.4 },
          uIntensity: { value: 1 },
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
  const spinner = useRef<THREE.Group>(null);
  const pointer = useWindowPointer();
  const lean = useRef({ x: 0, y: 0 });
  // Entrance factor: 0 → 1 on the first visit, otherwise already settled.
  const intro = useRef({ v: firstVisit ? 0 : 1 });

  useEffect(() => {
    if (!firstVisit) return;
    const tween = gsap.to(intro.current, {
      v: 1,
      duration: 1.4,
      ease: "power3.out",
      delay: 0.15,
      onComplete: () => {
        try {
          sessionStorage.setItem(PRELOAD_KEY, "1");
        } catch {
          /* ignore */
        }
      },
    });
    return () => {
      tween.kill();
    };
  }, [firstVisit]);

  useFrame((state) => {
    const g = spinner.current;
    if (!g) return;
    const t = intro.current.v;
    const time = state.clock.elapsedTime;
    // Gentle head-on sway (keeps the reference's front-facing read) rather than a
    // full spin, plus an inertial lean toward the cursor.
    const swayY = Math.sin(time * 0.3) * 0.22 * t;
    const swayX = Math.sin(time * 0.23 + 1) * 0.06 * t;
    lean.current.x += (-pointer.current.y * 0.2 - lean.current.x) * 0.045;
    lean.current.y += (pointer.current.x * 0.26 - lean.current.y) * 0.045;
    g.rotation.y = swayY + lean.current.y;
    g.rotation.x = swayX + lean.current.x;
    const s = 0.0146 * (0.88 + 0.12 * t);
    g.scale.setScalar(s * 100); // unit group; mesh carries the SVG→world flip
  });

  return (
    <group ref={spinner}>
      {/* Negative Y on the mesh flips SVG's y-down into three's y-up; rotation
          lives on the parent group so it stays clean. */}
      <mesh geometry={geo} scale={[0.01, -0.01, 0.01]}>
        <MeshTransmissionMaterial
          transmission={1}
          thickness={0.5}
          roughness={0}
          ior={1.5}
          chromaticAberration={0.06}
          anisotropicBlur={0.02}
          distortion={0}
          temporalDistortion={0}
          samples={12}
          resolution={1024}
          backside
          backsideThickness={0.15}
          color="#ffffff"
          attenuationColor="#eef0f4"
          attenuationDistance={4}
        />
      </mesh>
      {/* Dark-edge rim overlay (same geometry), drawn over the glass. */}
      <mesh
        geometry={geo}
        scale={[0.01, -0.01, 0.01]}
        material={rimMaterial}
        renderOrder={2}
      />
    </group>
  );
}

/**
 * Self-contained studio environment built from Lightformers — NO network HDRI
 * (drei's `preset` fetches an HDRI from a CDN that silently fails, leaving the
 * glass with no reflections and reading as flat matte plastic). The bright soft
 * panels on a dark surround give the transmission something to refract and sharp
 * specular streaks to catch, so it reads as real glass; the dark background
 * keeps the body smoky/darker and the rounded edges near-black.
 */
function Studio() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[3, 6, 4]} intensity={0.5} />
      {/* Real studio HDRI, bundled in /public. drei's `preset="studio"` fetches
          this same HDRI from a CDN that silently fails (here and in production),
          leaving the glass with no reflections and reading as flat matte plastic.
          The HDRI's rich, contrasty light is what makes the transmission read as
          real glass — crisp reflections, bright glints, dark grazing edges. */}
      <Environment files="/hero/studio.hdr" environmentIntensity={0.6} />
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

export default function HeroLogo3D({ alt }: { alt: string }) {
  const [reduce] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [webgl] = useState(hasWebGL);
  const [ready, setReady] = useState(false);
  const [firstVisit] = useState(() => {
    try {
      return sessionStorage.getItem(PRELOAD_KEY) !== "1";
    } catch {
      return true;
    }
  });

  const showCanvas = webgl && !reduce;

  return (
    <div className="hero_object">
      {/* Poster: shown until the canvas paints, and as the static fallback. */}
      {/* biome-ignore lint/performance/noImgElement: tiny decorative poster */}
      <img
        className="hero_object_media hero_poster"
        src="/hero/logo-glass.png"
        alt={alt}
        draggable={false}
        data-hidden={showCanvas && ready ? "" : undefined}
      />
      {showCanvas && (
        <Canvas
          className="hero_canvas"
          camera={{ position: [0, 0, 6], fov: 40 }}
          gl={{ alpha: true, antialias: true, preserveDrawingBuffer: false }}
          dpr={[1, 2]}
          onCreated={() => setReady(true)}
        >
          {/* Opaque backdrop matching the hero grey: it's what the glass
              refracts, so the monogram reads as clear glass (not black) and the
              square blends seamlessly into the page. */}
          <color attach="background" args={["#e2e2e2"]} />
          <Suspense fallback={null}>
            <Studio />
            <Mark firstVisit={firstVisit} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
