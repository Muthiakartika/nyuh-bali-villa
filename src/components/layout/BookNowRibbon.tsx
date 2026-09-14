type BookNowRibbonProps = {
  /** The words down the tab, one column per word. Two short words is what the
   *  212px height fits; Site settings supplies it, defaulting to "BOOK NOW". */
  label?: string;
  /** The live site points this at a different booking-engine URL depending
   * on context (the homepage links to a "choose a property" group booking
   * page; each property's own pages link straight to that property's
   * booking page) — so the destination is a prop, not hard-coded. */
  href: string;
};

/**
 * The fixed vertical "BOOK NOW" tab on the right edge of the homepage.
 *
 * It looks like rotated text, but inspecting the live site shows it isn't a
 * CSS `writing-mode` or `transform: rotate()` trick at all — it's each letter
 * in its own block-level element, which stack top-to-bottom for free because
 * that's how block elements naturally flow. Reproducing that exact structure
 * is what makes the letter spacing and the "BOOK" / "NOW" grouping gap match
 * the original.
 *
 * Restyled from gold-on-dark to ink-on-gold: as the only permanent call to
 * action on a page made entirely of photography, it should read as a solid
 * printed tab rather than as another dark rectangle competing with the panels.
 * It also slides slightly out from the edge on hover, which is the whole
 * affordance a tab like this needs.
 *
 * A Server Component — a static link with no state or browser APIs, so there's
 * no reason to ship it as client-side JS.
 */
export function BookNowRibbon({ href, label = "BOOK NOW" }: BookNowRibbonProps) {
  // One column of letters per word. Splitting rather than hard-coding is what
  // lets the label come from the CMS without the "BOOK" / "NOW" grouping —
  // the thing that makes a vertical tab readable — being lost.
  const words = label.trim().split(/\s+/).filter(Boolean);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/ribbon fixed top-1/2 right-0 z-[100] flex h-[212px] w-9 -translate-y-1/2 flex-col items-center justify-center bg-primary text-[13px] font-semibold tracking-[0.08em] text-ink transition-[background-color,color,padding] duration-500 ease-out hover:bg-ink hover:text-primary"
    >
      {words.map((word, wordIndex) => (
        <span
          key={wordIndex}
          // The live site separates "NOW" from "BOOK" with its own block and a
          // margin — kept, because that grouping is what makes the tab
          // readable as two words rather than one seven-letter column.
          className={`flex flex-col items-center ${wordIndex ? "mt-3.5" : ""}`}
        >
          {/* Keyed by index, not the letter itself — "BOOK" repeats "O", so
              using the letter as the key would collide. */}
          {[...word].map((letter, index) => (
            <span key={index} className="block leading-[1.35]">
              {letter}
            </span>
          ))}
        </span>
      ))}
    </a>
  );
}
