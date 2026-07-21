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
 * pattern as HeroSlider: a local `useState` index and plain array indexing,
 * no carousel library. Seminyak has 3 testimonials and Ubud has 4 — the
 * component doesn't care, it just renders however many it's given.
 *
 * Redesign note: the arrows were bare chevrons floating beside the text with
 * no hit area to speak of, and the author line looked like more body copy.
 * Now the arrows are proper circular buttons that pick up the gold on hover,
 * the author is set as a small gold caption so it reads as an attribution
 * rather than another sentence, and the active dot stretches into a pill so
 * the current position is obvious at a glance.
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

  // Both arrows share this; kept in one place so they can't drift apart.
  const arrowClassName =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors duration-300 hover:border-primary hover:text-primary";

  return (
    <section className="px-5 py-24 text-center md:py-32">
      <Container className="flex flex-col items-center">
        <h2 className="font-heading text-[40px] font-extralight text-primary">
          What our guests are saying
        </h2>
        <span aria-hidden className="mt-5 block h-px w-16 bg-primary/70" />

        <div className="mt-12 flex w-full items-center justify-center gap-4 md:gap-8">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
            className={arrowClassName}
          >
            <ChevronIcon className="h-5 w-5 rotate-180" />
          </button>

          <div className="flex max-w-[640px] flex-col items-center">
            {/* Purely decorative quote mark — aria-hidden so screen readers
                don't announce a stray punctuation character before the quote. */}
            <span
              aria-hidden
              className="font-heading text-[64px] leading-none text-primary/25"
            >
              &ldquo;
            </span>

            <p className="-mt-3 text-2xl leading-[1.7] font-light text-text italic">
              {active.quote}
            </p>
            <p className="mt-6 text-sm tracking-[2px] text-primary uppercase">
              {active.author}
            </p>
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next testimonial"
            className={arrowClassName}
          >
            <ChevronIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-10 flex items-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.author}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-ink/25 hover:bg-ink/40"
              }`}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
