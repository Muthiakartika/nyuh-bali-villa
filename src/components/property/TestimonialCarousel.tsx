"use client";

import { useState } from "react";
import type { Testimonial } from "@/data/testimonials";
import { ChevronIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";

type TestimonialCarouselProps = {
  testimonials: Testimonial[];
};

/**
 * "What our guests are saying" — one quote visible at a time with
 * prev/next arrows and dot indicators. Same small dependency-free carousel
 * pattern as HeroSlider and the art-gallery project's Reviews.tsx: a local
 * `useState` index and plain array indexing, no carousel library. Seminyak
 * has 3 testimonials and Ubud has 4 — the component doesn't care, it just
 * renders however many `testimonials` it's given.
 */
export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  }

  return (
    // Container bounds the section to the shared 1080px; the quote keeps its
    // own max-w-[640px], which matches the live site's measured quote width.
    <section className="px-5 py-16 text-center">
      <Container className="flex flex-col items-center gap-8">
        <h2 className="font-heading text-[40px] font-extralight text-primary">
          What our guests are saying
        </h2>

        <div className="flex items-center gap-4">
          <button type="button" onClick={goToPrevious} aria-label="Previous testimonial">
            <ChevronIcon className="h-6 w-6 rotate-180 text-ink" />
          </button>

          <div className="flex max-w-[640px] flex-col gap-4">
            <p className="text-2xl leading-[1.6] font-light text-text italic">
              {active.quote}
            </p>
            <p className="text-xl font-medium text-text">{active.author}</p>
          </div>

          <button type="button" onClick={goToNext} aria-label="Next testimonial">
            <ChevronIcon className="h-6 w-6 text-ink" />
          </button>
        </div>

        <div className="flex gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.author}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`h-2 w-2 rounded-full ${index === activeIndex ? "bg-primary" : "bg-ink/30"}`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
