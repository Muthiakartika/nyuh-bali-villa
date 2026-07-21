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
    <section className="px-5 py-20 text-center md:py-24">
      <Container className="flex flex-col items-center">
        <h1 className="font-heading text-[36px] leading-tight font-light text-primary">
          {heading}
        </h1>

        {/* Same short gold rule used on the homepage cards — it ties the
            sections together and gives the heading a clear terminator. */}
        <span aria-hidden className="mt-6 block h-px w-16 bg-primary/70" />

        {/* `ch` units size the box by character count rather than pixels, so
            the measure stays comfortable no matter the font size. */}
        <div className="mt-10 flex max-w-[68ch] flex-col gap-6">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-[1.9] font-extralight text-text">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Promoted from body text to a pull-quote: it's a standalone brand
            line, not part of the narrative, so it gets the heading font and
            a larger size to separate it from the paragraphs above. */}
        {tagline ? (
          <p className="font-heading mt-12 text-2xl font-light text-ink">{tagline}</p>
        ) : null}

        {/* Uppercase + letter-spacing matches the nav's existing treatment,
            so the button reads as part of the same design language rather
            than a default form control. The label itself is unchanged. */}
        <a
          href={bookingHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 rounded-[3px] bg-primary px-8 py-3.5 text-sm tracking-[2px] text-white uppercase transition-opacity duration-300 hover:opacity-90"
        >
          {buttonLabel}
        </a>
      </Container>
    </section>
  );
}
