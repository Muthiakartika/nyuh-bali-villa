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
const COLUMN_CLASS: Record<number, string> = {
  5: "grid-cols-5",
  8: "grid-cols-8",
};

/**
 * The row of trust/award badges near the bottom of every property page.
 * Seminyak lays them out as a static, full-width grid; Ubud scrolls them as
 * a marquee — see the `variant` prop.
 */
export function AwardsRow({ badges, variant = "grid" }: AwardsRowProps) {
  if (variant === "marquee") {
    // The badges are rendered twice back-to-back so the track can slide left
    // by exactly half its width and loop seamlessly (see --animate-marquee /
    // @keyframes marquee in globals.css). overflow-hidden on the Container
    // clips the scrolling track to the same centred content width as every
    // other section; the track itself is `w-max` so it can be wider than
    // that window and scroll through it.
    const loop = [...badges, ...badges];

    return (
      <div className="bg-ink px-5 py-10">
        <Container className="overflow-hidden">
          <div className="flex w-max animate-marquee">
            {loop.map((src, index) => (
              <div
                key={index}
                className="relative mx-8 h-[120px] w-[120px] shrink-0"
                // The second copy is a visual duplicate for the loop, so it's
                // hidden from assistive tech to avoid announcing every badge
                // twice.
                aria-hidden={index >= badges.length}
              >
                <Image
                  src={src}
                  alt="Award badge"
                  fill
                  sizes="120px"
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
  // scales down together on narrow screens, matching the live layout.
  const columnClass = COLUMN_CLASS[badges.length] ?? "grid-cols-4";

  return (
    <div className="bg-ink px-5 py-10">
      <Container className={`grid ${columnClass} items-center gap-2 md:gap-5`}>
        {badges.map((src) => (
          // aspect-square matches the source badges (all square), so each
          // cell fills its grid column and scales with the viewport;
          // object-contain keeps any non-square badge letterboxed, not
          // cropped.
          <div key={src} className="relative aspect-square">
            <Image
              src={src}
              alt="Award badge"
              fill
              sizes="(min-width: 768px) 200px, 100px"
              className="object-contain"
            />
          </div>
        ))}
      </Container>
    </div>
  );
}
