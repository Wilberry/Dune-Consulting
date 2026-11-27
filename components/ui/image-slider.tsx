"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/slide1/ambulance_paramedic.webp",
    alt: "Ambulance paramedic and safety team preparing for an emergency response",
  },
  {
    src: "/images/slide1/IMG-20261115-WA0006.jpg.jpeg",
    alt: "HSE training session in progress",
  },
  {
    src: "/images/slide1/IMG-20261115-WA0009.jpg.jpeg",
    alt: "Participants taking part in practical HSE training",
  },
  {
    src: "/images/slide1/IMG-20261115-WA0014.jpg.jpeg",
    alt: "Dune Consulting team supporting a safety operation",
  },
  {
    src: "/images/slide1/IMG-20261115-WA0020.jpg.jpeg",
    alt: "Safety professionals collaborating during training",
  },
];

export function ImageSlider() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      role="region"
      aria-label="Our Story image gallery"
      aria-roledescription="carousel"
      className="relative h-full w-full overflow-hidden"
    >
      <div
        className="flex h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            role="group"
            aria-label={`${index + 1} of ${slides.length}`}
            aria-roledescription="slide"
            aria-hidden={index !== activeSlide}
            className="relative h-full min-w-full"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show image ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
            className={`size-2.5 rounded-full border border-white/80 transition-colors ${
              index === activeSlide ? "bg-amber" : "bg-white/50"
            }`}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
