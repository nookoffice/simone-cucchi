import type { MetadataRoute } from "next";
import { SITE_URL } from "@/consts";
import { isNoindexRoute } from "@/utils/seo";

const routes = ["/", "/style-guide", "/example-components"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes
    .filter((path) => !isNoindexRoute(path))
    .map((path) => ({ url: new URL(path, SITE_URL).href }));
}
