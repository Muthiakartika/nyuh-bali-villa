"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { IconButton } from "@/components/ui/Button";
import { ChevronIcon } from "@/components/ui/icons";

type PropertyHeroProps = {
  images: string[];
  alt: string;
  /** Small pill labels across the top of the headline. Real navigation labels
   * from this property, never invented tags. */
  chips?: string[];
  title: string;
  /**
   * Supporting paragraph set opposite the headline, as in the reference
   * composition where the two share a baseline at the foot of the image.
   *
   * Optional, and currently unused by both property pages: the reference has a
   * marketing sentence there, and Nyuh has no unused copy that would fit
   * without either duplicating the narrative below or being written from
   * scratch. The slot stays for when real copy exists.
   */
  description?: string;
};

const SLIDE_INTERVAL_MS = 6000;

/**
 * The opening image band on both About pages.
 *
 * Composition follows the DWELLA reference: full-bleed photograph, a row of
 * pill chips, the headline anchored bottom-left, and a supporting paragraph
 * sitting opposite it on the right. The booking search bar docks underneath.
 *
 * Type comes off the DESIGN.md ramp via `text-hero-fluid`, which interpolates
 * between two documented steps (36px → 80px) rather than inventing sizes in
 * between. Chips use `{rounded.full}`, per the badge geometry.
 */
export function PropertyHero({
  images,
  alt,
  chips = [],
  title,
  description,
}: PropertyHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isPausedRef = useRef(false);
  const hasMultiple = images.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;

    // Someone who has asked their OS to reduce motion should not be handed a
    // carousel that advances on its own; they still get the arrows.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (isPausedRef.current) return;
      setActiveIndex((current) => (current + 1) % images.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [hasMultiple, images.length]);

  function goToPrevious() {
    setActiveIndex((c) => (c === 0 ? images.length - 1 : c - 1));
  }

  function goToNext() {
    setActiveIndex((c) => (c === images.length - 1 ? 0 : c + 1));
  }

  return (
    <section
      // Capped at 80vh rather than a full screen: the search bar has to remain
      // visible where it docks against the bottom edge, and a hero that fills
      // the viewport pushes every piece of real information below the fold.
      className="relative flex h-[68vh] min-h-[440px] w-full items-end overflow-hidden md:h-[72vh] lg:h-[76vh] heroxl:h-[80vh]"
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
            {/* Re-keyed so the slow push-in restarts on each slide rather than
                only ever playing on the first. */}
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

      {/* Top scrim so the transparent header has something to sit against on a
          bright photograph; bottom scrim weighted low so it lifts the type
          without greying out the middle of the image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/70 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-primary/90 via-primary/45 to-transparent"
      />

      <div className="relative w-full px-5 pb-12 sm:px-8 md:pb-16">
        <Container>
          {chips.length > 0 ? (
            <div className="mb-7 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-caption font-medium text-on-dark backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-16">
            <h1 className="text-hero-fluid max-w-[16ch] font-medium text-on-dark">
              {title}
            </h1>

            <div className="flex shrink-0 items-end gap-6 md:pb-2">
              {description ? (
                <p className="max-w-[320px] text-body-sm text-on-dark-muted">
                  {description}
                </p>
              ) : null}

              {hasMultiple ? (
                <div className="hidden items-center gap-2 md:flex">
                  <IconButton label="Previous slide" onClick={goToPrevious}>
                    <ChevronIcon className="h-4 w-4 rotate-180" />
                  </IconButton>
                  <IconButton label="Next slide" onClick={goToNext}>
                    <ChevronIcon className="h-4 w-4" />
                  </IconButton>
                </div>
              ) : null}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
