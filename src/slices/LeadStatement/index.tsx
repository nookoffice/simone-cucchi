import { asText, type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { cx } from "@/utils/cx";
import "./index.css";

export type LeadStatementProps = SliceComponentProps<Content.LeadStatementSlice>;

/**
 * An eyebrow above a large serif statement. In `wide` mode it becomes a
 * two-column intro — a title on the left, the statement on the right.
 */
export default function LeadStatement({ slice }: LeadStatementProps) {
  const { eyebrow, title, text, wide } = slice.primary;

  return (
    <section className={cx("csl_section", wide && "csl_section-wide")} data-reveal>
      {isFilled.keyText(eyebrow) && <p className="csl_eyebrow">{eyebrow}</p>}
      <div className="csl_body">
        {isFilled.keyText(title) && <h2 className="csl_title">{title}</h2>}
        {isFilled.richText(text) && (
          <p className="csl_text text-style-lead">{asText(text)}</p>
        )}
      </div>
    </section>
  );
}
