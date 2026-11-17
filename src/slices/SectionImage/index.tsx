import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import "./index.css";

export type SectionImageProps = SliceComponentProps<Content.SectionImageSlice>;

/** An eyebrow label above a wide image. */
export default function SectionImage({ slice }: SectionImageProps) {
  const { eyebrow, image } = slice.primary;

  return (
    <section className="csi_section">
      {isFilled.keyText(eyebrow) && <p className="csi_eyebrow">{eyebrow}</p>}
      {isFilled.image(image) && (
        <img className="csi_img" src={image.url} alt={image.alt ?? ""} />
      )}
    </section>
  );
}
