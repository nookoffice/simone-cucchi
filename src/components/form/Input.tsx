import type { ComponentPropsWithoutRef } from "react";
import { slug } from "@/utils/slug";
import { cx } from "@/utils/cx";

type InputVariant =
  | "text"
  | "first-name"
  | "last-name"
  | "email"
  | "phone"
  | "date"
  | "zip-code"
  | "number"
  | "search"
  | "password"
  | "url";

type Props = Omit<ComponentPropsWithoutRef<"input">, "className" | "type"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Field label. Defaults to the variant name. */
  label?: string;
  /** Initial value. */
  value?: string;
  /** Input type and autofill preset. */
  variant?: InputVariant;
  /** Submitted name. Defaults to the label slug. */
  name?: string;
  /** Empty-field hint. Defaults to the variant name. */
  placeholder?: string;
  /** Require the field and mark its label. */
  required?: boolean;
  /** Visually hide the label. */
  labelHidden?: boolean;
  class?: string;
};

const KINDS: Record<
  InputVariant,
  { label: string; type: string; mode: ComponentPropsWithoutRef<"input">["inputMode"]; fill: string }
> = {
  text: { label: "Text", type: "text", mode: "text", fill: "on" },
  "first-name": { label: "First Name", type: "text", mode: "text", fill: "given-name" },
  "last-name": { label: "Last Name", type: "text", mode: "text", fill: "family-name" },
  email: { label: "Email", type: "email", mode: "email", fill: "email" },
  phone: { label: "Phone", type: "tel", mode: "tel", fill: "tel" },
  date: { label: "Date", type: "date", mode: "text", fill: "bday" },
  "zip-code": { label: "Zip Code", type: "text", mode: "numeric", fill: "postal-code" },
  number: { label: "Number", type: "number", mode: "numeric", fill: "off" },
  search: { label: "Search", type: "search", mode: "search", fill: "off" },
  password: { label: "Password", type: "password", mode: "text", fill: "current-password" },
  url: { label: "URL", type: "url", mode: "url", fill: "url" },
};

export default function Input({
  render = true,
  label,
  value,
  variant = "text",
  name,
  placeholder,
  required = false,
  labelHidden = false,
  class: className,
  ...rest
}: Props) {
  if (!render) return null;
  const kind = KINDS[variant];
  const text = label ?? kind.label;

  return (
    <label className={cx("field", "form-input", className)}>
      <span className={cx("field-label text-style-main", labelHidden && "sr-only")}>
        <span>{text}</span>
        {required && (
          <span className="field-star" aria-hidden="true">
            *
          </span>
        )}
      </span>
      <input
        className="field-control text-style-main"
        type={kind.type}
        name={name ?? slug(text)}
        placeholder={placeholder ?? text}
        inputMode={kind.mode}
        autoComplete={kind.fill}
        required={required || undefined}
        defaultValue={value}
        {...rest}
      />
    </label>
  );
}
