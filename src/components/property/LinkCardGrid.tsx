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
}: LinkCardGridProps) {
  const isSingleColumnOnMobile = labelSize === 28;

  return (
    // Background stays full-bleed; Container caps the content at the
    // site-wide 1080px. Measured on the live site, every card grid (2, 3 and
    // 4 column alike) spans that full 1080px with 20px gaps — the old
    // `max-w-5xl` held it 56px narrower at 1024px.
    <section className="bg-ink px-5 py-16">
      <Container className="flex flex-col items-center">
        <h2 className="font-heading text-[40px] font-light text-primary">{heading}</h2>
        <span aria-hidden className="mt-5 block h-px w-16 bg-primary/70" />

        <div
          className={`mt-12 grid w-full gap-5 ${
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
                    any photo; it lifts on hover to brighten the image. */}
                <div className="absolute inset-0 bg-ink/45 transition-colors duration-500 group-hover:bg-ink/25" />

                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                  <span className={`text-white ${LABEL_TEXT_SIZE[labelSize]}`}>
                    {item.label}
                  </span>
                  <span
                    aria-hidden
                    className="mt-3 block h-px w-8 bg-primary/80 transition-all duration-500 ease-out group-hover:w-16"
                  />
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
