import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import "./index.css";

export type StatGridProps = SliceComponentProps<Content.StatGridSlice>;

/** A row of headline statistics under an eyebrow and caption. */
export default function StatGrid({ slice }: StatGridProps) {
  const { eyebrow, caption, stats } = slice.primary;

  return (
    <section className="csg_section" data-reveal>
      {isFilled.keyText(eyebrow) && <p className="csg_eyebrow">{eyebrow}</p>}
      <div className="csg_body">
        {isFilled.keyText(caption) && <p className="csg_caption">{caption}</p>}
        <dl className="csg_stats">
          {stats.map((stat, index) => (
            <div className="csg_stat" key={stat.label ?? index}>
              <dt className="csg_value">{stat.value}</dt>
              <dd className="csg_label">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
