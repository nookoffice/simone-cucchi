import type { ComponentPropsWithoutRef } from "react";
import Eyebrow from "@/components/typography/Eyebrow";
import Heading from "@/components/typography/Heading";
import Paragraph from "@/components/typography/Paragraph";
import Button from "@/components/Button";
import ButtonWrapper from "@/components/wrapper/ButtonWrapper";
import Img, { type ImageSource } from "@/components/media/Img";
import Overlay from "@/components/media/Overlay";
import { cx } from "@/utils/cx";
import { isDev } from "@/utils/dev";
import { Styles } from "@/utils/styles";

type Base = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Eyebrow text. Supports inline markup. */
  eyebrow?: string;
  /** Card title. Supports inline markup. */
  heading?: string;
  /** Heading level. */
  headingTag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Body text. Supports inline markup. */
  text?: string;
  /** Button label. Omit to hide the button. */
  buttonLabel?: string;
  /** Button destination. Omit for a `<button>`. */
  buttonHref?: string;
  /** Card layout. */
  variant?: "default" | "cover" | "stacked";
  /** Color theme of element and its children. */
  theme?: "inherit" | "light" | "dark" | "brand" | "invert";
  class?: string;
};

type Props = Base &
  (
    | {
        variant?: "default";
        image?: never;
        imageAlt?: never;
      }
    | {
        variant: "cover";
        /** Image source. */
        image?: ImageSource;
        /** Image alt text. Omit for decorative images. */
        imageAlt?: string;
      }
    | {
        variant: "stacked";
        /** Color theme of element and its children. */
        theme?: never;
        /** Image source. */
        image?: ImageSource;
        /** Image alt text. Omit for decorative images. */
        imageAlt?: string;
      }
  );

type AllProps = Base & {
  image?: ImageSource;
  imageAlt?: string;
};

export default function Card(props: Props) {
  const {
    render = true,
    eyebrow,
    heading,
    headingTag = "h3",
    text,
    buttonLabel,
    buttonHref,
    variant = "default",
    theme = "inherit",
    image,
    imageAlt,
    class: className,
    ...rest
  } = props as AllProps;

  const hasImage = variant !== "default" && !!image;
  const hasCopy = !!(eyebrow || heading || text || buttonLabel);
  const hasTheme = variant !== "stacked" && theme !== "inherit";

  const buttonKind =
    variant === "stacked"
      ? ({ variant: "link" } as const)
      : ({ emphasis: variant === "cover" ? "primary" : "secondary" } as const);

  if (isDev && render) {
    if (variant === "stacked" && theme !== "inherit") {
      console.warn(
        '[lumos] <Card variant="stacked"> has no surface to color, so `theme` was dropped. It keeps the theme around it.',
      );
    }
    if (variant === "default" && image) {
      console.warn(
        '[lumos] <Card variant="default"> holds no image, so `image` was dropped. Use the cover or stacked variant to show it.',
      );
    }
    if (variant !== "default" && !image) {
      console.warn(
        `[lumos] <Card variant="${variant}"> has no \`image\`, so it renders as a plain card.`,
      );
    }
  }

  if (!render || (!hasCopy && !hasImage)) return <Styles id="card" css={css} />;

  return (
    <>
      <Styles id="card" css={css} />
      <div
        className={cx("card_wrap", variant !== "default" && variant, hasTheme && `theme-${theme}`, className)}
        {...rest}
      >
        {hasImage && image && (
          <div className="card_visual">
            <Img src={image} alt={imageAlt} />
            {variant === "cover" && <Overlay variant="gradient" />}
          </div>
        )}
        {hasCopy && (
          <div className="card_content margin-trim">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {heading && (
              <Heading tag={headingTag} variant="h5">
                {heading}
              </Heading>
            )}
            {text && <Paragraph>{text}</Paragraph>}
            {buttonLabel && (
              <ButtonWrapper>
                {buttonHref ? (
                  <Button element="link" href={buttonHref} {...buttonKind}>
                    {buttonLabel}
                  </Button>
                ) : (
                  <Button {...buttonKind}>{buttonLabel}</Button>
                )}
              </ButtonWrapper>
            )}
          </div>
        )}
      </div>
    </>
  );
}

const css = `
@layer components {
  .card_wrap {
    --_padding: var(--space-6);
    --_min-height: 20rem;
    --_visual-ratio: 3 / 2;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: var(--_padding);
    position: relative;
    background-color: var(--background-2);
    border-radius: var(--radius-main);
    overflow: clip;

    &.cover {
      min-height: var(--_min-height);
    }
    &.stacked {
      background-color: transparent;
      overflow: visible;
    }
  }

  .card_visual {
    position: relative;
    width: 100%;
    flex: none;
    border-radius: inherit;
    overflow: clip;

    .stacked > & {
      aspect-ratio: var(--_visual-ratio);
    }

    .cover > & {
      position: absolute;
      inset: 0;
      height: 100%;
      pointer-events: none;
    }

    > :is(.image, .video) {
      width: 100%;
      height: 100%;
    }
  }

  .card_visual > :is(.image, .video) {
    width: 100%;
    height: 100%;
  }

  .card_content > .button-wrapper:last-child {
    margin-top: auto;
    padding-top: var(--space-6);
  }

  .card_content {
    display: flex;
    flex-direction: column;
    align-items: var(--_alignment, start);
    text-align: var(--_alignment, start);
    flex-grow: 1;
    width: 100%;
    max-width: 100%;
    padding: var(--_padding);

    .cover > & {
      z-index: 1;
    }

    .stacked > & {
      padding-inline: 0;
      padding-top: 0;
    }
  }

  .card_wrap:has(.button_wrap) {
    .button_wrap::after {
      content: "";
      position: absolute;
      inset: 0;
    }

    .card_content a:not(.button_wrap) {
      position: relative;
      z-index: 1;
    }

    .image {
      transition: scale calc(var(--hover-duration) * 2) var(--hover-ease);
    }

    @media (hover: hover) {
      &:hover .image {
        scale: 1.04;
      }
    }
  }
}
`;
