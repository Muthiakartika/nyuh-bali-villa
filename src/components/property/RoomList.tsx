import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button, buttonClassName } from "@/components/ui/Button";
import { ImageGallery } from "@/components/property/ImageGallery";
import { BedIcon, ExpandIcon, UsersIcon } from "@/components/ui/icons";

export type Room = {
  name: string;
  /** Every room on the live site is a 3-photo slider; the whole set is kept
   * and shown through `ImageGallery`. */
  images: string[];
  bed: string;
  /** Floor area, e.g. "65 sqm". */
  size: string;
  occupancy: string;
  /** "Check Rates" — always the property's booking engine, external. */
  ratesHref: string;
  /** "Details" — the live per-room page. Those pages are outside this
   * project's scope, so this is inert by default; see `inScope` in
   * data/properties.ts for the same convention on nav and grid items. */
  detailsHref: string;
  detailsInScope?: boolean;
};

type RoomListProps = {
  /** Small letter-spaced label above the heading. */
  eyebrow?: string;
  heading: string;
  /** The paragraph the live page runs under each category heading. */
  intro?: string;
  rooms: Room[];
  tone?: "sand" | "sand-deep";
};

/**
 * The accommodation listing — used by `/ubud/villa` (twice: Suites, then
 * Villas) and `/seminyak/villa`.
 *
 * **No card container.** The photo sits directly on the band with its text
 * beneath, separated by the site's gold rule, rather than inside a panel. Two
 * reasons: the design system allows exactly one shadow (the booking card) and
 * two light surfaces, so a third "card surface" would be a new token; and the
 * uncontained-image/contained-text pairing is the editorial contrast the rest
 * of the site is built on.
 *
 * Two columns at `lg`, never `md` — the same rule as every other split here.
 * A room needs its three spec lines and two CTAs side by side, and a 768px
 * tablet cut into two columns leaves neither enough room.
 */
export function RoomList({
  eyebrow,
  heading,
  intro,
  rooms,
  tone = "sand",
}: RoomListProps) {
  return (
    <Section tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={heading} />

      {intro ? (
        <Reveal delay={80}>
          <p className="mt-8 max-w-[62rem] text-[17px] leading-[1.7] font-light text-text">
            {intro}
          </p>
        </Reveal>
      ) : null}

      <div className="mt-8 grid gap-x-10 gap-y-12 md:mt-10 lg:grid-cols-2">
        {rooms.map((room, index) => (
          // Staggered left-to-right, matching LinkCardGrid.
          <Reveal key={room.name} delay={index * 90}>
            <article className="flex h-full flex-col">
              <ImageGallery
                images={room.images}
                alt={room.name}
                heightClassName="h-56 md:h-72"
                sizes="(min-width: 1024px) 600px, 100vw"
              />

              <h3 className="font-heading mt-6 text-[24px] leading-tight font-light text-ink md:text-[28px]">
                {room.name}
              </h3>
              <span aria-hidden className="mt-4 block h-px w-10 bg-primary" />

              {/* A description list, not a row of divs: these really are
                  label/value pairs, and the labels are what a screen reader
                  needs to make "2 adults and one child" mean anything. The
                  visible label is the icon, so the text label is visually
                  hidden rather than dropped. */}
              <dl className="mt-5 flex flex-col gap-3">
                {[
                  { label: "Bedding", value: room.bed, Icon: BedIcon },
                  { label: "Villa size", value: room.size, Icon: ExpandIcon },
                  { label: "Occupancy", value: room.occupancy, Icon: UsersIcon },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0 text-primary-deep"
                    />
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-[15px] leading-relaxed font-light text-text">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* `mt-auto` pins the actions to the bottom of the tallest card
                  in the row, so the two columns' buttons share a baseline even
                  when one room's name wraps to two lines. */}
              <div className="mt-auto flex flex-wrap items-center gap-3 pt-7">
                <Button href={room.ratesHref} external size="sm">
                  Check Rates
                </Button>

                {room.detailsInScope ? (
                  <Link
                    href={room.detailsHref}
                    className={buttonClassName("outline", "sm")}
                  >
                    Details
                  </Link>
                ) : (
                  // Out of scope: same shape and weight, but no hover and no
                  // link, so it never suggests a destination this build
                  // doesn't have.
                  <span className="inline-flex items-center justify-center border border-ink/20 px-6 py-3 font-body text-[11px] tracking-[0.2em] text-ink/45 uppercase">
                    Details
                  </span>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
