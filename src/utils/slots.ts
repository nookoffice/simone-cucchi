import { Children, Fragment, isValidElement, type ReactNode } from "react";

/**
 * Ignores empty and whitespace-only slots. Used by Button, NavLink, and
 * slotted form, interactive, typography, and wrapper components.
 */
export function hasContent(node: ReactNode): boolean {
  if (node == null || node === false || node === true) return false;
  if (typeof node === "string") return node.trim().length > 0;
  if (typeof node === "number") return true;
  if (Array.isArray(node)) return node.some(hasContent);

  if (isValidElement(node)) {
    if (node.type === Fragment) {
      const props = node.props as { children?: ReactNode };
      return hasContent(props.children);
    }
    return true;
  }

  return Children.toArray(node).some((child) => {
    if (typeof child === "string") return child.trim().length > 0;
    return child != null;
  });
}
