"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";

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
 * slides are navigated by a row of bullet indicators rather than arrows over
 * the photograph — tapping a bullet jumps to that slide.
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
    // carousel that moves on its own; they still get the bullet controls.
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
          </div>
        </Container>
      </div>

      {/*
        Bullet indicators, replacing the corner prev/next arrows. The dots ARE
        the navigation now — tapping one jumps to that slide, and the band
        auto-advances on its own — so the arrows were redundant clutter over the
        photograph. One centred row serves every breakpoint (a single set of
        controls in the DOM, not a duplicate per size), sitting clear of the
        bottom-left lockup. Each dot keeps a 24px-tall hit area via its padded
        button while the visible mark stays small: the active slide is a wider
        gold pill, the rest are muted dots that brighten on hover. Only rendered
        when there's more than one slide — Ubud has a single image and shows
        nothing.
      */}
      {hasMultiple ? (
        <div className="absolute inset-x-0 bottom-4 flex justify-center md:bottom-6">
          {images.map((src, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={src}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={isActive}
                className="group/dot flex items-center px-2.5 py-2.5"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ease-out ${
                    isActive
                      ? "w-5 bg-primary"
                      : "w-1.5 bg-white/50 group-hover/dot:bg-white"
                  }`}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
