type BookNowRibbonProps = {
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
export function BookNowRibbon({ href }: BookNowRibbonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/ribbon fixed top-1/2 right-0 z-[100] flex h-[212px] w-9 -translate-y-1/2 flex-col items-center justify-center bg-primary text-[13px] font-semibold tracking-[0.08em] text-ink transition-[background-color,color,padding] duration-500 ease-out hover:bg-ink hover:text-primary"
    >
      {/* Keyed by index, not the letter itself — "BOOK" repeats "O", so using
          the letter as the key would collide. */}
      {["B", "O", "O", "K"].map((letter, index) => (
        <span key={index} className="block leading-[1.35]">
          {letter}
        </span>
      ))}
      {/* The live site separates "NOW" from "BOOK" with its own block and a
          margin — kept, because that grouping is what makes the tab readable
          as two words rather than one seven-letter column. */}
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
