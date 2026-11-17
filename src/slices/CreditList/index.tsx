import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import "./index.css";

export type CreditListProps = SliceComponentProps<Content.CreditListSlice>;

/** Team credits: a role and a name per line. */
export default function CreditList({ slice }: CreditListProps) {
  const { eyebrow, credits } = slice.primary;

  return (
    <section className="csc_section">
      {isFilled.keyText(eyebrow) && <p className="csc_eyebrow">{eyebrow}</p>}
      <ul className="csc_list">
        {credits.map((credit, index) => (
          <li className="csc_credit" key={credit.role ?? index}>
            <span className="csc_role">{credit.role}</span>
            <span className="csc_name">{credit.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
