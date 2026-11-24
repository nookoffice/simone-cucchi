"use client";

import { type CSSProperties, useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Fixed scroll-position indicator for case studies. One tick per page section;
 * the section currently in view is boxed while the rest are thin lines, so the
 * reader can see how far down the study they are. Sits on the right edge where
 * the work index shows its "+". Ticks are also clickable to jump to a section.
 */
export default function CaseStudyProgress() {
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const content = document.querySelector(".lumos-page_content");
    if (!content) return;
    const sections = Array.from(content.children).filter(
      (c): c is HTMLElement => c instanceof HTMLElement,
    );
    setCount(sections.length);

    let raf = 0;
    const update = () => {
      raf = 0;
      // The section occupying the middle of the viewport is "current".
      const mid = window.scrollY + window.innerHeight / 2;
      let idx = 0;
      sections.forEach((el, i) => {
        if (mid >= el.offsetTop) idx = i;
      });
      setActive(idx);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const jumpTo = (i: number) => {
    const content = document.querySelector(".lumos-page_content");
    const el = content?.children[i];
    if (el instanceof HTMLElement) {
      window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
    }
  };

  if (count === 0) return null;

  // Portal to <body> so the fixed indicator isn't trapped in the hero's
  // stacking context (isolation: isolate), which later sections would paint over.
  return createPortal(
    <nav
      className="csprog"
      aria-label="Case study sections"
      style={{ "--csprog-active": active } as CSSProperties}
    >
      {/* One box that glides to the active tick — smooth, not a per-section snap. */}
      <span className="csprog_box" aria-hidden="true" />
      {Array.from({ length: count }).map((_, i) => (
        <button
          type="button"
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed section list
          key={i}
          className="csprog_tick"
          aria-label={`Section ${i + 1} of ${count}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() => jumpTo(i)}
        />
      ))}
    </nav>,
    document.body,
  );
}
