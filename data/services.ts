import type { LucideIcon } from "lucide-react";
import { Compass, GraduationCap, ShieldCheck, Users } from "lucide-react";

export type Service = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const services: Service[] = [
  {
    title: "Event Safety Management",
    description:
      "Comprehensive safety planning and on-site coordination for conferences, concerts, festivals, launches and corporate gatherings.",
    href: "/services/event-safety-management",
    icon: ShieldCheck,
  },
  {
    title: "Tailored HSE Training",
    description:
      "Practical, industry-relevant training designed around your workforce, operational risks and compliance requirements.",
    href: "/services/hse-training",
    icon: GraduationCap,
  },
  {
    title: "HSE Personnel Outsourcing",
    description:
      "Qualified safety professionals deployed to support events, projects and business operations on temporary or long-term assignments.",
    href: "/services/personnel-outsourcing",
    icon: Users,
  },
  {
    title: "HSE Mentorship Programme",
    description:
      "Structured guidance, practical exposure and career development for emerging Health, Safety and Environment professionals.",
    href: "/mentorship",
    icon: Compass,
  },
];
