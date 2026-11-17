import { type Content, isFilled } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import type { SliceComponentProps } from "@prismicio/react";
import ResponsiveImage from "@/components/ResponsiveImage";
import "./index.css";

export type NextProjectProps = SliceComponentProps<Content.NextProjectSlice>;

/** A full-bleed link that carries on to the next project. */
export default function NextProject({ slice }: NextProjectProps) {
  const { title, subtitle, image, image_mobile, link } = slice.primary;

  return (
    <PrismicNextLink field={link} className="csn_next" data-reveal>
      <ResponsiveImage className="csn_img" desktop={image} mobile={image_mobile} />
      <div className="csn_content">
        {isFilled.keyText(title) && <span className="csn_title">{title}</span>}
        {isFilled.keyText(subtitle) && <span className="csn_sub">{subtitle}</span>}
      </div>
    </PrismicNextLink>
  );
}
