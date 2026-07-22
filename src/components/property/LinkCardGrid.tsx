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

type LinkCardGridProps = {
  /** Optional small label above the heading. */
  eyebrow?: string;
  heading: string;
  items: LinkCardItem[];
  columns: 2 | 3 | 4;
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

// Derived from the column count rather than passed in per section. Wider cards
// (fewer columns) can carry a larger label.
const LABEL_CLASS: Record<2 | 3 | 4, string> = {
  2: "text-2xl md:text-[32px]",
  3: "text-xl md:text-[26px]",
  4: "text-lg md:text-[21px]",
};

/**
 * The image grid used three times on each About page (Villas/Stay, Discover,
 * Packages).
 *
 * **Card height is fixed, not derived from the image.** Earlier the crop was
 * driven by an `aspect-ratio` prop, which meant the card's height changed with
 * its width — a 2-up card came out far taller than a 4-up one, and portrait
 * source photos made the whole thing tower. Every card now shares one short,
 * fixed height (`h-[200px] md:h-[240px]`) and the photograph is cropped into it
 * with `object-cover`. So: every card in every grid is exactly the same height,
 * the frame is landscape (or square at worst — the 4-up on a phone), and a tall
 * portrait photo is cropped rather than allowed to stretch the card. The eye
 * lands on the label and the subject, not on a column of image.
 *
 * The mobile height (`h-44` = 176px) is a touch shorter than desktop so that
 * even the narrowest case — the 4-up packages at two columns on a 390px phone
 * (~167px wide) — stays roughly square rather than turning portrait.
 *
 * The label sits bottom-left over a bottom-weighted gradient, with a gold rule
 * that extends on hover — the top of the photo stays clean and full-strength.
 */
export function LinkCardGrid({
  eyebrow,
  heading,
  items,
  columns,
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
            <div className="group/card relative h-44 w-full overflow-hidden md:h-60">
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
                {/* The hover affordance — a gold rule that extends. */}
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
