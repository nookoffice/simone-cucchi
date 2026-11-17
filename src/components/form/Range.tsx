"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { slug } from "@/utils/slug";
import { cx } from "@/utils/cx";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"input">, "className" | "type" | "value"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Field label. */
  label?: string;
  /** Initial value. Defaults to the midpoint.
   *
   * @min 0
   * @max 100
   * @int */
  value?: number;
  /** Minimum value. Defaults to `0`.
   *
   * @int */
  min?: number;
  /** Maximum value. Defaults to `100`.
   *
   * @int */
  max?: number;
  /** Value interval. Defaults to `1`.
   *
   * @min 1
   * @int */
  step?: number;
  /** Unit shown after the value. */
  unit?: string;
  /** Submitted name. Defaults to the label slug. */
  name?: string;
  /** Require the field and mark its label. */
  required?: boolean;
  class?: string;
};

export default function Range({
  render = true,
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit,
  name,
  required = false,
  id,
  class: className,
  style,
  ...rest
}: Props) {
  const root = useRef<HTMLDivElement>(null);
  const start = value ?? Math.round((min + max) / 2);
  const progress = max === min ? 0 : (start - min) / (max - min);
  const fieldId = id ?? `range-${label ? slug(label) : "field"}`;

  useEffect(() => {
    const range = root.current;
    if (!range) return;
    const input = range.querySelector<HTMLInputElement>(".form-range_input");
    const shown = range.querySelector<HTMLElement>(".form-range_value");
    if (!input) return;

    const update = () => {
      const low = Number(input.min || 0);
      const high = Number(input.max || 100);
      const at = Number(input.value);
      range.style.setProperty("--_progress", String(high === low ? 0 : (at - low) / (high - low)));
      if (shown) shown.textContent = input.value;
    };

    input.addEventListener("input", update);
    update();
    range.classList.add("is-drawn");
    return () => input.removeEventListener("input", update);
  }, []);

  if (!render || !label) return <Styles id="range" css={css} />;

  return (
    <>
      <Styles id="range" css={css} />
      <div
        ref={root}
        className={cx("field", "form-range", className)}
        style={{ ...style, ["--_progress" as string]: String(progress) } as CSSProperties}
      >
        <label className="field-label text-style-main" htmlFor={fieldId}>
          <span>{label}</span>
          {required && (
            <span className="field-star" aria-hidden="true">
              *
            </span>
          )}
        </label>
        <span className="form-range_control">
          <input
            className="form-range_input"
            type="range"
            id={fieldId}
            name={name ?? slug(label)}
            min={min}
            max={max}
            step={step}
            defaultValue={start}
            required={required || undefined}
            {...rest}
          />
          <span className="form-range_track" aria-hidden="true" />
          <span className="form-range_fill" aria-hidden="true" />
          <span className="form-range_handle" aria-hidden="true" />
        </span>
        <output className="form-range_output text-style-small" htmlFor={fieldId}>
          <span className="form-range_value">{start}</span>
          {unit && <span>{unit}</span>}
        </output>
      </div>
    </>
  );
}

const css = `
@layer components {
  .form-range {
    --_handle: 1.75rem;
    --_handle-face: currentColor;
    --_rail: 0.25rem;
  }

  .form-range.is-drawn {
    --_handle-face: transparent;
  }

  .form-range:not(.is-drawn) :is(.form-range_fill, .form-range_handle) {
    display: none;
  }

  .form-range_control {
    position: relative;
    display: flex;
    align-items: center;
    height: var(--_handle);
  }

  .form-range_input {
    appearance: none;
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    margin: 0;
    background: none;
    cursor: grab;
    &:active {
      cursor: grabbing;
    }
    &::-webkit-slider-thumb {
      appearance: none;
      width: var(--_handle);
      height: var(--_handle);
      border-radius: var(--radius-round);
      background: var(--_handle-face);
    }
    &::-moz-range-thumb {
      width: var(--_handle);
      height: var(--_handle);
      border: 0;
      border-radius: var(--radius-round);
      background: var(--_handle-face);
    }
    &:focus-visible ~ .form-range_handle {
      outline: var(--focus-width) solid var(--text);
      outline-offset: var(--focus-offset);
    }
  }

  .form-range_track,
  .form-range_fill {
    position: absolute;
    inset-inline-start: 0;
    height: var(--_rail);
    border-radius: var(--radius-round);
    pointer-events: none;
  }

  .form-range_track {
    inset-inline-end: 0;
    background-color: var(--border);
  }

  .form-range_fill {
    width: calc(
      var(--_progress, 0) * (100% - var(--_handle)) + var(--_handle) / 2
    );
    background-color: var(--text);
  }

  .form-range_handle {
    position: absolute;
    inset-inline-start: calc(
      var(--_progress, 0) * (100% - var(--_handle)) + var(--_handle) / 2
    );
    translate: -50% 0;
    width: var(--_handle);
    height: var(--_handle);
    border: calc(var(--border-width) * 2) solid var(--text);
    border-radius: var(--radius-round);
    background-color: var(--background);
    pointer-events: none;
  }

  .form-range_output {
    display: flex;
    align-self: start;
    margin-inline-start: calc(
      var(--_progress, 0) * (100% - var(--_handle)) + var(--_handle) / 2
    );
    translate: -50% 0;
    padding: var(--space-1) var(--space-3);
    background-color: var(--background-2);
    border-radius: var(--radius-small);
    white-space: nowrap;
  }
}
`;
