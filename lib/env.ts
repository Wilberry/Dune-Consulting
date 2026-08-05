const fallback = {
  siteUrl: "https://www.duneconsulting.example",
  phone: "+234 906 685 3199",
  email: "hello@duneconsulting.example",
  linkedinUrl: "https://www.linkedin.com/company/dunesafety-consulting/",
  instagramUrl: "https://www.instagram.com/",
} as const;

function clean(value: string | undefined, defaultValue: string) {
  return value?.trim() || defaultValue;
}

export const publicEnv = {
  siteUrl: clean(process.env.NEXT_PUBLIC_SITE_URL, fallback.siteUrl).replace(
    /\/$/,
    "",
  ),
  companyPhone: clean(process.env.NEXT_PUBLIC_COMPANY_PHONE, fallback.phone),
  companyEmail: clean(process.env.NEXT_PUBLIC_COMPANY_EMAIL, fallback.email),
  linkedinUrl: clean(
    process.env.NEXT_PUBLIC_LINKEDIN_URL,
    fallback.linkedinUrl,
  ),
  instagramUrl: clean(
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    fallback.instagramUrl,
  ),
  reviewMode: process.env.NEXT_PUBLIC_REVIEW_MODE === "true",
} as const;

export const deploymentEnv = {
  isVercelPreview: process.env.VERCEL_ENV === "preview",
  isVercelProduction: process.env.VERCEL_ENV === "production",
} as const;

export const publicEnvFallbacks = fallback;
