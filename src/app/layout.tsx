import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/consts";
import GridOverlay from "@/components/global/GridOverlay";
import ScrollReveal from "@/components/ScrollReveal";
import SmoothScroll from "@/components/SmoothScroll";
import { getSiteTheme } from "@/prismic/theme";
import "@/styles/global.css";

// Nimbus Sans — the display/UI sans, exposed via --primary-family.
const nimbusSans = localFont({
  src: [
    { path: "../assets/fonts/NimbusSans-Regular.otf", weight: "400", style: "normal" },
    { path: "../assets/fonts/NimbusSans-Italic.otf", weight: "400", style: "italic" },
    { path: "../assets/fonts/NimbusSans-Bold.otf", weight: "700", style: "normal" },
    { path: "../assets/fonts/NimbusSans-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-nimbus",
  display: "swap",
});

// Victor (KOMETA Victor, trial) — the editorial serif, exposed via --secondary-family.
const victor = localFont({
  src: [
    { path: "../assets/fonts/Victor-Regular.otf", weight: "400", style: "normal" },
    { path: "../assets/fonts/Victor-Italic.otf", weight: "400", style: "italic" },
    { path: "../assets/fonts/Victor-Medium.otf", weight: "500", style: "normal" },
    { path: "../assets/fonts/Victor-Semibold.otf", weight: "600", style: "normal" },
    { path: "../assets/fonts/Victor-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-victor",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { absolute: SITE_NAME },
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
  },
  generator: "Next.js",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteTheme = await getSiteTheme();

  return (
    <html lang="en" className={`${nimbusSans.variable} ${victor.variable} theme-${siteTheme}`} data-site-theme={siteTheme} suppressHydrationWarning>
      <head>
        <style href="lumos-layers" precedence="lumos-layers">{`@layer base, patterns, components, utilities;`}</style>
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <ScrollReveal />
        <GridOverlay />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var page=document.querySelector(".lumos-page");var r=document.documentElement;var themes=["theme-light","theme-dark","theme-brand"];var site=r.getAttribute("data-site-theme");var pageTheme=null;if(page){for(var i=0;i<themes.length;i++){if(page.classList.contains(themes[i]))pageTheme=themes[i]}}var next=pageTheme||(site?"theme-"+site:"");if(!next)return;for(var j=0;j<themes.length;j++)r.classList.remove(themes[j]);r.classList.add(next)})();`,
          }}
        />
      </body>
    </html>
  );
}
