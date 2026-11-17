"use client";

import { useEffect, useRef } from "react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Button from "@/components/Button";
import { cx } from "@/utils/cx";
import { isDev } from "@/utils/dev";
import { hasContent } from "@/utils/slots";
import { Styles } from "@/utils/styles";

type Props = Omit<ComponentPropsWithoutRef<"dialog">, "className"> & {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Modal ID for triggers, hash links, and `?modal=`. Required. */
  id?: string;
  /** Accessible label. */
  label?: string;
  /** Modal style. */
  variant?: "small" | "side-panel" | "full-screen";
  /** Keep open in design mode. */
  preview?: boolean;
  class?: string;
  children?: ReactNode;
};

export default function Modal({
  render = true,
  id,
  label,
  variant = "small",
  preview = false,
  class: className,
  children,
  ...rest
}: Props) {
  const root = useRef<HTMLDialogElement>(null);
  const content = hasContent(children);

  if (isDev && render && content && !id) {
    console.warn(
      "[lumos] <Modal> rendered without an `id`, so nothing could open it and nothing was output.",
    );
  }

  useEffect(() => {
    const modal = root.current;
    if (!modal) return;
    const scroll = modal.querySelector<HTMLElement>("[data-modal-scroll]");

    const open = () => {
      if (modal.open) return;
      if (scroll) scroll.scrollTop = 0;
      modal.showModal();
      modal.dispatchEvent(new CustomEvent("modal-open", { bubbles: true }));
    };

    const onClose = () => modal.dispatchEvent(new CustomEvent("modal-close", { bubbles: true }));
    let fromBackdrop = false;

    const onMouseDown = (event: MouseEvent) => {
      fromBackdrop = event.target === modal;
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("[data-modal-close]")) modal.close();
      else if (fromBackdrop && target === modal) modal.close();
      fromBackdrop = false;
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest(`[data-modal-open="${modal.id}"], a[href="#${modal.id}"]`);
      if (!trigger) return;
      event.preventDefault();
      open();
    };

    modal.addEventListener("close", onClose);
    modal.addEventListener("mousedown", onMouseDown);
    modal.addEventListener("click", onClick);
    document.addEventListener("click", onDocumentClick);

    const url = new URL(location.href);
    if (url.searchParams.get("modal") === modal.id) {
      open();
      url.searchParams.delete("modal");
      history.replaceState(history.state, "", url);
    }

    return () => {
      modal.removeEventListener("close", onClose);
      modal.removeEventListener("mousedown", onMouseDown);
      modal.removeEventListener("click", onClick);
      document.removeEventListener("click", onDocumentClick);
    };
  }, []);

  if (!render || !id || !content) return <Styles id="modal" css={css} />;

  return (
    <>
      <Styles id="modal" css={css} />
      <dialog
        ref={root}
        id={id}
        className={cx("modal_wrap", variant !== "small" && variant, preview && "preview", className)}
        aria-label={label}
        {...rest}
      >
        <div className="modal_content">
          <Button class="modal_close" variant="close" emphasis="secondary" data-modal-close />
          <div className="modal_scroll" data-modal-scroll data-lenis-prevent>
            <div className="modal_body margin-trim">{children}</div>
          </div>
        </div>
      </dialog>
    </>
  );
}

const css = `
@layer components {
  html:has(.modal_wrap[open]) {
    overflow: hidden;
  }

  .modal_wrap {
    --_leaving: calc(var(--open-duration) * 0.7);
    --_from: 0 2rem;
    --_body: 0 0;
    --_backdrop: color-mix(in lab, black 60%, transparent);
    --_close: calc(2.75em + var(--space-4) * 2);
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    margin: 0;
    padding: var(--site-margin);
    align-items: center;
    justify-content: center;
    background: none;
    border: 0;
    color: var(--text);
    overflow: clip;
    transition:
      display var(--_leaving) allow-discrete,
      overlay var(--_leaving) allow-discrete;

    &[open] {
      display: flex;
      transition:
        display var(--open-duration) allow-discrete,
        overlay var(--open-duration) allow-discrete;
    }

    .stacki-designer &.preview,
    &.stacki-opened {
      display: flex;
      position: fixed;
      inset: 0;
      z-index: 100;
      background-color: var(--_backdrop);
    }

    &::backdrop {
      background-color: var(--_backdrop);
      opacity: 0;
      transition: opacity var(--_leaving) var(--open-ease);
    }

    &[open]::backdrop {
      opacity: 1;
      transition: opacity var(--open-duration) var(--open-ease);
    }

    @starting-style {
      &[open]::backdrop {
        opacity: 0;
      }
    }

    &.side-panel {
      --_panel: 28rem;
      --_from: var(--_panel) 0;
      padding: 0;
      align-items: stretch;
      justify-content: end;
    }

    &.full-screen {
      --_from: 0 0;
      --_body: 0 2rem;
      padding: 0;
      align-items: stretch;
    }
  }

  .modal_content {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 34rem;
    max-height: 100%;
    background-color: var(--background);
    border-radius: var(--radius-main);
    overflow: hidden;
    opacity: 0;
    translate: var(--_from);
    transition:
      opacity var(--_leaving) var(--open-ease),
      translate var(--_leaving) var(--open-ease);

    .modal_wrap.side-panel & {
      max-width: var(--_panel);
      max-height: none;
      border-radius: 0;
    }

    .modal_wrap.full-screen & {
      max-width: none;
      max-height: none;
      border-radius: 0;
    }

    .modal_wrap:is([open], .stacki-opened) &,
    .stacki-designer .modal_wrap.preview & {
      opacity: 1;
      translate: 0 0;
      transition:
        opacity var(--open-duration) var(--open-ease),
        translate var(--open-duration) var(--open-ease);
    }

    @starting-style {
      .modal_wrap[open] & {
        opacity: 0;
        translate: var(--_from);
      }
    }
  }

  .modal_close {
    position: absolute;
    top: var(--space-4);
    inset-inline-end: var(--space-4);
    z-index: 1;
  }

  .modal_scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;

    .modal_wrap.full-screen & {
      height: 100%;
    }
  }

  .modal_body {
    padding: var(--_close) var(--space-6) var(--space-7);
    translate: var(--_body);
    transition: translate var(--_leaving) var(--open-ease);

    .modal_wrap.full-screen & {
      min-height: 100%;
      display: grid;
      align-content: center;
    }

    .modal_wrap:is([open], .stacki-opened) &,
    .stacki-designer .modal_wrap.preview & {
      translate: 0 0;
      transition: translate var(--open-duration) var(--open-ease);
    }

    @starting-style {
      .modal_wrap[open] & {
        translate: var(--_body);
      }
    }
  }
}
`;
