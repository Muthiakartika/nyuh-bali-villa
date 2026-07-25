"use client";

import Image from "next/image";
import { useState } from "react";

type ImageGalleryProps = {
  images: string[];
  /** One alt string for the whole set — every slide shows the same subject
   * (a room, a tour stop), so per-image alt text would just repeat it. */
  alt: string;
  /** Height utilities for the frame. Defaults to the card height used by
   * `LinkCardGrid` so galleries sitting in a grid line up with plain cards. */
  heightClassName?: string;
  /** Passed to `next/image` so each usage can declare its real rendered width
   * instead of every gallery on the site claiming `100vw`. */
  sizes?: string;
  /** First gallery on a page can preload its opening frame. */
  priority?: boolean;
};

/**
 * A small multi-photo frame, shared by every page that shows a set of images
 * for one thing: each room on the Villas/Stay pages, each tour on Explore Bali,
 * the dining venues and the spa.
 *
 * It deliberately reuses the two conventions the site already established
 * rather than inventing a third:
 *
 *  - **Navigation is gold bullet indicators**, exactly like `PropertyHero` — no
 *    arrows over the photograph — and they disappear entirely when there is
 *    only one image, so a single-photo item shows no inert controls.
 *  - **The frame is a fixed height and the photo is cropped into it** with
 *    `object-cover`, the same rule as `LinkCardGrid`. Source photos here are a
 *    mix of landscape and portrait; letting the image set the height would make
 *    neighbouring cards in the same row disagree.
 *
 * A Client Component only because of the `useState` index — same
 * dependency-free carousel pattern as the hero and the testimonial, no library.
 */
export function ImageGallery({
  images,
  alt,
  heightClassName = "h-56 md:h-64",
  sizes = "(min-width: 1024px) 600px, 100vw",
  priority = false,
}: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;

  return (
    <div
      className={`group/gallery relative w-full overflow-hidden ${heightClassName}`}
    >
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${
            index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[900ms] ease-out group-hover/gallery:scale-[1.05]"
            priority={priority && index === 0}
          />
        </div>
      ))}

      {hasMultiple ? (
        <>
          {/* The scrim exists only to keep the indicators legible, so it is
              bottom-weighted and shallow — the photograph itself stays clean,
              the same treatment the hero and the cards use. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink/70 to-transparent"
          />

          <div className="absolute inset-x-0 bottom-1 flex justify-center">
            {images.map((src, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${alt} photo ${index + 1}`}
                  aria-current={isActive}
                  className="group/dot flex items-center px-2 py-2.5"
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
        </>
      ) : null}
    </div>
  );
}
