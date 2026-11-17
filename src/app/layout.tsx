import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/consts";
import GridOverlay from "@/components/global/GridOverlay";
import SmoothScroll from "@/components/SmoothScroll";
import { getSiteTheme } from "@/prismic/theme";
import "@/styles/global.css";

const inter = localFont({
  src: "../assets/fonts/inter-regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-inter",
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
    <html lang="en" className={`${inter.variable} theme-${siteTheme}`} data-site-theme={siteTheme} suppressHydrationWarning>
      <head>
        <style href="lumos-layers" precedence="lumos-layers">{`@layer base, patterns, components, utilities;`}</style>
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
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
