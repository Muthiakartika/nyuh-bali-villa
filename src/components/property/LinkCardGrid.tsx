import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

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

type GridTone = "sand" | "sand-deep" | "ink";
type CardAspect = "portrait" | "tall" | "square";

type LinkCardGridProps = {
  /** Optional small label above the heading. */
  eyebrow?: string;
  heading: string;
  items: LinkCardItem[];
  columns: 2 | 3 | 4;
  /**
   * Crop shape. Portrait crops are the default because a resort's rooms,
   * gardens and spa read far better standing up than letterboxed — the old
   * design used 3/2 landscape everywhere, which is the shape of a stock photo
   * grid, not of a property portfolio.
   */
  aspect?: CardAspect;
  tone?: GridTone;
};

// Tailwind's scanner needs each full class name to appear literally in the
// source somewhere — building "grid-cols-" + columns at runtime wouldn't get
// picked up, so these go through lookups instead.
const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

/*
 * Every crop is landscape on a phone and portrait from `sm` up. That isn't a
 * cosmetic tweak: three stacked portrait cards on a 390px screen is roughly
 * 1,500px of scrolling for one section, whereas the same three as wide
 * landscape strips read as a list you can take in. Responsive art direction,
 * not just a responsive grid.
 */
const ASPECT_CLASS: Record<CardAspect, string> = {
  portrait: "aspect-[3/2] sm:aspect-[4/5]",
  tall: "aspect-[3/2] sm:aspect-[3/4]",
  square: "aspect-[4/3] sm:aspect-square",
};

// Derived from the column count rather than passed in per section. The old
// component took an explicit `labelSize` of 18, 26 or 28 measured off the live
// site, which meant three arbitrary values with no relationship to each other;
// tying the label to how much room the card actually has is a system.
const LABEL_CLASS: Record<2 | 3 | 4, string> = {
  2: "text-2xl md:text-[32px]",
  3: "text-xl md:text-[26px]",
  4: "text-lg md:text-[21px]",
};

/**
 * The image grid used three times on each About page (Villas/Stay, Discover,
 * Packages).
 *
 * **What changed and why.** Each card used to be a photograph under a flat
 * `ink/35` wash with its label floating dead centre and a white hairline
 * inset like a certificate frame. Three problems: the wash permanently dulled
 * the photography, which is the actual product; a centred label sits directly
 * on top of whatever the photo is of; and nine cards across three sections all
 * received the identical treatment, so the middle of the page read as one long
 * undifferentiated texture.
 *
 * Now the scrim is a gradient weighted to the bottom third, so the top of every
 * image stays clean and full-strength. The label is anchored bottom-left over
 * the darkest part of that gradient, with a gold rule that extends on hover.
 * The frame is gone. Sections differentiate themselves through column count and
 * crop shape instead of repeating one card at three sizes.
 */
export function LinkCardGrid({
  eyebrow,
  heading,
  items,
  columns,
  aspect = "portrait",
  tone = "sand",
}: LinkCardGridProps) {
  const isDark = tone === "ink";

  return (
    <Section tone={tone}>
      <SectionHeading
        eyebrow={eyebrow}
        title={heading}
        surface={isDark ? "dark" : "light"}
      />

      <div
        className={`mt-8 grid gap-4 md:mt-10 md:gap-5 ${COLUMN_CLASS[columns]}`}
      >
        {items.map((item, index) => {
          // `group/card` is declared on the tile itself rather than on a
          // wrapping <Link>. That matters: every item on this site is
          // currently `inScope: false`, so the cards render as plain divs — a
          // plain `group-hover:` keyed to a link ancestor never fires and the
          // entire grid sits visually inert. A named group scoped to the tile
          // works whether or not the card is a link.
          const content = (
            <div
              className={`group/card relative w-full overflow-hidden ${ASPECT_CLASS[aspect]}`}
            >
              <Image
                src={item.imgSrc}
                alt={item.label}
                fill
                sizes="(min-width: 1280px) 300px, (min-width: 640px) 33vw, 100vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.05]"
              />

              {/* Bottom-weighted gradient: enough contrast under the label to
                  keep it legible on any photograph, while the upper two-thirds
                  of the image stays untouched. */}
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition-opacity duration-700 group-hover/card:opacity-90"
              />

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <span
                  className={`font-heading block font-light text-white ${LABEL_CLASS[columns]}`}
                >
                  {item.label}
                </span>
                {/* The hover affordance. It replaces the gold rule the old
                    design printed under every single card — repeated 2–4 times
                    per row, it made the grids busy; as a hover state it does
                    real work instead. */}
                <span
                  aria-hidden
                  className="mt-3 block h-px w-9 bg-primary transition-all duration-500 ease-out group-hover/card:w-20"
                />
              </div>
            </div>
          );

          // Staggered by index so a row arrives left-to-right rather than all
          // at once — the small detail that makes a grid feel composed instead
          // of simply switched on.
          return (
            <Reveal key={item.label} delay={index * 90}>
              {item.inScope ? (
                <Link href={item.href} className="block">
                  {content}
                </Link>
              ) : (
                content
              )}
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
