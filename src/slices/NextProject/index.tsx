import { type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import "./index.css";

export type NextProjectProps = SliceComponentProps<Content.NextProjectSlice>;

/** A full-bleed link that carries on to the next project. */
export default function NextProject({ slice }: NextProjectProps) {
  const { title, subtitle, image, link } = slice.primary;

  return (
    <PrismicNextLink field={link} className="csn_next" data-reveal>
      {isFilled.image(image) && (
        <img className="csn_img" src={image.url} alt={image.alt ?? ""} />
      )}
      <div className="csn_content">
        {isFilled.keyText(title) && <span className="csn_title">{title}</span>}
        {isFilled.keyText(subtitle) && <span className="csn_sub">{subtitle}</span>}
      </div>
    </PrismicNextLink>
  );
}
