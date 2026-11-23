import type { CSSProperties } from "react";

/**
 * Split-text hover: every letter rolls up to a duplicate beneath it, staggered
 * left to right. The rolls are decorative (aria-hidden); the real word is kept
 * for screen readers. The surrounding link needs no extra class — the roll is
 * driven from `a:has(.roll):hover` in motion.css.
 */
export default function RollText({ text }: { text: string }) {
  return (
    <span className="roll">
      <span className="sr-only">{text}</span>
      <span className="roll_vis" aria-hidden="true">
        {[...text].map((ch, i) => {
          const glyph = ch === " " ? " " : ch;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed label, index is stable
            <span className="roll_char" key={i} style={{ "--ri": i } as CSSProperties}>
              <span className="roll_face">{glyph}</span>
              <span className="roll_face roll_face-clone">{glyph}</span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
