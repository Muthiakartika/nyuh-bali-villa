import { Container } from "@/components/ui/Container";

type AboutNarrativeProps = {
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
 * The white section right below the booking search bar: a centred heading,
 * one or more narrative paragraphs, an optional tagline, and a booking
 * button.
 *
 * The key change from the original is the **reading measure**. The body copy
 * used to run the full 1080px container width, which on Ubud's page is a
 * single ~1,000-character paragraph stretched into one enormous block — the
 * eye loses its place jumping back to the start of each line. Capping the
 * text at ~68 characters per line (`max-w-[68ch]`) with looser leading is
 * the single biggest readability win available here, and it costs nothing
 * visually because the heading and button stay centred on the same axis.
 *
 * Everything else stays on-brand: Source Sans heading, gold `primary`, and
 * the same copy passed in as props.
 */
export function AboutNarrative({
  heading,
  paragraphs,
  tagline,
  bookingHref,
  buttonLabel,
}: AboutNarrativeProps) {
  return (
    <section className="px-5 py-24 md:py-32">
      <Container>
        {/* Editorial two-column split rather than one centred column: the
            heading anchors the left, the narrative runs down the right. An
            asymmetric intro reads as *designed* where a centred block of body
            copy reads as a document, and the right column happens to land on
            a good measure (~570px) without needing a `ch` cap. Stacks to one
            column below `md`. */}
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <div>
            <h1 className="font-heading text-[36px] leading-tight font-light text-primary md:text-[42px]">
              {heading}
            </h1>
            {/* Same short gold rule used across every section heading. */}
            <span aria-hidden className="mt-6 block h-px w-16 bg-primary/70" />
          </div>

          <div className="flex flex-col gap-6">
            {paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-lg leading-[1.9] font-extralight text-text">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Tagline and CTA stay centred under the split — they close the
            section, so they belong on the page's centre axis rather than in
            either column. `gap-10` spaces them whether or not a tagline
            exists (Ubud has none). */}
        <div className="mt-16 flex flex-col items-center gap-10 text-center md:mt-20">
          {tagline ? (
            <p className="font-heading text-2xl font-light text-ink">{tagline}</p>
          ) : null}

          {/* Uppercase + letter-spacing matches the nav's treatment, so the
              button reads as part of the same design language. Label unchanged. */}
          <a
            href={bookingHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[3px] bg-primary px-8 py-3.5 text-sm tracking-[2px] text-white uppercase transition-opacity duration-300 hover:opacity-90"
          >
            {buttonLabel}
          </a>
        </div>
      </Container>
    </section>
  );
}
