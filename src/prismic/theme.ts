import { createClient } from "@/prismicio";

export const SITE_THEMES = ["light", "dark", "brand"] as const;

export type SiteTheme = (typeof SITE_THEMES)[number];

function isSiteTheme(value: unknown): value is SiteTheme {
  return typeof value === "string" && (SITE_THEMES as readonly string[]).includes(value);
}

/** Site theme from the settings document. `light` when the field is empty or the API is unavailable. */
export async function getSiteTheme(): Promise<SiteTheme> {
  try {
    const settings = await createClient().getSingle("settings");
    if (isSiteTheme(settings.data.theme)) return settings.data.theme;
  } catch {
    return "light";
  }
  return "light";
}
