import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dune Consulting",
    short_name: "Dune",
    description:
      "Practical Health, Safety and Environment solutions for events, workplaces and projects.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F8FA",
    theme_color: "#10233F",
    icons: [{ src: "/images/mainlogo.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
