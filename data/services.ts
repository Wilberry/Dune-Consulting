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
      "End-to-end safety planning, risk assessment, coordination and on-site monitoring for professionally managed events.",
    href: "/services/event-safety-management",
    icon: ShieldCheck,
  },
  {
    title: "HSE Training",
    description:
      "Practical and customised workplace safety training designed to strengthen competence, emergency preparedness and confident response.",
    href: "/services/hse-training",
    icon: GraduationCap,
  },
  {
    title: "HSE Personnel Outsourcing",
    description:
      "Competent HSE professionals deployed to support projects, facilities, workplaces and events.",
    href: "/services/personnel-outsourcing",
    icon: Users,
  },
  {
    title: "HSE Mentorship Program",
    description:
      "Structured professional guidance for early-career HSE practitioners seeking stronger workplace confidence, judgement and career direction.",
    href: "/mentorship",
    icon: Compass,
  },
];
