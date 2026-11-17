"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/utils/cx";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"form">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Form name. */
  name?: string;
  /** Form endpoint. Omit to skip submission. */
  action?: string;
  /** Message shown after submission. */
  successMessage?: string;
  /** Message shown after an error. */
  errorMessage?: string;
  class?: string;
  children?: ReactNode;
};

export default function Form({
  render = true,
  name,
  action,
  successMessage = "Thanks — we will be in touch.",
  errorMessage = "That did not send. Please try again.",
  method = "post",
  class: className,
  children,
  ...rest
}: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = root.current;
    const fields = form?.querySelector<HTMLFormElement>(".form_fields");
    if (!form || !fields) return;

    const submit = fields.querySelector<HTMLButtonElement | HTMLInputElement>(
      'button:not([type]), button[type="submit"], input[type="submit"]',
    );

    const onSubmit = async (event: Event) => {
      if (!fields.checkValidity()) return;
      event.preventDefault();
      form.dataset.state = "sending";
      if (submit) submit.disabled = true;

      try {
        const endpoint = form.dataset.endpoint;
        if (endpoint) {
          const answer = await fetch(endpoint, {
            method: fields.method || "post",
            body: new FormData(fields),
            headers: { Accept: "application/json" },
          });
          if (!answer.ok) throw new Error(String(answer.status));
        }
        form.dataset.state = "sent";
        fields.reset();
      } catch {
        form.dataset.state = "failed";
        if (submit) submit.disabled = false;
      }
    };

    fields.addEventListener("submit", onSubmit);
    return () => fields.removeEventListener("submit", onSubmit);
  }, []);

  if (!render || !name || !hasContent(children)) return <Styles id="form" css={css} />;

  return (
    <>
      <Styles id="form" css={css} />
      <div ref={root} className={cx("form_wrap", className)} data-state="idle" data-endpoint={action}>
        <form className="form_fields" name={name} action={action} method={method} {...rest}>
          {children}
        </form>
        <p className="form_note form_note-sent text-style-main" role="status">
          {successMessage}
        </p>
        <p className="form_note form_note-failed text-style-main" role="alert">
          {errorMessage}
        </p>
      </div>
    </>
  );
}

const css = `
@layer components {
  .form_wrap {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    width: 100%;
  }

  .form_fields {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
    row-gap: var(--space-8);
    column-gap: var(--space-8);
  }

  .form_note {
    display: none;
    padding: var(--space-4) var(--space-5);
    border: var(--border-width) solid var(--border);
    border-radius: var(--radius-small);
  }

  .form_wrap[data-state="sent"] {
    & .form_fields {
      display: none;
    }
    & .form_note-sent {
      display: block;
    }
  }

  .form_wrap[data-state="failed"] .form_note-failed {
    display: block;
    color: var(--text);
  }
}
`;
