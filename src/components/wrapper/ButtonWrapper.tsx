import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";

type WrapperMargin =
  | "default"
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "auto";

type Props = Omit<ComponentPropsWithoutRef<"div">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Top margin. */
  marginTop?: WrapperMargin;
  class?: string;
  children?: ReactNode;
};

export default function ButtonWrapper({
  render = true,
  marginTop = "default",
  class: className,
  children,
  ...rest
}: Props) {
  if (!render || !hasContent(children)) return null;

  return (
    <div
      className={cx("button-wrapper", marginTop !== "default" && `margin-top-${marginTop}`, className)}
      {...rest}
    >
      {children}
    </div>
  );
}
