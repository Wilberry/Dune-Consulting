import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { deploymentEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  if (deploymentEnv.isVercelPreview)
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] },
    sitemap: `${company.websiteUrl}/sitemap.xml`,
    host: company.websiteUrl,
  };
}
