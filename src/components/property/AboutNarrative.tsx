import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

type AboutNarrativeProps = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  /** Seminyak has a short tagline between the narrative and the button; Ubud
   * has none — omitting the prop skips it rather than rendering an empty node. */
  tagline?: string;
  bookingHref: string;
  /** Seminyak's CTA reads "Book Your Stay"; Ubud's reads "Plan Now". */
  buttonLabel: string;
};

/**
 * The first reading band on each About page.
 *
 * The reference composition pairs a heading column with a stack of feature
 * cards on the right. Nyuh has narrative prose rather than three features, so
 * this keeps the two-column split and gives the right column the narrative,
 * its closing tagline, and the booking action — the same asymmetry without
 * fabricating three feature blocks to fill a shape.
 */
export function AboutNarrative({
  eyebrow,
  heading,
  paragraphs,
  tagline,
  bookingHref,
  buttonLabel,
}: AboutNarrativeProps) {
  return (
    <Section tone="canvas" space="loose">
      {/*
        The two-column split waits until `lg`, not `md`. Measured at 768px the
        md split left the narrative column 344px wide — 41 characters a line,
        below the comfortable 45–75 band, which turned Ubud's single long
        paragraph into 23 lines of a tall thin column. Below `lg` the two stack
        instead, and the prose is capped so a full-width tablet column does not
        swing to the opposite problem — uncapped at 768px it measured 87
        characters a line.

        The cap is `34rem` (544px), not a `ch` value. `62ch` was tried first and
        did nothing at all: `ch` is the advance width of the "0" glyph, which in
        Plus Jakarta Sans is 11.7px against a ~7.9px average character, so 62ch
        resolved to 726px — wider than the 689px container it was meant to
        constrain. 544px measures out at roughly 69 characters.
      */}
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* The heading holds the left margin for the length of the narrative
            rather than scrolling away after the first paragraph. Stacked, it
            has no effect — which is correct, a sticky heading on a narrow
            screen would just eat the viewport. */}
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div className="flex max-w-[34rem] flex-col lg:max-w-none">
          <Reveal delay={120} className="flex flex-col gap-5">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-body text-slate">
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={200} className="mt-10 flex flex-col items-start gap-7">
            {tagline ? (
              // A pastel feature panel from DESIGN.md — 28px corners, saturated
              // background carrying its own weight, no border. Wording unchanged.
              <p className="rounded-[28px] bg-surface-warm px-8 py-7 text-h4 font-medium text-ink">
                {tagline}
              </p>
            ) : null}

            <Button href={bookingHref} external>
              {buttonLabel}
            </Button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
