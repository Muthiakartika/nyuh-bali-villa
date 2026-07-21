type BookNowRibbonProps = {
  /** The homepage links to a "choose a property" group booking page; each
   * property's own pages link straight to that property's booking page — so
   * the destination is a prop, not hard-coded. */
  href: string;
};

/**
 * The fixed vertical "BOOK NOW" tab on the right edge of the homepage.
 *
 * It looks like rotated text, but the live site builds it as one letter per
 * block element, which stack top-to-bottom for free. Reproducing that structure
 * is what makes the letter spacing and the "BOOK" / "NOW" grouping match.
 *
 * Brand accent on near-black text: as the only permanent call to action on a
 * page made entirely of photography, it should read as a printed tab rather
 * than another dark rectangle competing with the panels.
 */
export function BookNowRibbon({ href }: BookNowRibbonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-1/2 right-0 z-[100] flex h-[212px] w-9 -translate-y-1/2 flex-col items-center justify-center rounded-l-xl bg-accent text-caption font-semibold text-primary transition-colors duration-200 active:bg-accent-deep"
    >
      {/* Keyed by index, not the letter — "BOOK" repeats "O". */}
      {["B", "O", "O", "K"].map((letter, index) => (
        <span key={index} className="block leading-[1.35]">
          {letter}
        </span>
      ))}
      <span className="mt-3.5 flex flex-col items-center">
        {["N", "O", "W"].map((letter, index) => (
          <span key={index} className="block leading-[1.35]">
            {letter}
          </span>
        ))}
      </span>
    </a>
  );
}
