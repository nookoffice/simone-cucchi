"use client";

import { useEffect, useState } from "react";
import { Styles } from "@/utils/styles";

const STORAGE_KEY = "lumos-grid-overlay";
const COLUMNS = 12;

type Props = {
  /** Set to `false` to omit the component. */
  render?: boolean;
};

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

export default function GridOverlay({ render = true }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!render) return;
    setOpen(window.localStorage.getItem(STORAGE_KEY) === "on");

    function onKey(event: KeyboardEvent) {
      if (event.key !== "G" || !event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTyping(event.target)) return;
      event.preventDefault();
      setOpen((current) => {
        const next = !current;
        window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
        return next;
      });
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [render]);

  if (!render) return <Styles id="grid-overlay" css={css} />;

  return (
    <>
      <Styles id="grid-overlay" css={css} />
      {open ? (
        <div className="grid-overlay_wrap" aria-hidden="true">
          <div className="grid-overlay_columns">
            {Array.from({ length: COLUMNS }, (_, index) => (
              <div className="grid-overlay_column" key={index} />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

const css = `
@layer components {
  .grid-overlay_wrap {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    justify-content: center;
    pointer-events: none;
  }

  .grid-overlay_columns {
    width: var(--site-width);
    max-width: var(--max-width-main);
    height: 100%;
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    column-gap: var(--site-gutter);
  }

  .grid-overlay_column {
    background-color: color-mix(in lab, var(--brand-500) 24%, transparent);
  }
}
`;
