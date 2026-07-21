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
};

/**
 * The first reading section on each About page: heading on the left, the
 * property's narrative on the right.
 *
 * The asymmetric split was already the strongest composition on the old site
 * and it survives the redesign intact — the brief's own principle is that
 * anything not improved by a change should be left alone. What changed is
 * everything around it: the heading is now the brand's dark brown at a real
 * display scale instead of low-contrast gold at 30px, it holds position while
 * the narrative scrolls past it, and the closing tagline and CTA moved out of
 * a centred block underneath into the foot of the text column, where the eye
 * already is when it finishes reading.
 *
 * All copy is passed in verbatim from the page.
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
    <Section tone="sand" space="loose">
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
        {/*
          `sticky` is what turns this from a two-column layout into an
          editorial one: the heading anchors the left margin for the whole
          length of the narrative rather than scrolling out of view after the
          first paragraph. `top-24` clears the 72px scrolled header. On a single
          column (below md) it has no effect at all, which is correct — a
          sticky heading on a phone would just eat the screen.
        */}
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          className="md:sticky md:top-24 md:self-start"
        />

        <div className="flex flex-col">
          <Reveal delay={120} className="flex flex-col gap-5">
            {paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="text-[17px] leading-[1.9] font-light text-text"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>

          <Reveal delay={200} className="mt-9 flex flex-col items-start gap-6">
            {tagline ? (
              // Set as a statement rather than another paragraph: the gold
              // rule and the larger, lighter setting mark it as the section's
              // closing line. Wording unchanged.
              <p className="font-heading border-l border-primary pl-6 text-[22px] leading-snug font-light text-ink md:text-[26px]">
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
