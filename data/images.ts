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

export const siteImages: SiteImage[] = [
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
  image(
    "/images/hse-mentorship.jpg",
    "Emerging safety professionals in a mentorship session",
    "Homepage",
  ),
  image(
    "/images/about/about-hero.jpg",
    "Dune Consulting safety professionals at work",
    "About",
  ),
  image(
    "/images/about/our-story.jpg",
    "Team collaborating on an HSE plan",
    "About",
  ),
  image(
    "/images/about/why-dune.jpg",
    "Safety professional reviewing site operations",
    "About",
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
  image(
    "/images/services/hse-training.jpg",
    "Workforce participating in practical HSE training",
    "HSE Training",
  ),
  image(
    "/images/services/personnel-outsourcing.jpg",
    "Deployed HSE professional supporting operations",
    "Personnel Outsourcing",
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
  ...Array.from({ length: 6 }, (_, index) =>
    image(
      `/images/projects/project-0${index + 1}.jpg` as SiteImage["pathname"],
      `Authorised project photograph ${index + 1}`,
      "Portfolio",
    ),
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
        `Authorised gallery photograph ${index + 1} for ${slug.replaceAll("-", " ")}`,
        "Project detail",
      ),
    ),
  ),
];

export function getSiteImage(pathname: string) {
  return siteImages.find((item) => item.pathname === pathname);
}
