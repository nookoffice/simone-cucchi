import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import ResponsiveImage from "@/components/ResponsiveImage";
import "./index.css";

export type PhoneScreensProps = SliceComponentProps<Content.PhoneScreensSlice>;

/** A centred row of app screenshots; individual screens can be lifted. */
export default function PhoneScreens({ slice }: PhoneScreensProps) {
  const screens = slice.primary.screens;

  return (
    <section className="csp_section" data-reveal>
      <div className="csp_row">
        {screens.map((screen, index) => (
          <ResponsiveImage
            key={`${index}-${screen.alt ?? ""}`}
            className={`csp_phone${screen.raised ? " csp_phone-raised" : ""}`}
            desktop={screen.image}
            mobile={screen.image_mobile}
            alt={screen.alt ?? undefined}
          />
        ))}
      </div>
    </section>
  );
}
