export type SupportedRoute = {
  path: `/${string}`;
  title: string;
  description: string;
};

export const supportedRoutes = {
  about: {
    path: "/about",
    title: "About Dune Consulting",
    description:
      "Learn about Dune Consulting and our practical approach to Health, Safety and Environment risk management.",
  },
  services: {
    path: "/services",
    title: "HSE Services",
    description:
      "Explore event safety management, tailored HSE training and safety personnel outsourcing from Dune Consulting.",
  },
  "services/event-safety-management": {
    path: "/services/event-safety-management",
    title: "Event Safety Management",
    description:
      "Practical event safety planning, personnel coordination, supervision and reporting from Dune Consulting.",
  },
  "services/hse-training": {
    path: "/services/hse-training",
    title: "Tailored HSE Training",
    description:
      "Practical HSE training designed around workforce risks, operations and compliance requirements.",
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
    title: "HSE Mentorship Programme",
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
} as const satisfies Record<string, SupportedRoute>;

export type SupportedRouteKey = keyof typeof supportedRoutes;

export function getSupportedRoute(slug: string[]): SupportedRoute | undefined {
  return supportedRoutes[slug.join("/") as SupportedRouteKey];
}
