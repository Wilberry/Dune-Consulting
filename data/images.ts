export type ImageStatus = "placeholder" | "approved";
export type SiteImage = {
  pathname: `/images/${string}`;
  alt: string;
  page: string;
  recommendedDimensions: `${number}×${number}px`;
  aspectRatio: string;
  status: ImageStatus;
};

const image = (
  pathname: SiteImage["pathname"],
  alt: string,
  page: string,
  recommendedDimensions: SiteImage["recommendedDimensions"] = "1600×1200px",
  aspectRatio = "4:3",
): SiteImage => ({
  pathname,
  alt,
  page,
  recommendedDimensions,
  aspectRatio,
  status: "placeholder",
});

const approvedImage = (
  pathname: SiteImage["pathname"],
  alt: string,
  page: string,
  recommendedDimensions: SiteImage["recommendedDimensions"] = "1600×1200px",
  aspectRatio = "4:3",
): SiteImage => ({
  pathname,
  alt,
  page,
  recommendedDimensions,
  aspectRatio,
  status: "approved",
});

export const siteImages: SiteImage[] = [
  approvedImage(
    "/images/Hero.webp",
    "Dune Consulting safety personnel supporting a live event",
    "Homepage",
    "1448×1086px",
    "4:3",
  ),
  approvedImage(
    "/images/Practical_Safety.webp",
    "A facilitator leading a practical Dune Consulting HSE training session",
    "Homepage",
    "1536×1024px",
    "3:2",
  ),
  approvedImage(
    "/images/mainlogo.svg",
    "Dune Consulting main logo",
    "Global",
    "1000×760px",
    "25:19",
  ),
  approvedImage(
    "/images/logo2.svg",
    "Dune Consulting footer logo",
    "Global",
    "1000×760px",
    "25:19",
  ),
  approvedImage(
    "/images/executive_portrait.webp",
    "Portrait of the Lead Consultant, Anthony Igbinosun",
    "About",
    "1130×1392px",
    "1130:1392",
  ),
  image(
    "/images/hero-event-safety.jpg",
    "Safety personnel supporting a live event",
    "Homepage",
    "1600×1200px",
  ),
  image(
    "/images/hse-training-session.jpg",
    "Facilitator leading a practical HSE training session",
    "Homepage",
  ),
  approvedImage(
    "/images/first_aid_training.webp",
    "First aid and mentorship training in progress",
    "Homepage",
    "1536×1024px",
    "3:2",
  ),
  approvedImage(
    "/images/dune_team_high_quality.webp",
    "Dune Consulting safety professionals at work",
    "About",
    "1536×1152px",
    "4:3",
  ),
  approvedImage(
    "/images/ambulance_paramedic.webp",
    "Ambulance paramedic and safety team preparing for an emergency response",
    "About",
    "1448×1086px",
    "4:3",
  ),
  approvedImage(
    "/images/dune_training_outdoor_high_quality.webp",
    "Outdoor training session with Dune Consulting safety personnel",
    "About",
    "1535×1025px",
    "3:2",
  ),
  image(
    "/images/services/services-hero.jpg",
    "HSE planning and operational support",
    "Services",
  ),
  image(
    "/images/services/event-safety-management.jpg",
    "Event safety personnel coordinating on site",
    "Event Safety Management",
  ),
  approvedImage(
    "/images/dune_training_outdoor_high_quality.webp",
    "Workforce participating in practical HSE training",
    "HSE Training",
    "1535×1025px",
    "3:2",
  ),
  approvedImage(
    "/images/container_crane.webp",
    "Container crane and HSE personnel on site",
    "Personnel Outsourcing",
    "1448×1086px",
    "4:3",
  ),
  image(
    "/images/mentorship/mentorship-hero.jpg",
    "Emerging HSE practitioners learning together",
    "Mentorship",
  ),
  image(
    "/images/mentorship/who-should-apply.jpg",
    "Early-career safety professionals in discussion",
    "Mentorship",
  ),
  image(
    "/images/portfolio/portfolio-hero.jpg",
    "Dune Consulting event safety project",
    "Portfolio",
  ),
  approvedImage(
    "/images/portfolio/jameson-distillery-tour.jpg",
    "Jameson Distillery on Tour Lagos event artwork",
    "Portfolio",
    "1024×768px",
    "4:3",
  ),
  approvedImage(
    "/images/portfolio/moonshot-techcabal.jpg",
    "Moonshot by TechCabal event artwork",
    "Portfolio",
    "800×1000px",
    "4:5",
  ),
  approvedImage(
    "/images/portfolio/afc-staff-retreat-2026.jpg",
    "Africa Finance Corporation Annual Staff Retreat 2026 artwork",
    "Portfolio",
    "630×412px",
    "~1.53:1",
  ),
  approvedImage(
    "/images/portfolio/aproko-nation-fiesta.jpg",
    "Aproko Nation Fiesta event artwork",
    "Portfolio",
    "1024×1280px",
    "4:5",
  ),
  approvedImage(
    "/images/portfolio/martell-davido-launch.jpg",
    "Martell x Davido Launch event artwork",
    "Portfolio",
    "1920×1080px",
    "16:9",
  ),
  approvedImage(
    "/images/portfolio/zedcrest-launchpad-2.jpg",
    "Zedcrest Launchpad 2.0 event artwork",
    "Portfolio",
    "1080×1350px",
    "4:5",
  ),
  approvedImage(
    "/images/training_room.webp",
    "Training room set up for practical HSE instruction and exercises",
    "Assets",
    "1752×898px",
    "~1.95:1",
  ),
  image(
    "/images/insights/insights-hero.jpg",
    "HSE professional reviewing safety information",
    "Insights",
    "1600×900px",
    "16:9",
  ),
  ...Array.from({ length: 5 }, (_, index) =>
    image(
      `/images/insights/article-0${index + 1}.jpg` as SiteImage["pathname"],
      `Editorial image for HSE insight ${index + 1}`,
      "Insights",
      "1600×1000px",
      "16:10",
    ),
  ),
  ...[
    "jameson-distillery-on-tour",
    "moonshot-by-techcabal",
    "afc-staff-retreat",
    "aproko-nation-fiesta",
    "martell-davido-launch",
    "zedcrest-launchpad",
  ].flatMap((slug) =>
    Array.from({ length: 3 }, (_, index) =>
      image(
        `/images/projects/${slug}-${index + 1}.jpg` as SiteImage["pathname"],
        `Project gallery image ${index + 1} showing ${slug.replaceAll("-", " ")}. Useful for project overview and event context.`,
        "Project detail",
      ),
    ),
  ),
];

export function getSiteImage(pathname: string) {
  return siteImages.find((item) => item.pathname === pathname);
}
