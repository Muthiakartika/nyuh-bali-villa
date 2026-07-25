import Image from "next/image";
import { Container } from "@/components/ui/Container";

type AwardsRowProps = {
  /** Seminyak shows 5 badges; Ubud shows a different set of 8 — checked
   * each property's page directly rather than assuming they share one
   * fixed list. */
  badges: string[];
  /**
   * How the badges are laid out — the two properties genuinely differ on
   * the live site:
   *  - "grid" (Seminyak, the default): a static row of equal columns.
   *  - "marquee" (Ubud): a continuously-scrolling "logo slider".
   * Confirmed by inspecting each live page rather than assuming they share
   * one treatment.
   */
  variant?: "grid" | "marquee";
};

/*
 * The badge box is a SQUARE that hugs the mark, not a full grid column.
 *
 * This used to be an equal-column grid (`grid-cols-5`), which stretched every
 * cell to the full column width — 224px at the 1240px container — while the
 * badges themselves are square images (119×119) drawn with `object-contain`.
 * Measured: each badge rendered 68px wide inside a 224px cell, so **156px of
 * every cell was empty** and the row read as five small marks marooned in a
 * band of nothing.
 *
 * A flex row of square boxes fixes it: the box is the same size as the mark, so
 * there is no dead area *inside* it, and the space between badges becomes real
 * spacing that `justify-between` distributes. It also matches the marquee
 * variant, which was already square (and measured 0px blank).
 */

/**
 * The row of award badges that closes every property page.
 *
 * Deliberately kept on `ink` while most other bands moved to the warm sand
 * palette. These badge images come from the live site as third-party award
 * marks with transparent backgrounds, several of them light-on-transparent —
 * moving them onto a near-white surface risks some of them disappearing
 * entirely, and that can't be verified without eyes on a real browser. Sitting
 * on dark, directly above the dark footer, they also read as one quiet
 * credentials base to the page rather than as another separate slab.
 */
export function AwardsRow({ badges, variant = "grid" }: AwardsRowProps) {
  if (variant === "marquee") {
    // The badges are rendered twice back-to-back so the track can slide left
    // by exactly half its width and loop seamlessly (see --animate-marquee /
    // @keyframes marquee in globals.css). overflow-hidden on the Container
    // clips the scrolling track to the same centred content width as every
    // other section; the track itself is `w-max` so it can be wider than that
    // window and scroll through it.
    const loop = [...badges, ...badges];

    return (
      <div className="bg-ink px-5 pt-6 pb-5 sm:px-8 md:pt-8">
        <Container className="overflow-hidden">
          <div className="flex w-max animate-marquee">
            {loop.map((src, index) => (
              <div
                key={index}
                className="relative mx-6 h-[64px] w-[64px] shrink-0"
                // The second copy is a visual duplicate for the loop, so it's
                // hidden from assistive tech to avoid announcing every badge
                // twice.
                aria-hidden={index >= badges.length}
              >
                <Image
                  src={src}
                  alt="Award badge"
                  fill
                  sizes="110px"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  // Default: static row (Seminyak). Square boxes spread across the content
  // width — see the note above on why these are no longer grid columns.
  return (
    <div className="bg-ink px-5 pt-6 pb-5 sm:px-8 md:pt-8">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:justify-between sm:gap-x-4">
        {badges.map((src) => (
          // A square that matches the mark, capped short so the credentials
          // band stays a strip rather than growing as tall as a content
          // section. Held back and brought to full strength on hover — the
          // standard treatment for award marks, so they read as supporting
          // credentials rather than competing with the content above them.
          <div
            key={src}
            className="group/badge relative h-14 w-14 shrink-0 md:h-[68px] md:w-[68px]"
          >
            <Image
              src={src}
              alt="Award badge"
              fill
              sizes="68px"
              className="object-contain opacity-70 transition-opacity duration-500 group-hover/badge:opacity-100"
            />
          </div>
        ))}
      </Container>
    </div>
  );
}
