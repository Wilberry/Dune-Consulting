export type NavigationItem = { label: string; href: string };

export const navigation: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const serviceNavigation: NavigationItem[] = [
  {
    label: "Event Safety Management",
    href: "/services/event-safety-management",
  },
  { label: "HSE Training", href: "/services/hse-training" },
  {
    label: "HSE Personnel Outsourcing",
    href: "/services/personnel-outsourcing",
  },
];
