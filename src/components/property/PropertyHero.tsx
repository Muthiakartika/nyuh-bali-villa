"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ChevronIcon } from "@/components/ui/icons";

type PropertyHeroProps = {
  images: string[];
  alt: string;
  /** Small letter-spaced line above the property name. Uses the brand name,
   * which already exists on the site — no new copy is written for the hero. */
  eyebrow: string;
  /** The property name ("Seminyak" / "Ubud"), set at display scale. */
  title: string;
};

const SLIDE_INTERVAL_MS = 6000;

/**
 * The opening image band on both About pages.
 *
 * **The problem this replaces.** The old hero was a bare photograph with a
 * chevron on each edge and three dots at the bottom — no headline, no CTA, no
 * indication of where you'd landed. That is the visual signature of a 2010-era
 * WordPress slider plugin, and it wasted the only moment on the page where a
 * resort gets to make a first impression. It was also 30vh tall on a phone,
 * about 250px: a banner strip, not a hero.
 *
 * **What it does now.** The image runs behind a fixed, transparent header and
 * carries a typographic lockup anchored to the bottom-left — the brand name as
 * an eyebrow over the property name at display scale. Both strings already
 * exist on the site; nothing was written for this. The slow push-in
 * (`animate-kenburns`) and the 1200ms crossfade are the only motion, and the
 * controls have moved out of the middle of the picture into an understated
 * cluster in the corner.
 *
 * Controls and auto-advance are skipped entirely when there is only one image
 * — the live Ubud page genuinely has a single slide, and the old build still
 * rendered inert arrows and a lone dot for it.
 */
export function PropertyHero({ images, alt, eyebrow, title }: PropertyHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isPausedRef = useRef(false);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;

    // Someone who has asked their OS to reduce motion should not be handed a
    // carousel that moves on its own; they still get the arrows.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const timer = window.setInterval(() => {
      if (isPausedRef.current) return;
      setActiveIndex((current) => (current + 1) % images.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [hasMultiple, images.length]);

  function goToPrevious() {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function goToNext() {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }

  const controlClassName =
    "flex h-10 w-10 items-center justify-center border border-white/30 text-white transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-ink";

  return (
    <section
      // Mobile jumps from the old 30vh — a 250px banner strip — to 68vh.
      // `heroxl` (1125px) is kept from the original build, where it was
      // measured as the point the live hero grows one last step; see globals.css
      // for why it must be declared in rem. Capped at 80vh rather than a full
      // screen: a hero that fills the viewport pushes every piece of actual
      // information below the fold, and the booking card has to stay visible
      // where it overlaps the bottom edge.
      className="relative h-[68vh] min-h-[440px] w-full overflow-hidden md:h-[72vh] lg:h-[76vh] heroxl:h-[80vh]"
      onMouseEnter={() => {
        isPausedRef.current = true;
      }}
      onMouseLeave={() => {
        isPausedRef.current = false;
      }}
    >
      {images.map((src, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              isActive ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {/* `key` on the wrapper restarts the push-in each time a slide
                becomes active, so every slide gets the movement rather than
                only the first one ever seeing it. */}
            <div
              key={`${src}-${isActive}`}
              className={`relative h-full w-full ${isActive ? "animate-kenburns" : ""}`}
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
          </div>
        );
      })}

      {/* Top scrim: the header floats over this image with no background of
          its own until you scroll, so the logo and nav need something to sit
          against on a bright photograph. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent"
      />
      {/* Bottom scrim: weighted low and fading out well before the middle, so
          it lifts the type without greying out the photograph the way the old
          flat 35% wash did. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 px-5 pb-14 sm:px-8 md:pb-20">
        <Container className="flex items-end justify-between gap-8">
          <div>
            <span className="text-eyebrow font-body block text-primary uppercase">
              {eyebrow}
            </span>
            <h1 className="text-display font-heading mt-3.5 font-light text-white">
              {title}
            </h1>
            <span aria-hidden className="mt-5 block h-px w-20 bg-primary" />
          </div>

          {hasMultiple ? (
            <div className="hidden shrink-0 items-center gap-3 pb-2 md:flex">
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Previous slide"
                className={controlClassName}
              >
                <ChevronIcon className="h-4 w-4 rotate-180" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Next slide"
                className={controlClassName}
              >
                <ChevronIcon className="h-4 w-4" />
              </button>
            </div>
          ) : null}
        </Container>
      </div>

      {/* Progress rules rather than dots. A row of circles is the stock
          carousel-plugin tell; thin bars read as a measure of how far through
          a sequence you are. */}
      {hasMultiple ? (
        <div className="absolute inset-x-0 bottom-5 flex justify-center md:bottom-7">
          {images.map((src, index) => (
            // The visible mark is a hairline; the padding around it is what
            // makes the control tappable. `px-2 py-3.5` gives every indicator a
            // 28px-tall box at least 36px wide, comfortably past the 24px
            // minimum — the gap between marks now comes from this padding
            // rather than from a `gap` on the row, so the hit areas sit flush
            // and there is no dead strip between them.
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="group/rule flex items-center px-2 py-3.5"
            >
              <span
                className={`block h-px transition-all duration-500 ease-out ${
                  index === activeIndex
                    ? "w-12 bg-primary"
                    : "w-6 bg-white/45 group-hover/rule:bg-white"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
