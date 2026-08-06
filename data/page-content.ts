import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Compass,
  Eye,
  FileCheck2,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Lightbulb,
  Map,
  MessageSquareText,
  Radio,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound,
} from "lucide-react";

export type ContentFeature = { title: string; copy: string; icon: LucideIcon };
export type ServiceDetail = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  image: string;
  overview: string[];
  audiences: string[];
  benefits: ContentFeature[];
  features: string[];
  process: Array<{ title: string; copy: string }>;
  faqs: Array<{ question: string; answer: string }>;
  related: string[];
};

const sharedProcess = [
  {
    title: "Consult",
    copy: "We clarify your objectives, environment and operational requirements.",
  },
  {
    title: "Assess",
    copy: "We identify hazards, priorities and relevant compliance considerations.",
  },
  {
    title: "Plan",
    copy: "We define practical controls, responsibilities and communication lines.",
  },
  {
    title: "Deploy",
    copy: "We mobilise the right personnel, resources and documentation.",
  },
  {
    title: "Monitor",
    copy: "We remain responsive to changing conditions and emerging risks.",
  },
  {
    title: "Report",
    copy: "We document delivery, observations and clear next-step recommendations.",
  },
];

export const serviceDetails: Record<string, ServiceDetail> = {
  "event-safety-management": {
    slug: "event-safety-management",
    title: "Event Safety Management",
    eyebrow: "Safe events, confidently delivered",
    image: "/images/services/event-safety-management.jpg",
    summary:
      "End-to-end safety planning and live operational support for events of every format and scale.",
    overview: [
      "Successful events depend on safety decisions made long before guests arrive. Dune Consulting works alongside organisers, venues, production teams and suppliers to identify risk early and turn requirements into practical operating plans.",
      "From pre-event assessments to on-site supervision and post-event reporting, our approach protects people while preserving the intended audience experience.",
    ],
    audiences: [
      "Conference and exhibition organisers",
      "Concert and festival producers",
      "Brand activation teams",
      "Corporate event managers",
      "Venues and production partners",
      "Community and public-event organisers",
    ],
    benefits: [
      {
        title: "Stronger preparedness",
        copy: "Clear plans and responsibilities before event day.",
        icon: ClipboardCheck,
      },
      {
        title: "Coordinated response",
        copy: "Aligned safety, medical, fire and operational stakeholders.",
        icon: Radio,
      },
      {
        title: "Visible assurance",
        copy: "Active supervision and dynamic risk management on site.",
        icon: ShieldCheck,
      },
    ],
    features: [
      "Event safety plans and risk assessments",
      "Venue and site safety reviews",
      "Emergency and evacuation planning",
      "Directional and emergency signage",
      "Safety officer deployment",
      "Paramedic and ambulance coordination",
      "Fire equipment and personnel coordination",
      "On-site compliance monitoring",
      "Incident documentation and post-event reports",
    ],
    process: sharedProcess,
    faqs: [
      {
        question: "When should event safety planning begin?",
        answer:
          "As early as possible. Early involvement allows safety requirements to influence venue, production, supplier and audience-flow decisions before they become costly to change.",
      },
      {
        question: "Can Dune support only the event day?",
        answer:
          "Yes, subject to a review of existing plans. For the strongest outcome, we recommend including a pre-event assessment and briefing.",
      },
      {
        question: "Do you coordinate emergency resources?",
        answer:
          "Dune can coordinate appropriate medical, ambulance, fire and safety resources according to the event risk profile and approved plan.",
      },
    ],
    related: ["hse-training", "personnel-outsourcing"],
  },
  "hse-training": {
    slug: "hse-training",
    title: "HSE Training",
    eyebrow: "Learning designed for real work",
    image: "/images/dune_training_outdoor_high_quality.webp",
    summary:
      "Practical and customised workplace safety training designed to strengthen competence, emergency preparedness and confident response.",
    overview: [
      "Generic slides rarely change behaviour. Our training starts with the work people actually do, the decisions they make and the hazards they encounter.",
      "We translate safety expectations into clear, relevant learning experiences that help teams recognise risk, act responsibly and contribute to a stronger safety culture.",
    ],
    audiences: [
      "Operational workforces",
      "Supervisors and team leads",
      "Contractors and temporary staff",
      "Event and production crews",
      "New employee cohorts",
      "Managers with safety responsibilities",
    ],
    benefits: [
      {
        title: "Relevant learning",
        copy: "Content reflects your work environment and risk profile.",
        icon: Target,
      },
      {
        title: "Practical application",
        copy: "Activities connect knowledge to everyday decisions and actions.",
        icon: BookOpenCheck,
      },
      {
        title: "Clear accountability",
        copy: "Participants understand their role in safer operations.",
        icon: UserCheck,
      },
    ],
    features: [
      "Training-needs assessment",
      "Custom course design",
      "Induction and refresher training",
      "Emergency-response awareness",
      "Risk assessment workshops",
      "Supervisor safety development",
      "Event crew safety briefings",
      "Attendance and completion records",
      "Post-training recommendations",
    ],
    process: sharedProcess,
    faqs: [
      {
        question: "Can training be customised to our workplace?",
        answer:
          "Yes. Course scope, examples, exercises and delivery format can be aligned with your operations, workforce and identified risks.",
      },
      {
        question: "Do you offer on-site delivery?",
        answer:
          "Training can be delivered at an appropriate client venue or another agreed location, subject to the programme requirements.",
      },
      {
        question: "Will participants receive certificates?",
        answer:
          "Certificate arrangements depend on the approved course scope and must be agreed before delivery. We do not imply external accreditation where none has been confirmed.",
      },
    ],
    related: ["event-safety-management", "personnel-outsourcing"],
  },
  "personnel-outsourcing": {
    slug: "personnel-outsourcing",
    title: "HSE Personnel Outsourcing",
    eyebrow: "The right expertise, where you need it",
    image: "/images/container_crane.webp",
    summary:
      "Competent HSE professionals deployed to support projects, facilities, workplaces and events.",
    overview: [
      "The need for capable HSE support can change quickly. Dune Consulting helps organisations fill short-term, project-based and longer-term safety roles without compromising expectations.",
      "We focus on role clarity, appropriate experience, responsive communication and integration with the client team.",
    ],
    audiences: [
      "Event and production companies",
      "Project delivery teams",
      "Growing businesses",
      "Organisations covering temporary vacancies",
      "Companies with peak-period requirements",
      "Teams needing specialist HSE support",
    ],
    benefits: [
      {
        title: "Flexible capacity",
        copy: "Scale safety support around project and operational demand.",
        icon: Users,
      },
      {
        title: "Role alignment",
        copy: "Personnel are matched to defined responsibilities and environments.",
        icon: BriefcaseBusiness,
      },
      {
        title: "Managed support",
        copy: "Clear deployment expectations and communication throughout.",
        icon: Handshake,
      },
    ],
    features: [
      "Safety officers and supervisors",
      "Temporary HSE role coverage",
      "Project-based deployments",
      "Event safety personnel",
      "Compliance-monitoring support",
      "Site inspection and reporting",
      "Toolbox-talk facilitation",
      "Contractor safety coordination",
      "Longer-term personnel arrangements",
    ],
    process: sharedProcess,
    faqs: [
      {
        question: "Can personnel be deployed for a single event?",
        answer:
          "Yes. Assignments can range from a single event or shift to project-based and longer-term deployments.",
      },
      {
        question: "How do you match personnel to an assignment?",
        answer:
          "We consider the role scope, environment, schedule, risk profile and experience required before proposing personnel.",
      },
      {
        question: "Who manages deployed personnel?",
        answer:
          "Supervision and reporting lines are defined in the engagement scope so client and Dune responsibilities remain clear.",
      },
    ],
    related: ["event-safety-management", "hse-training"],
  },
};

export const values: ContentFeature[] = [
  {
    title: "People first",
    copy: "Every recommendation begins with protecting people and their wellbeing.",
    icon: HeartHandshake,
  },
  {
    title: "Practical judgement",
    copy: "We turn standards into controls that work in real environments.",
    icon: Lightbulb,
  },
  {
    title: "Accountability",
    copy: "We communicate clearly, document responsibly and own our commitments.",
    icon: BadgeCheck,
  },
  {
    title: "Partnership",
    copy: "We work alongside clients and delivery teams, not at a distance from them.",
    icon: UsersRound,
  },
];
export const industries: ContentFeature[] = [
  {
    title: "Events & entertainment",
    copy: "Concerts, festivals, conferences, launches and activations.",
    icon: Sparkles,
  },
  {
    title: "Corporate workplaces",
    copy: "Practical training and operational safety support for teams.",
    icon: Building2,
  },
  {
    title: "Projects & field operations",
    copy: "Flexible personnel and risk-management support.",
    icon: Map,
  },
  {
    title: "Professional development",
    copy: "Structured learning for emerging HSE practitioners.",
    icon: GraduationCap,
  },
];

export const mentorshipBenefits: ContentFeature[] = [
  {
    title: "Professional guidance",
    copy: "Learn how experienced practitioners approach decisions, communication and responsibility.",
    icon: Compass,
  },
  {
    title: "Practical perspective",
    copy: "Connect safety principles to events, workplaces and changing operational conditions.",
    icon: Eye,
  },
  {
    title: "Career direction",
    copy: "Build clarity around strengths, development priorities and professional next steps.",
    icon: TrendingUp,
  },
];

export const articles = [
  {
    slug: "planning-safer-events",
    title: "Planning Safer Events: What to Consider Before Production Begins",
    excerpt:
      "A practical look at the early decisions that shape crowd, emergency and operational safety.",
    category: "Event Safety",
    date: "Publication date pending",
    image: "/images/insights/article-01.jpg",
  },
  {
    slug: "building-practical-safety-culture",
    title: "Building a Practical Safety Culture Beyond the Checklist",
    excerpt:
      "How leaders can make safe behaviour part of everyday work rather than a compliance exercise.",
    category: "Safety Leadership",
    date: "Publication date pending",
    image: "/images/insights/article-02.jpg",
  },
  {
    slug: "choosing-hse-training",
    title: "Choosing HSE Training That Reflects Real Operational Risk",
    excerpt:
      "Questions to ask when developing relevant learning for employees and contractors.",
    category: "HSE Training",
    date: "Publication date pending",
    image: "/images/insights/article-03.jpg",
  },
  {
    slug: "event-emergency-coordination",
    title: "The Role of Emergency Coordination at Live Events",
    excerpt:
      "Why clear responsibilities and communication matter when conditions change quickly.",
    category: "Emergency Planning",
    date: "Publication date pending",
    image: "/images/insights/article-04.jpg",
  },
  {
    slug: "working-with-safety-personnel",
    title: "Getting the Best From Deployed Safety Personnel",
    excerpt:
      "A short guide to scopes, reporting lines and integration with operational teams.",
    category: "Personnel",
    date: "Publication date pending",
    image: "/images/insights/article-05.jpg",
  },
];

export const aboutApproach: ContentFeature[] = [
  {
    title: "Listen carefully",
    copy: "We begin with your environment, people, constraints and definition of success.",
    icon: MessageSquareText,
  },
  {
    title: "Prioritise clearly",
    copy: "We focus attention on meaningful risks and workable controls.",
    icon: Scale,
  },
  {
    title: "Deliver visibly",
    copy: "Plans translate into people, actions, supervision and records.",
    icon: CheckCircle2,
  },
  {
    title: "Improve continuously",
    copy: "Reporting creates a useful foundation for stronger future delivery.",
    icon: FileCheck2,
  },
];
