import type { MetadataRoute } from "next";
import { company } from "@/data/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
    sitemap: `${company.websiteUrl}/sitemap.xml`,
    host: company.websiteUrl,
  };
}
