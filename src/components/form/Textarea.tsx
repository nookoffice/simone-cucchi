import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { slug } from "@/utils/slug";
import { cx } from "@/utils/cx";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"textarea">, "className" | "rows"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Field label. */
  label?: string;
  /** Initial value. */
  value?: string;
  /** Submitted name. Defaults to the label slug. */
  name?: string;
  /** Empty-field hint. */
  placeholder?: string;
  /** Minimum visible lines. Defaults to `3`.
   *
   * @min 1
   * @int */
  minLines?: number;
  /** Maximum visible lines. Defaults to `12`.
   *
   * @min 1
   * @int */
  maxLines?: number;
  /** Require the field and mark its label. */
  required?: boolean;
  class?: string;
};

export default function Textarea({
  render = true,
  label,
  value,
  name,
  placeholder,
  minLines = 3,
  maxLines = 12,
  required = false,
  class: className,
  style,
  ...rest
}: Props) {
  if (!render || !label) return <Styles id="textarea" css={css} />;

  return (
    <>
      <Styles id="textarea" css={css} />
      <label
        className={cx("field", "form-textarea", className)}
        style={
          {
            ...style,
            ["--_min-lines" as string]: String(minLines),
            ["--_max-lines" as string]: String(maxLines),
          } as CSSProperties
        }
      >
        <span className="field-label text-style-main">
          <span>{label}</span>
          {required && (
            <span className="field-star" aria-hidden="true">
              *
            </span>
          )}
        </span>
        <textarea
          className="field-control form-textarea_field text-style-main"
          name={name ?? slug(label)}
          placeholder={placeholder}
          required={required || undefined}
          rows={minLines}
          defaultValue={value}
          {...rest}
        />
      </label>
    </>
  );
}

const css = `
@layer components {
  .form-textarea_field {
    field-sizing: content;
    min-height: calc(
      var(--_min-lines, 3) * 1lh + var(--_field-pad-block) * 2 +
        var(--border-width) * 2
    );
    max-height: calc(
      var(--_max-lines, 12) * 1lh + var(--_field-pad-block) * 2 +
        var(--border-width) * 2
    );
    resize: vertical;
  }
}
`;
