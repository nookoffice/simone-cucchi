"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const BARS = 5;
/**
 * Ambient loop. Current track: "Mysterious" from Pixabay, used under the
 * Pixabay Content License (free for commercial use, no attribution required).
 * Swap the file at this path to change it.
 */
const AUDIO_SRC = "/audio/ambient-loop.mp3";
const STORAGE_KEY = "sc-volume";

/**
 * The "Volume on/off" control. GSAP animates a cluster of equaliser bars while
 * sound is on; toggling plays/pauses an ambient loop. Audio stays silent until
 * the visitor opts in (browsers block autoplay), and the choice is remembered.
 */
export default function VolumeToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  // Drive animation + audio from the on/off state.
  useEffect(() => {
    const tl = tlRef.current;
    if (on) {
      tl?.play();
      if (!audioRef.current) {
        const audio = new Audio(AUDIO_SRC);
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;
      }
      void audioRef.current.play().catch(() => {
        /* no track yet, or blocked — the waves still convey the state */
      });
    } else {
      tl?.pause(0);
      const bars = svgRef.current?.querySelectorAll("rect");
      if (bars) gsap.set(bars, { clearProps: "transform" });
      audioRef.current?.pause();
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
