import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";

type Props = Omit<ComponentPropsWithoutRef<"button">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  class?: string;
  children?: ReactNode;
};

export default function TabLink({
  render = true,
  class: className,
  children,
  ...rest
}: Props) {
  if (!render || !hasContent(children)) return null;

  return (
    <button className={cx("tabs_link", className)} type="button" {...rest}>
      <span className="tabs_link_text text-style-trim">{children}</span>
    </button>
  );
}
