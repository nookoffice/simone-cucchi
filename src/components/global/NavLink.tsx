"use client";

import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";

type Props = Omit<ComponentPropsWithoutRef<"a">, "className" | "href"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Link destination. The current URL is marked automatically. */
  href: string;
  class?: string;
  children?: ReactNode;
};

export default function NavLink({
  render = true,
  href,
  class: className,
  children,
  ...rest
}: Props) {
  const pathname = usePathname().replace(/\/+$/, "") || "/";
  if (!render || !hasContent(children)) return null;

  const current = pathname === href.replace(/\/+$/, "") ? "page" : undefined;

  return (
    <li>
      <Link className={cx("nav_link", className)} href={href} aria-current={current} {...rest}>
        {children}
      </Link>
    </li>
  );
}
