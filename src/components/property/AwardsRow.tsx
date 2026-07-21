import Image from "next/image";
import { Container } from "@/components/ui/Container";

type AwardsRowProps = {
  /** Seminyak shows 5 badges; Ubud a different set of 8 — checked per property
   * rather than assuming they share one list. */
  badges: string[];
  /** The two properties genuinely differ on the live site: Seminyak lays the
   * badges out as a static row, Ubud scrolls them as a logo slider. */
  variant?: "grid" | "marquee";
};

// Tailwind only generates a `grid-cols-N` class if that exact string appears in
// the source, so the column count goes through a lookup rather than being built
// at runtime.
const COLUMN_CLASS: Record<number, string> = {
  5: "grid-cols-3 sm:grid-cols-5",
  8: "grid-cols-4 sm:grid-cols-8",
};

/**
 * The award badges that close every property page.
 *
 * Kept on the dark ground even though most bands moved to white canvas: these
 * are third-party award marks with transparent backgrounds, several of them
 * light-on-transparent, and moving them onto a near-white surface risks some
 * disappearing entirely — which cannot be verified without eyes on a real
 * browser. On dark, directly above the dark footer, they read as one quiet
 * credentials base rather than as another separate band.
 */
export function AwardsRow({ badges, variant = "grid" }: AwardsRowProps) {
  if (variant === "marquee") {
    // Rendered twice back-to-back so the track can slide by exactly -50% and
    // loop seamlessly; `overflow-hidden` clips it to the content width.
    const loop = [...badges, ...badges];

    return (
      <div className="bg-primary px-5 pt-12 pb-8 sm:px-8 md:pt-16">
        <Container className="overflow-hidden">
          <div className="flex w-max animate-marquee">
            {loop.map((src, index) => (
              <div
                key={index}
                className="relative mx-8 h-[100px] w-[100px] shrink-0"
                // The second copy is a visual duplicate, hidden from assistive
                // tech so every badge isn't announced twice.
                aria-hidden={index >= badges.length}
              >
                <Image src={src} alt="Award badge" fill sizes="100px" className="object-contain" />
              </div>
            ))}
          </div>
        </Container>
      </div>
    );
  }

  const columnClass = COLUMN_CLASS[badges.length] ?? "grid-cols-3 sm:grid-cols-4";

  return (
    <div className="bg-primary px-5 pt-12 pb-8 sm:px-8 md:pt-16">
      <Container className={`grid ${columnClass} items-center gap-4 md:gap-8`}>
        {badges.map((src) => (
          // Held back so they read as supporting credentials rather than
          // competing with the content above.
          <div key={src} className="relative aspect-square opacity-70">
            <Image
              src={src}
              alt="Award badge"
              fill
              sizes="(min-width: 768px) 150px, 100px"
              className="object-contain"
            />
          </div>
        ))}
      </Container>
    </div>
  );
}
