import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import ResponsiveImage from "@/components/ResponsiveImage";
import "./index.css";

export type SectionImageProps = SliceComponentProps<Content.SectionImageSlice>;

/** An eyebrow label above a wide image. */
export default function SectionImage({ slice }: SectionImageProps) {
  const { eyebrow, image, image_mobile } = slice.primary;

  return (
    <section className="csi_section" data-reveal>
      {isFilled.keyText(eyebrow) && <p className="csi_eyebrow">{eyebrow}</p>}
      <ResponsiveImage className="csi_img" desktop={image} mobile={image_mobile} />
    </section>
  );
}
