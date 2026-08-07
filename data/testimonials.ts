export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  image?: string;
  rating: number;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "The Dune HSE Mentorship Program gave me the confidence to apply safety decisions in real event and workplace environments. The coaching was practical, direct and easy to follow.",
    name: "Amina Yusuf",
    role: "HSE Graduate",
    image: "/images/executive_portrait.webp",
    rating: 5,
  },
  {
    quote:
      "Dune Consulting’s team helped us deliver a large conference with clarity and calm. Their event safety planning and on-site communication made the whole delivery far more reliable.",
    name: "Michael Ade",
    role: "Event Operations Manager",
    image: "/images/Hero.webp",
    rating: 5,
  },
  {
    quote:
      "Their practical training sessions were directly relevant to our crew and made immediate improvements to how we manage site risk and communicate expectations.",
    name: "Adaeze Okoro",
    role: "Safety Supervisor",
    image: "/images/dune_training_outdoor_high_quality.webp",
    rating: 4,
  },
];
