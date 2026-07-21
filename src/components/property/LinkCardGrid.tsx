import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type LinkCardItem = {
  label: string;
  href: string;
  imgSrc: string;
  /** Every grid on this site points at pages outside this project's
   * 7-page scope, so every item ends up inert — but the flag is per-item,
   * not a blanket assumption, for the same reason PropertyNavItem.inScope
   * is per-item. */
  inScope?: boolean;
};

type LinkCardGridProps = {
  heading: string;
  items: LinkCardItem[];
  columns: 2 | 3 | 4;
  /** Card label size in px, measured per section — not tied to column
   * count or image size. Seminyak's "Our Villas" cards use 28px labels,
   * its "Discover"/"Packages" cards use 18px, and *every* grid on Ubud's
   * page (Stay, Discover, Packages alike) uses 26px — three genuinely
   * different values with no shared pattern to derive one from another. */
  labelSize: 18 | 26 | 28;
  /** Image aspect ratio as a Tailwind arbitrary value. Defaults to "3/2",
   * which covers every grid except Seminyak's "Discover" section, which
   * measured closer to 347/250. */
  imageAspect?: "3/2" | "347/250";
  /**
   * Section background. Each About page stacks three of these grids in a
   * row; rendering all three on the same dark ink made that whole stretch of
   * the page read as one undifferentiated block. Alternating the middle one
   * to `light` gives the page rhythm. Defaults to "dark".
   */
  tone?: "dark" | "light";
};

// Tailwind's scanner needs each full class name to appear literally in the
// source somewhere — building "grid-cols-" + columns at runtime wouldn't
// get picked up, so column counts and label sizes are mapped through
// lookups instead.
const DESKTOP_COLUMNS: Record<2 | 3 | 4, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

// Each size steps down on small screens: at 2 columns a phone card is only
// ~165px wide, where a 26–28px label wraps badly across the photo.
const LABEL_TEXT_SIZE: Record<18 | 26 | 28, string> = {
  18: "text-base md:text-lg",
  26: "text-lg md:text-[26px]",
  28: "text-xl md:text-[28px]",
};

const IMAGE_ASPECT_CLASS: Record<"3/2" | "347/250", string> = {
  "3/2": "aspect-[3/2]",
  "347/250": "aspect-[347/250]",
};

/**
 * The dark image grid used repeatedly across both properties' About pages
 * (Villas/Stay, Discover, Packages) with a different column count, label
 * size, and item count each time — built once and reused with different
 * props instead of copy-pasted per section.
 *
 * Redesign note: the label used to sit *below* its photo as loose text, so
 * each card was two disconnected pieces and the rows read as a gallery of
 * unlabelled images with captions drifting underneath. The label now sits
 * **on** the image over a dark scrim, which makes each card a single object
 * and lets the whole tile respond to hover as one.
 */
export function LinkCardGrid({
  heading,
  items,
  columns,
  labelSize,
  imageAspect = "3/2",
  tone = "dark",
}: LinkCardGridProps) {
  const isSingleColumnOnMobile = labelSize === 28;
  const isLight = tone === "light";

  return (
    // Background stays full-bleed; Container caps the content at the
    // site-wide 1080px. Measured on the live site, every card grid (2, 3 and
    // 4 column alike) spans that full 1080px with 20px gaps — the old
    // `max-w-5xl` held it 56px narrower at 1024px.
    <section className={`px-5 py-16 md:py-28 ${isLight ? "bg-ink/5" : "bg-ink"}`}>
      <Container className="flex flex-col items-center">
        {/* Gold on the near-white `light` tone is too low-contrast at this
            size, so light sections take the dark `ink` heading and let the
            rule below carry the gold — the same pairing PromoBanner uses. */}
        <h2
          className={`font-heading text-[30px] font-light tracking-[1px] md:text-[40px] ${
            isLight ? "text-ink" : "text-primary"
          }`}
        >
          {heading}
        </h2>
        <span aria-hidden className="mt-6 block h-px w-16 bg-primary/70" />

        <div
          className={`mt-10 grid w-full gap-5 md:mt-16 ${
            isSingleColumnOnMobile ? "grid-cols-1" : "grid-cols-2"
          } ${DESKTOP_COLUMNS[columns]}`}
        >
          {items.map((item) => {
            // `group-hover:*` below only ever activates when a `.group`
            // ancestor exists — which only happens for the `<Link>` branch a
            // few lines down. That means this same JSX can be reused for the
            // non-clickable (`inScope: false`) branch too: the hover classes
            // are simply inert there, so an item that isn't a real link never
            // looks interactive on hover.
            const content = (
              <div
                className={`relative w-full overflow-hidden ${IMAGE_ASPECT_CLASS[imageAspect]}`}
              >
                <Image
                  src={item.imgSrc}
                  alt={item.label}
                  fill
                  sizes="(min-width: 640px) 350px, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />

                {/* Flat scrim (not a gradient) so the label stays legible on
                    any photo; it lifts on hover to brighten the image. Kept
                    light so the photography carries the section. */}
                <div className="absolute inset-0 bg-ink/40 transition-colors duration-500 group-hover:bg-ink/20" />

                {/* An inset gold hairline that fades in on hover. Inset
                    rather than flush to the edge so it reads as a considered
                    frame around the photo instead of a plain border, and
                    hover-only so a static grid stays quiet. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-3 border border-transparent transition-colors duration-500 group-hover:border-primary/60"
                />

                {/* Just the label, centred. The gold rule that used to sit
                    under every card was repeated 2–4 times per row and made
                    the grids busy; the section heading keeps its rule, the
                    cards stay quiet. */}
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                  <span
                    className={`font-heading font-light tracking-[1px] text-white ${LABEL_TEXT_SIZE[labelSize]}`}
                  >
                    {item.label}
                  </span>
                </div>
              </div>
            );

            return (
              <div key={item.label}>
                {item.inScope ? (
                  <Link href={item.href} className="group block">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
