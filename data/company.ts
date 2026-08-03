export type CompanyDetails = {
  name: string;
  location: string;
  addressLocality: string;
  addressCountry: string;
  telephone: string;
  telephoneHref: string;
  email: string;
  websiteUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
};

export const company: CompanyDetails = {
  name: "Dune Consulting",
  location: "Lagos, Nigeria",
  addressLocality: "Lagos",
  addressCountry: "NG",
  telephone: publicEnv.companyPhone,
  telephoneHref: publicEnv.companyPhone.replace(/[^+\d]/g, ""),
  email: publicEnv.companyEmail,
  websiteUrl: publicEnv.siteUrl,
  linkedinUrl: publicEnv.linkedinUrl,
  instagramUrl: publicEnv.instagramUrl,
};
import { publicEnv } from "@/lib/env";
