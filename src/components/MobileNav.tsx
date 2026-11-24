"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CONTACT_EMAIL } from "@/consts";
import VolumeToggle from "@/components/VolumeToggle";
import "./MobileNav.css";

/**
 * Mobile navigation: a hamburger that opens a full-screen dark overlay with the
 * links staggering up, matching the Figma. Shown only below the desktop
 * breakpoint (see MobileNav.css). Closes on navigation and locks scroll while
 * open.
 */
export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close when the route changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock page scroll while the menu is open.
  useEffect(() => {
    const root = document.documentElement;
    if (open) root.classList.add("mnav-open");
    else root.classList.remove("mnav-open");
    return () => root.classList.remove("mnav-open");
  }, [open]);

  return (
    <div className="mnav">
      <button
        type="button"
        className="mnav_toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="mnav_bars" data-open={open ? "" : undefined}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <div className={`mnav_overlay${open ? " is-open" : ""}`}>
        <span className="mnav_dot" aria-hidden="true" />
        <nav className="mnav_links" aria-label="Primary">
          <Link className="mnav_link" href="/work" tabIndex={open ? 0 : -1}>
            Work
          </Link>
          <Link className="mnav_link" href="/about" tabIndex={open ? 0 : -1}>
            About
          </Link>
          <a className="mnav_link" href={`mailto:${CONTACT_EMAIL}`} tabIndex={open ? 0 : -1}>
            Contact
          </a>
        </nav>
        <div className="mnav_foot">
          <VolumeToggle className="mnav_label" />
          <span className="mnav_label">2011 - 2026 ©</span>
        </div>
      </div>
    </div>
  );
}
