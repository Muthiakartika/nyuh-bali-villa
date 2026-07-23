import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

type AboutNarrativeProps = {
  /** Small letter-spaced line above the heading — the property name, which
   * already exists on the site. */
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  /** Seminyak's page has a short tagline between the narrative and the
   * button ("We serve with smile and sincerity"); Ubud's doesn't have one
   * at all — omitting the prop skips it entirely rather than rendering an
   * empty paragraph. */
  tagline?: string;
  bookingHref: string;
  /** Seminyak's CTA reads "Book Your Stay"; Ubud's reads "Plan Now" — same
   * button, different label per property. */
  buttonLabel: string;
  /** The "Best Price Guaranteed" offer, folded in from what used to be its own
   * separate dark band below this one — same content, verbatim from the live
   * site. */
  promoCode: string;
  perks: string[];
  contactEmail: string;
};

/**
 * The About band — now carrying the "Best Price Guaranteed" offer as well.
 *
 * **Why they're one section.** The heading used to sit alone at the top of a
 * sticky left column, leaving the whole lower-left of the band empty while the
 * narrative ran down the right — a conspicuous void. "Best Price Guaranteed"
 * was a second, separate dark band immediately below. Folding the offer into
 * that empty column collapses two sections into one, fills the hole, and lets a
 * visitor take in the pitch and the deal without a scroll between them.
 *
 * **Layout.** An explicit grid: the heading holds the top-left, the offer plate
 * sits directly under it (bottom-left), and the narrative spans the full height
 * of the right column. Ordered in the DOM as heading → narrative → offer, so
 * that when the columns stack on mobile the reading order is right: name the
 * place, describe it, then close with the deal.
 *
 * **Contrast.** The offer plate stays dark (`ink`) even on the light sand band,
 * because the promo code is set in full-strength brand gold — 6.93:1 on ink,
 * but only 2.39:1 on sand. Keeping the plate dark is what lets the gold stay
 * gold. All copy is verbatim from the live site.
 */
export function AboutNarrative({
  eyebrow,
  heading,
  paragraphs,
  tagline,
  bookingHref,
  buttonLabel,
  promoCode,
  perks,
  contactEmail,
}: AboutNarrativeProps) {
  return (
    // The one band whose top and bottom are *not* meant to match. Its `pt` isn't
    // rhythm at all — the booking card overlaps the hero and its bottom edge
    // sits exactly on this section's top edge, so this padding is the whole gap
    // between that dark card and the "About Us" heading, and 56px read as
    // cramped under it (still sand, no white strip, because the section starts
    // at the card's bottom). The `pb` does follow the rhythm's bottom step, so
    // the boundary into "Our Villas" is the same 96px as every other boundary on
    // the page — see the note in Section.tsx.
    <Section
      tone="sand"
      space="none"
      className="pt-12 pb-10 md:pt-[72px] md:pb-13"
    >
      {/* The two-column split happens at `lg`, not `md`. At 768 it gave the
          narrative a 347px column — 41 characters a line, a newspaper measure —
          while the offer plate, stretched to match a much taller text column,
          gained ~190px of empty dark space under its last line. One column reads
          better than two bad ones, so a tablet gets the stacked layout. */}
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-14 lg:gap-y-6">
        {/* Top-left: the section heading. */}
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          className="lg:col-start-1 lg:row-start-1"
        />

        {/* Right column, spanning both rows: the narrative, its closing
            tagline, and the CTA.

            `lg:justify-between` is what lands the button on the same baseline
            as the offer plate opposite it. The column is a stretched grid item,
            so its height is the full two rows; pushing the CTA block to the
            bottom means the button's bottom edge and the plate's bottom edge
            are the same line at any width, instead of the button floating a
            dozen pixels short wherever the narrative happened to stop. The
            `mt-6` below stays as the *minimum* gap — `justify-between` only
            ever adds to it, so this can't collapse the narrative onto the
            tagline on a narrow column. */}
        <div className="flex flex-col lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:justify-between">
          {/* The measure is capped only while the section is stacked: at 768 the
              paragraphs would otherwise run the full 704px container, ~83
              characters a line. Above `lg` the column itself is the measure, so
              the cap is lifted rather than leaving the text ragged inside its
              own column. (A `ch` unit is no use here — it's the width of the
              "0" glyph, 11.7px in this font, so `62ch` resolved to 726px, wider
              than the container it was meant to constrain.) */}
          <Reveal delay={120} className="flex max-w-[34rem] flex-col gap-4 lg:max-w-none">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[17px] leading-[1.7] font-light text-text"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>

          {/* The tagline and the button are one closing block: `mt-6` is the
              minimum distance from the narrative above (see `justify-between`
              on the column — any spare column height lands here), and the `gap`
              is the distance between the line and the button itself. */}
          <Reveal delay={200} className="mt-6 flex flex-col items-start gap-8">
            {tagline ? (
              // Set as a statement rather than another paragraph: the gold rule
              // and the larger, lighter setting mark it as the section's closing
              // line. Wording unchanged.
              <p className="font-heading border-l border-primary pl-6 text-[22px] leading-snug font-light text-ink md:text-[26px]">
                {tagline}
              </p>
            ) : null}

            <Button href={bookingHref} external>
              {buttonLabel}
            </Button>
          </Reveal>
        </div>

        {/* Bottom-left: the offer plate, filling what used to be dead space
            beneath the heading. Dark on the light band so the gold survives —
            see the contrast note above. */}
        <Reveal delay={260} className="lg:col-start-1 lg:row-start-2">
          {/* `h-full` so the plate always reaches the bottom of its row. The
              Reveal is a stretched grid item and already does; without this the
              dark panel inside it kept its natural height, so whenever the
              narrative column was the taller of the two the plate stopped short
              and the button had nothing to line up with.

              `justify-center` handles the other half of that: when the plate is
              stretched past its content (~63px at 1024), centring splits the
              slack above and below instead of pooling it all under the last
              line, so it reads as a roomier card rather than as a gap. At the
              widths where the plate is the taller column it's a no-op. */}
          <div className="flex h-full flex-col justify-center bg-ink p-5 md:p-6">
            <h3 className="font-heading text-[22px] leading-tight font-light text-white md:text-[26px]">
              Best Price Guaranteed
            </h3>
            <span aria-hidden className="mt-3 block h-px w-10 bg-primary" />

            <p className="mt-4 text-[15px] leading-relaxed font-light text-white/70">
              Exclusive privileges for booking on our website.
            </p>

            <p className="text-eyebrow font-body mt-5 text-primary uppercase">
              Promo code
            </p>
            <p className="font-heading mt-2 text-[34px] leading-none font-light tracking-[0.12em] text-primary md:text-[40px]">
              &ldquo;{promoCode}&rdquo;
            </p>

            <ul className="mt-5 flex flex-col divide-y divide-white/10 border-t border-white/10">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="py-2 text-[14px] leading-relaxed font-light text-white/75"
                >
                  {perk}
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[13px] leading-relaxed text-white/70">
              Screenshot the deal and{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary underline decoration-primary/40 underline-offset-[5px] transition-colors duration-300 hover:decoration-primary"
              >
                click here
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
