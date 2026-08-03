export type NavigationItem = { label: string; href: string };

export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "HSE Mentorship", href: "/mentorship" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const serviceNavigation: NavigationItem[] = [
  {
    label: "Event Safety Management",
    href: "/services/event-safety-management",
  },
  { label: "Tailored HSE Training", href: "/services/hse-training" },
  {
    label: "HSE Personnel Outsourcing",
    href: "/services/personnel-outsourcing",
  },
];
