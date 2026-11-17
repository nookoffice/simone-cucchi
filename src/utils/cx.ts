import type { CSSProperties } from "react";

/** Joins class names, dropping empties. */
export function cx(
  ...parts: Array<string | false | null | undefined>
): string | undefined {
  const value = parts.filter(Boolean).join(" ");
  return value || undefined;
}

/** Custom properties for a React `style` object. */
export function vars(
  entries: Record<string, string | number | undefined>,
  style?: CSSProperties,
): CSSProperties {
  const custom: Record<string, string> = {};
  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined) custom[key] = String(value);
  }
  return { ...style, ...custom };
}
