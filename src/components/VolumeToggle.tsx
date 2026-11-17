"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const BARS = 5;
/**
 * Ambient loop. Current track: "Calm Ambient Dreamscape" by morgan-ambient
 * (Pixabay, Pixabay Content License — free commercial use, no attribution).
 * Swap the file at this path to change it.
 */
const AUDIO_SRC = "/audio/ambient-loop.mp3";
const STORAGE_KEY = "sc-volume";

/**
 * One audio element shared across every toggle on the site. A singleton means
 * the loop keeps playing across page navigation and, crucially, that turning
 * sound off from any page stops the one and only track (no orphaned audio).
 */
let sharedAudio: HTMLAudioElement | null = null;
function getAudio() {
  if (!sharedAudio) {
    sharedAudio = new Audio(AUDIO_SRC);
    sharedAudio.loop = true;
    sharedAudio.volume = 0.45;
  }
  return sharedAudio;
}

/**
 * The "Volume on/off" control. Hovering previews the equaliser as a greyed wave
 * (a hint that sound will play); clicking brightens and enlarges it and starts
 * an ambient loop. Audio stays silent until the visitor opts in (browsers block
 * autoplay), and the choice is remembered.
 */
export default function VolumeToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(false);
  const [preview, setPreview] = useState(false); // hover / focus
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Build the equaliser animation once (skipped when reduced motion is set).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const svg = svgRef.current;
    if (!svg) return;
    const bars = svg.querySelectorAll("rect");
    const tl = gsap.timeline({ paused: true });
    bars.forEach((bar, i) => {
      tl.to(
        bar,
        {
          scaleY: gsap.utils.random(0.35, 1),
          duration: 0.42,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
        },
        i * 0.09,
      );
    });
    tlRef.current = tl;
    return () => {
      tl.kill();
    };
  }, []);

  // Restore the remembered preference.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "on") setOn(true);
    } catch {
      /* storage unavailable — stay off */
    }
  }, []);

  // The wave animates while previewing (hover) or on; otherwise it rests.
  useEffect(() => {
    const tl = tlRef.current;
    if (on || preview) {
      tl?.play();
    } else {
      tl?.pause(0);
      const bars = svgRef.current?.querySelectorAll("rect");
      if (bars) gsap.set(bars, { clearProps: "transform" });
    }
  }, [on, preview]);

  // Audio follows the on/off state only, through the shared element.
  useEffect(() => {
    if (on) {
      void getAudio().play().catch(() => {
        /* blocked until a gesture, or no track — the waves still convey state */
      });
    } else {
      sharedAudio?.pause();
    }
    try {
      localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
    } catch {
      /* ignore */
    }
  }, [on]);

  return (
    <button
      type="button"
      className={`volume ${className ?? ""}`}
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
      onMouseEnter={() => setPreview(true)}
      onMouseLeave={() => setPreview(false)}
      onFocus={() => setPreview(true)}
      onBlur={() => setPreview(false)}
    >
      <svg
        className="volume_waves"
        ref={svgRef}
        width="24"
        height="14"
        viewBox="0 0 24 14"
        aria-hidden="true"
        data-on={on ? "" : undefined}
      >
        {Array.from({ length: BARS }).map((_, i) => (
          <rect
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length decorative bars
            key={i}
            x={i * 5}
            y="3"
            width="2.5"
            height="8"
            rx="1.25"
            fill="currentColor"
            style={{ transformOrigin: "center", transformBox: "fill-box" }}
          />
        ))}
      </svg>
      <span className="volume_label">Volume {on ? "on" : "off"}</span>
    </button>
  );
}
