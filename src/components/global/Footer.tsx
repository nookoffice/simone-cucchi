import Link from "next/link";
import Icon from "@/components/media/Icon";
import Year from "@/components/global/Year";
import logo from "@/assets/logo/logo.svg";
import { SITE_NAME } from "@/consts";
import type { ChromeLink } from "@/prismic/chromeLinks";
import { Styles } from "@/utils/styles";

type Props = {
  /** Set to `false` to omit the component. */
  render?: boolean;
  /** Footer links from the settings document. */
  links?: ChromeLink[];
};

export default function Footer({ render = true, links = [] }: Props) {
  if (!render) return <Styles id="footer" css={css} />;

  return (
    <>
      <Styles id="footer" css={css} />
      <footer className="footer_wrap">
        <div className="footer_inner">
          <div className="footer_top">
            <Link className="footer_logo" href="/" aria-label={SITE_NAME}>
              <Icon src={logo} variant="full-width" />
            </Link>
            {links.length > 0 ? (
              <nav aria-label="Footer">
                <ul className="footer_links">
                  {links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        className="footer_link"
                        href={link.href}
                        {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>
          <div className="footer_bottom">
            <p className="footer_copyright text-style-small">
              &copy; <Year />
              &#160;
              {SITE_NAME}
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

const css = `
@layer components {
  .footer_wrap {
    display: flex;
    justify-content: center;
    padding-block: var(--section-space-small);
    padding-inline: var(--site-margin);
    background-color: var(--background);
    color: var(--text);
    border-top: var(--border-width) solid var(--border);
  }

  .footer_inner {
    width: 100%;
    max-width: var(--max-width-main);
    display: flex;
    flex-direction: column;
    gap: var(--space-6);
  }

  .footer_top {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4) var(--space-6);
  }

  .footer_logo {
    display: block;
    width: 7.5rem;
    max-width: 100%;
    transition: opacity var(--hover-duration) var(--hover-ease);
    @media (hover: hover) {
      &:hover {
        opacity: 0.6;
      }
    }
  }

  .footer_links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-4);
    font-size: var(--text-small);
    font-weight: var(--primary-medium);
  }

  .footer_link {
    color: var(--text-2);
    text-decoration: none;
    transition: color var(--hover-duration) var(--hover-ease);
    @media (hover: hover) {
      &:hover {
        color: var(--text);
      }
    }
  }

  .footer_bottom {
    padding-top: var(--space-4);
    border-top: var(--border-width) solid var(--border);
  }

  .footer_copyright {
    color: var(--text-2);
  }
}
`;
