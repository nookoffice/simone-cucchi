import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import Icon from "@/components/media/Icon";
import arrow from "@/assets/icons/arrow-full.svg";
import close from "@/assets/icons/close.svg";
import play from "@/assets/icons/play.svg";
import pause from "@/assets/icons/pause.svg";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Emphasis = "primary" | "secondary";

type Tag =
  | (Omit<ComponentPropsWithoutRef<"button">, "className" | "type"> & {
      /** Rendered element. */
      element?: "button";
      /** Native button type. */
      type?: "button" | "submit" | "reset";
      /** Disable the button. */
      disabled?: boolean;
      href?: never;
    })
  | (Omit<ComponentPropsWithoutRef<"a">, "className" | "type"> & {
      element: "link";
      /** Link destination. */
      href?: string;
      type?: never;
      disabled?: never;
    });

type Kind =
  | {
      /** Button type. */
      variant?: "main";
      /** Visual emphasis. */
      emphasis?: Emphasis;
      label?: never;
      pressed?: never;
      direction?: never;
    }
  | {
      variant: "link";
      /** A link carries no weight of its own: it is already the quietest. */
      emphasis?: never;
      label?: never;
      pressed?: never;
      direction?: never;
    }
  | {
      variant: "play";
      emphasis?: Emphasis;
      /** Accessible label. Defaults to `Play` or `Pause`. */
      label?: string;
      /** Show the pause icon and pressed state. */
      pressed?: boolean;
      direction?: never;
    }
  | {
      variant: "close";
      emphasis?: Emphasis;
      /** Accessible label. Defaults to `Close`. */
      label?: string;
      pressed?: never;
      direction?: never;
    }
  | {
      variant: "arrow";
      emphasis?: Emphasis;
      /** Accessible label. Defaults to `Next` or `Previous`. */
      label?: string;
      pressed?: never;
      /** Arrow direction. */
      direction?: "forward" | "back";
    };

type Props = {
  /** Set to `false` to omit the component. */
  render?: boolean;
  class?: string;
  children?: ReactNode;
} & Tag &
  Kind;

type AllProps = Omit<ComponentPropsWithoutRef<"button">, "className" | "type"> &
  Omit<ComponentPropsWithoutRef<"a">, "className" | "type"> & {
    render?: boolean;
    variant?: "main" | "link" | "play" | "close" | "arrow";
    emphasis?: Emphasis;
    label?: string;
    pressed?: boolean;
    direction?: "forward" | "back";
    element?: "button" | "link";
    href?: string;
    type?: "button" | "submit" | "reset";
    class?: string;
    children?: ReactNode;
  };

export default function Button(props: Props) {
  const {
    render = true,
    variant = "main",
    emphasis = "primary",
    label,
    pressed = false,
    direction = "forward",
    element = "button",
    href,
    type = "button",
    class: className,
    children,
    ...rest
  } = props as AllProps;

  const isLink = element === "link";
  const isWritten = variant === "main" || variant === "link";
  const content = isWritten && hasContent(children);
  if (!render || (isWritten ? !content : false)) return <Styles id="button" css={css} />;

  const named = {
    play: pressed ? "Pause" : "Play",
    close: "Close",
    arrow: direction === "back" ? "Previous" : "Next",
  };

  const classes = cx(
    "button_wrap",
    emphasis !== "primary" && emphasis,
    variant !== "main" && variant,
    variant === "arrow" && direction === "back" && "back",
    className,
  );

  const shared = {
    className: classes,
    "aria-label": isWritten ? undefined : (label ?? named[variant]),
    "aria-pressed": variant === "play" ? pressed : undefined,
    ...rest,
  };

  const marks = (
    <>
      {isWritten && <span className="button_text text-style-trim">{children}</span>}
      {variant === "play" && (
        <>
          <Icon class="button_mark button_play" src={play} variant="small" />
          <Icon class="button_mark button_pause" src={pause} variant="small" />
        </>
      )}
      {variant === "close" && <Icon class="button_mark" src={close} variant="small" />}
      {variant === "arrow" && <Icon class="button_mark" src={arrow} variant="small" />}
    </>
  );

  const internal = isLink && !!href && href.startsWith("/") && !href.startsWith("//");

  return (
    <>
      <Styles id="button" css={css} />
      {isLink ? (
        internal ? (
          <Link href={href || "#"} {...shared}>
            {marks}
          </Link>
        ) : (
          <a href={href || "#"} {...shared}>
            {marks}
          </a>
        )
      ) : (
        <button type={type} {...shared}>
          {marks}
        </button>
      )}
    </>
  );
}

const css = `
@layer components {
  .button_wrap {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    gap: 0.5em;
    padding: 0.75em 1.5em;
    background-color: var(--button-background);
    color: var(--button-text);
    border: var(--border-width) solid var(--button-border);
    border-radius: 0.5em;
    line-height: 1.2;
    text-decoration: none;
    text-align: center;
    transition:
      background-color var(--hover-duration) var(--hover-ease),
      color var(--hover-duration) var(--hover-ease),
      border-color var(--hover-duration) var(--hover-ease);
    @media (hover: hover) {
      &:hover:not(:disabled) {
        background-color: var(--button-background-hover);
        color: var(--button-text-hover);
        border-color: var(--button-border-hover);
      }
    }
    &.secondary {
      --button-background: var(--button-2-background);
      --button-text: var(--button-2-text);
      --button-border: var(--button-2-border);
      --button-background-hover: var(--button-2-background-hover);
      --button-text-hover: var(--button-2-text-hover);
      --button-border-hover: var(--button-2-border-hover);
    }
    &.link {
      --button-background: transparent;
      --button-text: var(--link-text);
      --button-border: var(--link-border);
      --button-background-hover: transparent;
      --button-text-hover: var(--link-text-hover);
      --button-border-hover: var(--link-border);

      padding: 0.4em 0;
      border: 0;
      border-bottom: var(--border-width) solid var(--button-border);
      border-radius: 0;
      background-image: linear-gradient(
        var(--link-border-hover),
        var(--link-border-hover)
      );
      background-repeat: no-repeat;
      background-origin: border-box;
      background-position: 100% 100%;
      background-size: 0 var(--border-width);
      transition:
        background-size calc(var(--hover-duration) * 2) var(--hover-ease),
        color var(--hover-duration) var(--hover-ease),
        border-color var(--hover-duration) var(--hover-ease);
      @media (hover: hover) {
        &:hover:not(:disabled) {
          background-position: 0 100%;
          background-size: 100% var(--border-width);
        }
      }
    }
    &:is(.play, .close, .arrow) {
      gap: 0;
      padding: 0.75em;
      border-radius: var(--radius-round);
    }
    &.back .button_mark {
      rotate: 180deg;
    }
    &.play .button_pause {
      display: none;
    }
    &.play[aria-pressed="true"] {
      & .button_play {
        display: none;
      }
      & .button_pause {
        display: block;
      }
    }
    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
`;
