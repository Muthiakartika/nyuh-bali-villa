import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/icons";

export type LinkCardItem = {
  label: string;
  href: string;
  imgSrc: string;
  /** Secondary line — the property name. Real content from the page, never a
   * fabricated price or property type; Nyuh has no listing inventory. */
  meta?: string;
  /** Every grid on this site points at pages outside this project's 7-page
   * scope, so every item ends up inert — but the flag is per-item, not a
   * blanket assumption. */
  inScope?: boolean;
};

type LinkCardGridProps = {
  eyebrow?: string;
  heading: string;
  /** Supporting paragraph shown beside the heading, as in the reference
   * composition where every band heading is paired with one. */
  description?: string;
  items: LinkCardItem[];
  /**
   * `cards` is the featured-property grid: image-forward tiles with the label
   * below the photo. `rows` is the listing-row list: thumbnail, label, meta,
   * and a trailing action, which scans far better than a grid once the items
   * are alternatives rather than features.
   */
  layout?: "cards" | "rows";
  columns?: 2 | 3 | 4;
  tone?: "canvas" | "surface" | "accent";
};

// The 4-up grid waits until `lg`. At `sm` (640px) four columns leave each card
// about 140px wide, which is narrower than the 22px label it has to carry; two
// columns of ~350px at that width read far better and only cost one extra row.
const COLUMN_CLASS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/**
 * The repeated content grid on both About pages (Villas/Stay, Discover,
 * Packages).
 *
 * Geometry follows DESIGN.md: photography at `{rounded.xl}` (16px), cards flat
 * with a `{colors.hairline-soft}` border rather than a shadow, badges and
 * actions as `{rounded.full}` pills. Per the no-hover policy the tiles carry no
 * hover choreography — the action is an explicit, always-visible control.
 */
export function LinkCardGrid({
  eyebrow,
  heading,
  description,
  items,
  layout = "cards",
  columns = 3,
  tone = "canvas",
}: LinkCardGridProps) {
  return (
    <Section tone={tone} space="loose">
      <SectionHeading
        eyebrow={eyebrow}
        title={heading}
        trailing={
          description ? (
            <p className="text-body text-slate">{description}</p>
          ) : undefined
        }
      />

      {layout === "rows" ? (
        <div className="mt-10 flex flex-col gap-3 md:mt-14">
          {items.map((item, index) => {
            const row = (
              <div className="flex items-center gap-4 rounded-xl border border-hairline-soft bg-canvas p-3 md:gap-6 md:p-4">
                {/* Thumbnail keeps the documented 16px photo radius, one step
                    down in size so the row stays scannable. */}
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg md:h-[72px] md:w-32">
                  <Image
                    src={item.imgSrc}
                    alt={item.label}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-subtitle font-medium text-ink">
                    {item.label}
                  </p>
                  {item.meta ? (
                    <p className="mt-1 truncate text-body-sm text-steel">{item.meta}</p>
                  ) : null}
                </div>

                {/* The trailing action mirrors the reference's "View Details".
                    On a phone the label is dropped and only the arrow remains,
                    in a 40px circle — the full pill would eat the row's width,
                    but hiding the control outright (as this first did) left
                    mobile rows with no indication they went anywhere at all.
                    Out-of-scope items get nothing on mobile, which is correct:
                    they are inert, so there is no affordance to show. */}
                {item.inScope ? (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-body-sm font-medium text-on-primary sm:h-auto sm:w-auto sm:px-5 sm:py-2.5">
                    <span className="hidden sm:inline">View Details</span>
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="hidden shrink-0 items-center gap-2 rounded-full border border-hairline px-5 py-2.5 text-body-sm text-muted sm:inline-flex">
                    View Details
                  </span>
                )}
              </div>
            );

            return (
              <Reveal key={item.label} delay={index * 70}>
                {item.inScope ? (
                  <Link href={item.href} className="block">
                    {row}
                  </Link>
                ) : (
                  row
                )}
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div
          className={`mt-10 grid gap-5 md:mt-14 md:gap-6 ${COLUMN_CLASS[columns]}`}
        >
          {items.map((item, index) => {
            const card = (
              <div className="flex flex-col">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <Image
                    src={item.imgSrc}
                    alt={item.label}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>

                {/* Label sits below the photograph, not over it. The previous
                    design printed it across the middle of every image, which
                    covered the subject and forced a scrim that dulled the
                    photography the section exists to show. */}
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <p className="text-h4 font-medium text-ink">{item.label}</p>
                  {item.meta ? (
                    <p className="shrink-0 text-body-sm text-steel">{item.meta}</p>
                  ) : null}
                </div>
              </div>
            );

            return (
              <Reveal key={item.label} delay={index * 90}>
                {item.inScope ? (
                  <Link href={item.href} className="block">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </Reveal>
            );
          })}
        </div>
      )}
    </Section>
  );
}
