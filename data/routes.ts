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
  "portfolio/jameson-distillery-on-tour": {
    path: "/portfolio/jameson-distillery-on-tour",
    title: "Jameson Distillery on Tour",
    description:
      "Selected event safety project from Dune Consulting. Project details are subject to client approval.",
  },
  "portfolio/moonshot-by-techcabal": {
    path: "/portfolio/moonshot-by-techcabal",
    title: "Moonshot by TechCabal",
    description:
      "Selected event safety project from Dune Consulting. Project details are subject to client approval.",
  },
  "portfolio/afc-staff-retreat": {
    path: "/portfolio/afc-staff-retreat",
    title: "Africa Finance Corporation Staff Retreat",
    description:
      "Selected event safety project from Dune Consulting. Project details are subject to client approval.",
  },
  "portfolio/aproko-nation-fiesta": {
    path: "/portfolio/aproko-nation-fiesta",
    title: "Aproko Nation Fiesta",
    description:
      "Selected event safety project from Dune Consulting. Project details are subject to client approval.",
  },
  "portfolio/martell-davido-launch": {
    path: "/portfolio/martell-davido-launch",
    title: "Martell × Davido Launch",
    description:
      "Selected event safety project from Dune Consulting. Project details are subject to client approval.",
  },
  "portfolio/zedcrest-launchpad": {
    path: "/portfolio/zedcrest-launchpad",
    title: "Zedcrest Launchpad",
    description:
      "Selected event safety project from Dune Consulting. Project details are subject to client approval.",
  },
} as const satisfies Record<string, SupportedRoute>;

export type SupportedRouteKey = keyof typeof supportedRoutes;

export function getSupportedRoute(slug: string[]): SupportedRoute | undefined {
  return supportedRoutes[slug.join("/") as SupportedRouteKey];
}
