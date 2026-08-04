export type SupportedRoute = {
  path: `/${string}`;
  title: string;
  description: string;
};

export const supportedRoutes = {
  about: {
    path: "/about",
    title: "About Dune Consulting | HSE Consultancy in Lagos",
    description:
      "Learn how Dune Consulting helps organisations protect people, manage HSE risk and build stronger safety cultures through practical professional services.",
  },
  services: {
    path: "/services",
    title: "HSE Services",
    description:
      "Explore event safety management, HSE Training, HSE Personnel Outsourcing and HSE Mentorship Program from Dune Consulting.",
  },
  "services/event-safety-management": {
    path: "/services/event-safety-management",
    title: "Event Safety Management",
    description:
      "End-to-end event safety planning, risk assessment and on-site coordination from Dune Consulting.",
  },
  "services/hse-training": {
    path: "/services/hse-training",
    title: "HSE Training",
    description:
      "Practical and customised workplace safety training to strengthen competence, emergency preparedness and confident response.",
  },
  "services/personnel-outsourcing": {
    path: "/services/personnel-outsourcing",
    title: "HSE Personnel Outsourcing",
    description:
      "Qualified HSE professionals for temporary and long-term event, project and operational assignments.",
  },
  portfolio: {
    path: "/portfolio",
    title: "Events and Projects",
    description:
      "View selected events and projects supported by Dune Consulting across Nigeria.",
  },
  mentorship: {
    path: "/mentorship",
    title: "HSE Mentorship Program",
    description:
      "Build practical safety skills through structured guidance, industry insight and career development support.",
  },
  insights: {
    path: "/insights",
    title: "HSE Insights",
    description:
      "Practical Health, Safety and Environment guidance from Dune Consulting.",
  },
  privacy: {
    path: "/privacy",
    title: "Privacy Policy",
    description: "Privacy information for the Dune Consulting website.",
  },
  terms: {
    path: "/terms",
    title: "Terms",
    description: "Terms for using the Dune Consulting website.",
  },
  "portfolio/jameson-distillery-on-tour": {
    path: "/portfolio/jameson-distillery-on-tour",
    title: "Jameson Distillery on Tour Lagos",
    description:
      "Dune Consulting provided event safety support for this approved portfolio engagement.",
  },
  "portfolio/moonshot-by-techcabal": {
    path: "/portfolio/moonshot-by-techcabal",
    title: "Moonshot by TechCabal",
    description:
      "Dune Consulting provided event safety support for this approved portfolio engagement.",
  },
  "portfolio/afc-staff-retreat": {
    path: "/portfolio/afc-staff-retreat",
    title: "Africa Finance Corporation Annual Staff Retreat 2026",
    description:
      "Dune Consulting provided event safety support for this approved portfolio engagement.",
  },
  "portfolio/aproko-nation-fiesta": {
    path: "/portfolio/aproko-nation-fiesta",
    title: "Aproko Nation Fiesta",
    description:
      "Dune Consulting provided event safety support for this approved portfolio engagement.",
  },
  "portfolio/martell-davido-launch": {
    path: "/portfolio/martell-davido-launch",
    title: "Martell x Davido Launch",
    description:
      "Dune Consulting provided event safety support for this approved portfolio engagement.",
  },
  "portfolio/zedcrest-launchpad": {
    path: "/portfolio/zedcrest-launchpad",
    title: "Zedcrest Launchpad 2.0",
    description:
      "Dune Consulting provided event safety support for this approved portfolio engagement.",
  },
} as const satisfies Record<string, SupportedRoute>;

export type SupportedRouteKey = keyof typeof supportedRoutes;

export function getSupportedRoute(slug: string[]): SupportedRoute | undefined {
  return supportedRoutes[slug.join("/") as SupportedRouteKey];
}
