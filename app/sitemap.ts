import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { supportedRoutes } from "@/data/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/contact",
    "/request-quote",
    ...Object.values(supportedRoutes).map((route) => route.path),
  ];
  return paths.map((path) => ({
    url: `${company.websiteUrl}${path === "/" ? "" : path}`,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/portfolio/") ? 0.6 : 0.8,
  }));
}
