import Image from "next/image";
import Link from "next/link";

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

const LABEL_TEXT_SIZE: Record<18 | 26 | 28, string> = {
  18: "text-lg",
  26: "text-[26px]",
  28: "text-[28px]",
};

const IMAGE_ASPECT_CLASS: Record<"3/2" | "347/250", string> = {
  "3/2": "aspect-[3/2]",
  "347/250": "aspect-[347/250]",
};

/**
 * The dark, centered "image grid with a label under each photo" pattern
 * used repeatedly across both properties' About pages (Villas/Stay,
 * Discover, Packages) with a different column count, label size, and item
 * count each time — built once and reused with different props instead of
 * copy-pasted per section.
 */
export function LinkCardGrid({
  heading,
  items,
  columns,
  labelSize,
  imageAspect = "3/2",
}: LinkCardGridProps) {
  const isSingleColumnOnMobile = labelSize === 28;

  return (
    <section className="flex flex-col items-center gap-10 bg-ink px-5 py-16 md:px-[92px]">
      <h2 className="font-heading text-[40px] font-light text-primary">{heading}</h2>

      <div
        className={`grid w-full max-w-5xl gap-5 ${
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
            <>
              <div
                className={`relative w-full overflow-hidden ${IMAGE_ASPECT_CLASS[imageAspect]}`}
              >
                <Image
                  src={item.imgSrc}
                  alt={item.label}
                  fill
                  sizes="500px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span
                className={`text-white transition-colors duration-200 group-hover:text-primary ${LABEL_TEXT_SIZE[labelSize]}`}
              >
                {item.label}
              </span>
            </>
          );

          return (
            <div key={item.label} className="flex flex-col items-center gap-3 text-center">
              {item.inScope ? (
                <Link href={item.href} className="group flex flex-col items-center gap-3">
                  {content}
                </Link>
              ) : (
                content
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
