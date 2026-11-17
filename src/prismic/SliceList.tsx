import type { SliceZone as SliceZoneField } from "@prismicio/client";
import type { ComponentType } from "react";
import { components as defaultComponents } from "@/slices";

type SliceListProps = {
  slices: SliceZoneField;
  components?: Record<string, ComponentType<any>>;
  context?: unknown;
};

/**
 * Maps `slice_type` → component without Prismic toolbar comment markers.
 * Prefer this over `@prismicio/react` `SliceZone`, which injects
 * `prismic-slice-start` / `prismic-slice-end` comments between slices.
 */
export default function SliceList({
  slices,
  components = defaultComponents,
  context = {},
}: SliceListProps) {
  return (
    <>
      {slices.map((slice, index) => {
        const Comp = components[slice.slice_type];
        if (!Comp) return null;

        const key = "id" in slice && slice.id ? slice.id : `${slice.slice_type}-${index}`;

        return <Comp key={key} slice={slice} index={index} slices={slices} context={context} />;
      })}
    </>
  );
}
