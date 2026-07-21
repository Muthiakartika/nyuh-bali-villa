"use client";

import { useState } from "react";
import type { Testimonial } from "@/data/testimonials";
import { ChevronIcon } from "@/components/ui/icons";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconButton } from "@/components/ui/Button";

type TestimonialCarouselProps = {
  testimonials: Testimonial[];
};

/**
 * "What our guests are saying" — one quote at a time.
 *
 * Sits on `{colors.surface}` so it reads as a distinct band without spending
 * another dark section, and the quote is set on a white card with the flat
 * hairline treatment DESIGN.md documents as elevation level 0.
 *
 * Same dependency-free carousel pattern as PropertyHero: a local index and
 * plain array access, no carousel library. Seminyak has 3 testimonials and Ubud
 * 4; the component just renders however many it is given.
 */
export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];
  const hasMultiple = testimonials.length > 1;

  function goToPrevious() {
    setActiveIndex((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  }

  function goToNext() {
    setActiveIndex((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  }

  return (
    <Section tone="surface" space="loose">
      <SectionHeading
        title="What our guests are saying"
        trailing={
          hasMultiple ? (
            <div className="flex items-center gap-2 md:justify-end">
              <IconButton label="Previous testimonial" onClick={goToPrevious}>
                <ChevronIcon className="h-4 w-4 rotate-180" />
              </IconButton>
              <IconButton label="Next testimonial" onClick={goToNext}>
                <ChevronIcon className="h-4 w-4" />
              </IconButton>
            </div>
          ) : undefined
        }
      />

      {/* Re-keyed on the active index so each quote fades up as it arrives
          rather than swapping instantly. */}
      <div
        key={activeIndex}
        className="mt-10 animate-rise-in rounded-[28px] border border-hairline-soft bg-canvas p-8 md:mt-14 md:p-12"
      >
        <p className="max-w-[46ch] text-h3 font-medium text-ink">{active.quote}</p>
        <p className="mt-7 text-body-sm text-steel">{active.author}</p>
      </div>

      {hasMultiple ? (
        <div className="mt-6 flex items-center gap-2">
          {testimonials.map((testimonial, index) => (
            // The visible mark is a hairline; the padding around it is what
            // makes the control tappable at all.
            <button
              key={testimonial.author}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className="flex items-center px-1.5 py-3"
            >
              <span
                className={`block h-1 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-8 bg-primary" : "w-4 bg-hairline-strong"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </Section>
  );
}
