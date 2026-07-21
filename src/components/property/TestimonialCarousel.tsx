"use client";

import { useState } from "react";
import type { Testimonial } from "@/data/testimonials";
import { ChevronIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type TestimonialCarouselProps = {
  testimonials: Testimonial[];
};

/**
 * "What our guests are saying" — one quote at a time.
 *
 * This is the page's quiet moment, so it gets the opposite treatment to
 * everything around it: dark, centred, generously spaced, and the only
 * section on the site whose heading is not left-aligned. Social proof works
 * best when it is allowed to be still.
 *
 * Same dependency-free carousel pattern as PropertyHero — a local `useState`
 * index and plain array indexing, no carousel library. Seminyak has 3
 * testimonials and Ubud has 4; the component just renders however many it is
 * given.
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
    "flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 text-white transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-ink";

  return (
    <Section tone="ink" space="loose" innerClassName="flex flex-col items-center">
      <SectionHeading
        title="What our guests are saying"
        surface="dark"
        align="center"
      />

      {/* Re-keyed on the active index so each quote fades up as it arrives
          rather than swapping instantly. Capped at 800px: the quote is the
          longest single run of text on the page and needs a reading measure,
          not the full grid width. */}
      <div
        key={activeIndex}
        className="mt-10 flex max-w-[800px] animate-rise-in flex-col items-center text-center"
      >
        <p className="text-quote font-heading font-light text-white/90 italic">
          {active.quote}
        </p>
        <p className="text-eyebrow font-body mt-7 text-primary uppercase">
          {active.author}
        </p>
      </div>

      {/* Controls stay outside the re-keyed block so they don't re-animate on
          every change. Hidden entirely for a single testimonial. */}
      {testimonials.length > 1 ? (
        <div className="mt-10 flex items-center gap-6">
          <button
            type="button"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
            className={arrowClassName}
          >
            <ChevronIcon className="h-4 w-4 rotate-180" />
          </button>

          {/* No `gap`: the buttons' own horizontal padding both separates the
              marks and gives each one a real hit area — see the same treatment
              in PropertyHero. */}
          <div className="flex items-center">
            {testimonials.map((testimonial, index) => (
              <button
                key={testimonial.author}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
                className="group/rule flex items-center px-2 py-3.5"
              >
                <span
                  className={`block h-px transition-all duration-500 ease-out ${
                    index === activeIndex
                      ? "w-10 bg-primary"
                      : "w-5 bg-white/35 group-hover/rule:bg-white/70"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Next testimonial"
            className={arrowClassName}
          >
            <ChevronIcon className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </Section>
  );
}
