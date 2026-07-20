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
    <section className="flex flex-col items-center gap-6 px-5 py-16 text-center md:px-[92px]">
      <h1 className="font-heading max-w-3xl text-[36px] font-light text-primary">
        {heading}
      </h1>

      <div className="flex max-w-4xl flex-col gap-4">
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
    </section>
  );
}
