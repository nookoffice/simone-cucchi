import { ViewTransition, type ReactNode } from "react";
import SkipLink from "@/components/global/SkipLink";
import Nav from "@/components/global/Nav";
import Footer from "@/components/global/Footer";
import ThemeLock from "@/components/ThemeLock";
import { chromeLinks } from "@/prismic/chromeLinks";
import { getSettings } from "@/prismic/seo";
import { cx } from "@/utils/cx";
import { Styles } from "@/utils/styles";
import type { SeoProps } from "@/types";

type Props = SeoProps & {
  /** Theme for the whole page. `inherit` leaves the root defaults in place. */
  theme?: "inherit" | "light" | "dark" | "brand";
  /**
   * Fix the nav over the page rather than letting it stick in flow, so the
   * first section starts underneath it. Give that section
   * `paddingTop="navoverlap"` to clear the bar.
   */
  overlap?: boolean;
  /** Render the global nav + footer. Set `false` for pages with their own chrome. */
  chrome?: boolean;
  /** Extra elements hoisted into the document head. */
  head?: ReactNode;
  children?: ReactNode;
};

export default async function BaseLayout({
  theme = "inherit",
  overlap = false,
  chrome = true,
  head,
  children,
}: Props) {
  const themeClass = theme !== "inherit" ? `theme-${theme}` : "";
  const settings = await getSettings();
  const headerLinks = chromeLinks(settings?.data.header_links);
  const footerLinks = chromeLinks(settings?.data.footer_links);

  return (
    <div className={cx("lumos-page", themeClass)}>
      <Styles id="page" css={pageCss} />
      <ThemeLock theme={theme} />
      {head}
      <SkipLink />
      {chrome && <Nav overlap={overlap} links={headerLinks} />}
      <main id="main" tabIndex={-1}>
        <ViewTransition name="page" share="page-fade" enter="page-fade" exit="page-fade" default="none">
          <div className="lumos-page_content">{children}</div>
        </ViewTransition>
      </main>
      {chrome && <Footer links={footerLinks} />}
    </div>
  );
}

const pageCss = `
@layer components {
  .lumos-page {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    min-height: 100svh;
  }

  .lumos-page_content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  ::view-transition {
    pointer-events: none;
  }

  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }

  ::view-transition-group(.page-fade) {
    animation-duration: 1ms;
    animation-timing-function: step-start;
  }

  ::view-transition-old(.page-fade) {
    animation: 450ms var(--open-ease, ease) both page-slide-out;
  }

  ::view-transition-new(.page-fade) {
    animation: 450ms var(--open-ease, ease) both page-slide-in;
  }

  @keyframes page-slide-out {
    to {
      opacity: 0;
      transform: translateX(-4%);
    }
  }

  @keyframes page-slide-in {
    from {
      opacity: 0;
      transform: translateX(6%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    ::view-transition-old(.page-fade),
    ::view-transition-new(.page-fade) {
      animation-duration: 0s;
      animation-delay: 0s;
    }
  }
}
`;
