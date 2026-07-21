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
 * The white section right below the booking search bar: a centered heading,
 * one or more narrative paragraphs, an optional tagline, and a booking
 * button. Takes its copy as props rather than hard-coding Seminyak's text,
 * since About – Ubud reuses this exact layout with its own (unrelated,
 * single-paragraph, tagline-free) narrative.
 */
export function AboutNarrative({
  heading,
  paragraphs,
  tagline,
  bookingHref,
  buttonLabel,
}: AboutNarrativeProps) {
  return (
    // Container caps the content at the site-wide 1080px and centres it,
    // replacing the old `md:px-[92px]` padding that had no upper bound.
    <section className="px-5 py-16 text-center">
      <Container className="flex flex-col items-center gap-6">
        <h1 className="font-heading text-[36px] font-light text-primary">
          {heading}
        </h1>

        {/* The paragraphs fill the full 1080px content width — measured on
            the live site, where the narrative text runs the whole width of
            the container rather than being held to a narrower reading
            column (this previously capped at max-w-4xl / 896px). */}
        <div className="flex w-full flex-col gap-4">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-[1.6] font-extralight text-text">
              {paragraph}
            </p>
          ))}
        </div>

        {tagline ? <p className="text-lg text-text">{tagline}</p> : null}

        <a
          href={bookingHref}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-[3px] bg-primary px-4 py-[10px] text-base text-white transition-opacity duration-200 hover:opacity-90"
        >
          {buttonLabel}
        </a>
      </Container>
    </section>
  );
}
