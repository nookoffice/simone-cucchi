import type { GroupField, KeyTextField, LinkField } from "@prismicio/client";
import { asLink, isFilled } from "@prismicio/client";

export type ChromeLink = {
  label: string;
  href: string;
  newTab?: boolean;
};

type ChromeLinkItem = {
  label: KeyTextField;
  link: LinkField;
};

/** Turns a settings link group into plain `{ label, href }` items for Nav/Footer. */
export function chromeLinks(items: GroupField<ChromeLinkItem> | null | undefined): ChromeLink[] {
  if (!items?.length) return [];

  const links: ChromeLink[] = [];

  for (const item of items) {
    if (!isFilled.keyText(item.label) || !isFilled.link(item.link)) continue;
    const href = asLink(item.link);
    if (!href) continue;

    const target = "target" in item.link ? item.link.target : undefined;

    links.push({
      label: item.label,
      href,
      ...(target === "_blank" ? { newTab: true } : {}),
    });
  }

  return links;
}
