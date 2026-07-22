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
    <Section tone="sand" space="loose">
      <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
        {/* Top-left: the section heading. */}
        <SectionHeading
          eyebrow={eyebrow}
          title={heading}
          className="md:col-start-1 md:row-start-1"
        />

        {/* Right column, spanning both rows: the narrative, its closing
            tagline, and the CTA. */}
        <div className="flex flex-col md:col-start-2 md:row-span-2 md:row-start-1">
          <Reveal delay={120} className="flex max-w-[62ch] flex-col gap-5">
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
        <Reveal delay={260} className="md:col-start-1 md:row-start-2">
          <div className="bg-ink p-6 md:p-7">
            <h3 className="font-heading text-[22px] leading-tight font-light text-white md:text-[26px]">
              Best Price Guaranteed
            </h3>
            <span aria-hidden className="mt-4 block h-px w-10 bg-primary" />

            <p className="mt-5 text-[15px] leading-relaxed font-light text-white/70">
              Exclusive privileges for booking on our website.
            </p>

            <p className="text-eyebrow font-body mt-6 text-primary uppercase">
              Promo code
            </p>
            <p className="font-heading mt-2 text-[34px] leading-none font-light tracking-[0.12em] text-primary md:text-[40px]">
              &ldquo;{promoCode}&rdquo;
            </p>

            <ul className="mt-6 flex flex-col divide-y divide-white/10 border-t border-white/10">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="py-2.5 text-[14px] leading-relaxed font-light text-white/75"
                >
                  {perk}
                </li>
              ))}
            </ul>

            <p className="mt-5 text-[13px] leading-relaxed text-white/70">
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
