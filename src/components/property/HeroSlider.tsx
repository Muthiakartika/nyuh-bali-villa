"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronIcon } from "@/components/ui/icons";

type HeroSliderProps = {
  images: string[];
  alt: string;
};

/**
 * The full-width photo slider at the top of every About page. A small,
 * dependency-free carousel — local `useState` for the active index, plain
 * prev/next handlers, dot indicators — the same pattern already used by the
 * art-gallery project's Reviews carousel, rather than pulling in a carousel
 * library for something this simple.
 *
 * All three slide images render at once, stacked with `absolute inset-0`,
 * and only the active one is visible (`opacity-100` vs `opacity-0`). That's
 * what makes the fade transition between slides free via a CSS
 * `transition-opacity` instead of needing to mount/unmount images.
 */
export function HeroSlider({ images, alt }: HeroSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }

  return (
    // Height is a percentage of the *viewport's* height (vh), not a fixed
    // pixel value — confirmed on the live site by resizing the browser and
    // re-measuring at many widths. It turned out to be four tiers, not
    // three: 30vh below 768px, 50vh from 768–1023px, 70vh from
    // 1024–1124px, and 80vh from 1125px up. `heroxl` is that last cutoff —
    // see its definition in globals.css for why it has to be a registered
    // breakpoint rather than an arbitrary `min-[1125px]` variant here.
    <div className="relative h-[30vh] w-full overflow-hidden md:h-[50vh] lg:h-[70vh] heroxl:h-[80vh]">
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={goToPrevious}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-white"
      >
        <ChevronIcon className="h-6 w-6 rotate-180" />
      </button>
      <button
        type="button"
        onClick={goToNext}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-white"
      >
        <ChevronIcon className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 w-2 rounded-full ${index === activeIndex ? "bg-primary" : "bg-white/60"}`}
          />
        ))}
      </div>
    </div>
  );
}
