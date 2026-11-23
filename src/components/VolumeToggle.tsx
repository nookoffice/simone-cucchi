"use client";

import gsap from "gsap";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import RollText from "@/components/RollText";

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
 * the loop keeps playing across page navigation and that turning sound off from
 * any page stops the one and only track (no orphaned audio).
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

/* --- Shared, reactive on/off state. Every VolumeToggle (one per page, plus the
   mobile nav) subscribes to this single store, so the label and the waves always
   agree and a click anywhere starts or stops the one track. --- */
let isOn = false;
let initialised = false;
const listeners = new Set<() => void>();

/** Read the remembered preference once, on the client. */
function ensureInit() {
  if (initialised) return;
  initialised = true;
  try {
    isOn = localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    /* storage unavailable — stay off */
  }
}

function setVolumeOn(next: boolean) {
  if (next === isOn) return;
  isOn = next;
  if (next) {
    void getAudio()
      .play()
      .catch(() => {
        /* blocked until a gesture, or no track — the waves still convey state */
      });
  } else {
    getAudio().pause();
  }
  try {
    localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
  } catch {
    /* ignore */
  }
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/**
 * The "Volume" control. Its label is the ACTION a click performs: while the loop
 * plays it reads "Volume off" (click to stop); while silent it reads "Volume on"
 * (click to start). Hovering previews the equaliser as a greyed wave; playing
 * brightens and animates it. Audio stays silent until the visitor opts in
 * (browsers block autoplay), and the choice is remembered across pages.
 */
export default function VolumeToggle({ className }: { className?: string }) {
  const on = useSyncExternalStore(
    subscribe,
    () => {
      ensureInit();
      return isOn;
    },
    () => false, // server render: always off
  );
  const [preview, setPreview] = useState(false); // hover / focus
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // If a returning visitor had it on, try to resume (may be blocked until a gesture).
  useEffect(() => {
    if (isOn && getAudio().paused) {
      void getAudio()
        .play()
        .catch(() => {
          /* blocked — waits for a click */
        });
    }
  }, []);

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

  return (
    <button
      type="button"
      className={`volume ${className ?? ""}`}
      aria-pressed={on}
      onClick={() => setVolumeOn(!on)}
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
      {/* Label is the action: playing → "off" (click to stop), silent → "on".
          Wrapped in RollText for the same split-text roll as the nav links. */}
      <span className="volume_label">
        <RollText text={`Volume ${on ? "off" : "on"}`} />
      </span>
    </button>
  );
}
