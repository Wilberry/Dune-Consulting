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
  telephone: "+234 (0) 000 000 0000",
  telephoneHref: "+2340000000000",
  email: "hello@duneconsulting.example",
  websiteUrl: "https://www.duneconsulting.example",
  linkedinUrl: "https://www.linkedin.com/",
  instagramUrl: "https://www.instagram.com/",
};
