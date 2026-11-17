import { asText, type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import "./index.css";

export type LeadStatementProps = SliceComponentProps<Content.LeadStatementSlice>;

/** An eyebrow above a large serif statement. */
export default function LeadStatement({ slice }: LeadStatementProps) {
  const { eyebrow, text } = slice.primary;

  return (
    <section className="csl_section" data-reveal>
      {isFilled.keyText(eyebrow) && <p className="csl_eyebrow">{eyebrow}</p>}
      {isFilled.richText(text) && (
        <p className="csl_text text-style-lead">{asText(text)}</p>
      )}
    </section>
  );
}
