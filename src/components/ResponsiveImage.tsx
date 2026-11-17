import { type ImageField, isFilled } from "@prismicio/client";

/**
 * Renders an image with an optional mobile override. When `mobile` is filled,
 * it is served below `breakpoint` (rem) via <picture>; otherwise `desktop` is
 * used everywhere. Lets Simone art-direct a different crop on phones per slice.
 */
export default function ResponsiveImage({
  desktop,
  mobile,
  className,
  alt,
  breakpoint = 48,
}: {
  desktop: ImageField;
  mobile?: ImageField;
  className?: string;
  alt?: string;
  breakpoint?: number;
}) {
  if (!isFilled.image(desktop)) return null;
  const altText = alt ?? desktop.alt ?? "";

  return (
    <picture>
      {mobile && isFilled.image(mobile) && (
        <source media={`(max-width: ${breakpoint}rem)`} srcSet={mobile.url} />
      )}
      <img className={className} src={desktop.url} alt={altText} />
    </picture>
  );
}
