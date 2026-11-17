import type { ComponentPropsWithoutRef } from "react";
import { slug } from "@/utils/slug";
import Icon from "@/components/media/Icon";
import arrow from "@/assets/icons/arrow.svg";
import { cx } from "@/utils/cx";
import { Styles } from "@/utils/styles";

type SelectOption = string | { value: string; label: string };

type Base = {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Field label. Defaults to the variant name. */
  label?: string;
  /** Initially selected value. */
  value?: string;
  /** Submitted name. Defaults to the label slug. */
  name?: string;
  /** Prompt shown before selection. Defaults to the variant prompt. */
  placeholder?: string;
  /** Require the field and mark its label. */
  required?: boolean;
  /** Visually hide the label. */
  labelHidden?: boolean;
  class?: string;
};

type Props = Omit<ComponentPropsWithoutRef<"select">, "className"> &
  Base &
  (
    | {
        /** Option source. */
        variant?: "list";
        /** Options to show. Strings double as labels. */
        options: SelectOption[];
        from?: never;
        to?: never;
      }
    | {
        variant: "month" | "day" | "state";
        options?: never;
        from?: never;
        to?: never;
      }
    | {
        variant: "year";
        options?: never;
        /** First year. Defaults to 100 years before `to`.
         *
         * @int */
        from?: number;
        /** Last year. Defaults to the build year.
         *
         * @int */
        to?: number;
      }
  );

type AllProps = Omit<ComponentPropsWithoutRef<"select">, "className"> &
  Base & {
    variant?: "list" | "month" | "day" | "year" | "state";
    options?: SelectOption[];
    from?: number;
    to?: number;
  };

const WORDING = {
  list: { label: "Select", placeholder: "Select one…" },
  month: { label: "Month", placeholder: "MM" },
  day: { label: "Day", placeholder: "DD" },
  state: { label: "State", placeholder: "Select one…" },
  year: { label: "Year", placeholder: "YYYY" },
};

const STATES: SelectOption[] = [
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
].map(([value, label]) => ({ value, label }));

const pad = (n: number) => String(n).padStart(2, "0");
const span = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

export default function Select(props: Props) {
  const {
    render = true,
    label,
    value,
    variant = "list",
    options,
    from,
    to,
    name,
    placeholder,
    required = false,
    labelHidden = false,
    class: className,
    ...rest
  } = props as AllProps;

  const latest = to ?? new Date().getFullYear();
  const earliest = from ?? latest - 100;

  const choices: SelectOption[] =
    variant === "state"
      ? STATES
      : variant === "month"
        ? span(1, 12).map(pad)
        : variant === "day"
          ? span(1, 31).map(pad)
          : variant === "year"
            ? span(earliest, latest).reverse().map(String)
            : (options ?? []);

  const entries = choices.map((choice) =>
    typeof choice === "string" ? { value: choice, label: choice } : choice,
  );

  const wording = WORDING[variant];
  const text = label ?? wording.label;
  if (!render || entries.length === 0) return <Styles id="select" css={css} />;

  return (
    <>
      <Styles id="select" css={css} />
      <label className={cx("field", "form-select", className)}>
        <span className={cx("field-label text-style-main", labelHidden && "sr-only")}>
          <span>{text}</span>
          {required && (
            <span className="field-star" aria-hidden="true">
              *
            </span>
          )}
        </span>
        <span className="form-select_control">
          <select
            className="field-control form-select_field text-style-main"
            name={name ?? slug(text)}
            required={required || undefined}
            defaultValue={value ?? ""}
            {...rest}
          >
            <option value="" disabled hidden>
              {placeholder ?? wording.placeholder}
            </option>
            {entries.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
          <Icon class="form-select_mark" src={arrow} variant="small" />
        </span>
      </label>
    </>
  );
}

const css = `
@layer components {
  .form-select_control {
    position: relative;
    display: block;
  }

  .form-select_field {
    appearance: none;
    padding-inline-end: 3em;
    &:has(option[value=""]:checked) {
      color: var(--text-2);
    }
  }

  .form-select_mark {
    position: absolute;
    inset-inline-end: 1em;
    top: 50%;
    translate: 0 -50%;
    rotate: 90deg;
    pointer-events: none;
    color: var(--text-2);
  }

  @supports (appearance: base-select) {
    .form-select_field,
    .form-select_field::picker(select) {
      appearance: base-select;
    }

    .form-select_field::picker-icon {
      display: none;
    }

    .form-select_field {
      display: flex;
      align-items: center;
      &::before,
      &::after {
        content: none;
      }
    }

    .form-select_mark {
      transition: rotate var(--open-duration) var(--open-ease);
    }

    .form-select_field:open ~ .form-select_mark {
      rotate: -90deg;
    }

    .form-select_field:open {
      background-color: var(--background-3);
      border-end-start-radius: 0;
      border-end-end-radius: 0;
    }

    .form-select_field::picker(select) {
      margin-block: 0;
      padding: var(--space-1);
      max-height: min(18rem, calc(100dvh - 6rem));
      position-try-order: normal;
      overscroll-behavior: contain;
      background-color: var(--background-3);
      border: 0;
      border-radius: var(--radius-small);
      border-start-start-radius: 0;
      border-start-end-radius: 0;
      opacity: 0;
      scale: 0.98;
      transition:
        opacity var(--open-duration) var(--open-ease),
        scale var(--open-duration) var(--open-ease),
        overlay var(--open-duration) var(--open-ease) allow-discrete,
        display var(--open-duration) var(--open-ease) allow-discrete;
    }

    .form-select_field:open::picker(select) {
      opacity: 1;
      scale: 1;
    }

    @starting-style {
      .form-select_field:open::picker(select) {
        opacity: 0;
        scale: 0.98;
      }
    }

    .form-select_field option {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-1) var(--space-2);
      font-size: var(--text-small);
      line-height: var(--line-height-large);
      color: var(--text);
      background-color: transparent;
      border-radius: var(--radius-small);
      cursor: pointer;
      transition: background-color var(--hover-duration) var(--hover-ease);
      &:hover,
      &:focus {
        background-color: var(--background-2);
        outline: 0;
      }
    }

    .form-select_field option[hidden] {
      display: none;
    }

    .form-select_field option::checkmark {
      order: 1;
      margin-inline-start: auto;
      color: var(--text-2);
    }
  }
}
`;
