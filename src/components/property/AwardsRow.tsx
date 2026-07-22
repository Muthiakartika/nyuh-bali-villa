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

// Tailwind's scanner only generates a `grid-cols-N` class if that exact
// string appears literally in the source, so the column count (which equals
// the number of badges) is mapped through this lookup instead of being built
// at runtime like `grid-cols-${n}` (which would never get generated).
// Squeezing all 5 (or 8) badges into one row on a phone left them ~64px
// wide, too small to read the award text on. Below `sm` they wrap onto
// fewer, larger columns instead.
const COLUMN_CLASS: Record<number, string> = {
  5: "grid-cols-3 sm:grid-cols-5",
  8: "grid-cols-4 sm:grid-cols-8",
};

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

  // Default: static grid (Seminyak). Equal columns span the full content
  // width so the badges are distributed edge to edge in a single row that
  // scales down together on narrow screens.
  const columnClass = COLUMN_CLASS[badges.length] ?? "grid-cols-3 sm:grid-cols-4";

  return (
    <div className="bg-ink px-5 pt-6 pb-5 sm:px-8 md:pt-8">
      <Container className={`grid ${columnClass} items-center gap-4 md:gap-6`}>
        {badges.map((src) => (
          // Capped to a short, fixed height (`h-16 md:h-20`) rather than a
          // full-column `aspect-square`, which stretched each badge to ~200px
          // tall on desktop and made the credentials band as tall as a content
          // section. `object-contain` centres each square mark within that
          // shorter box, so they stay readable but compact.
          //
          // Held back and brought to full strength on hover — the standard
          // treatment for a row of award marks, so they read as supporting
          // credentials rather than competing with the content above them.
          <div key={src} className="group/badge relative h-14 md:h-[68px]">
            <Image
              src={src}
              alt="Award badge"
              fill
              sizes="(min-width: 768px) 120px, 96px"
              className="object-contain opacity-70 transition-opacity duration-500 group-hover/badge:opacity-100"
            />
          </div>
        ))}
      </Container>
    </div>
  );
}
