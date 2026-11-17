import { type Content, isFilled } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import "./index.css";

export type PhoneScreensProps = SliceComponentProps<Content.PhoneScreensSlice>;

/** A centred row of app screenshots; individual screens can be lifted. */
export default function PhoneScreens({ slice }: PhoneScreensProps) {
  const screens = slice.primary.screens;

  return (
    <section className="csp_section">
      <div className="csp_row">
        {screens.map((screen, index) =>
          isFilled.image(screen.image) ? (
            <img
              key={screen.alt ?? index}
              className={`csp_phone${screen.raised ? " csp_phone-raised" : ""}`}
              src={screen.image.url}
              alt={screen.alt ?? screen.image.alt ?? ""}
            />
          ) : null,
        )}
      </div>
    </section>
  );
}
