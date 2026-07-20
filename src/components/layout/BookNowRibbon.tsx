type BookNowRibbonProps = {
  /** The live site points this at a different booking-engine URL depending
   * on context (the homepage links to a "choose a property" group booking
   * page; each property's own pages link straight to that property's
   * booking page) — so the destination is a prop, not hard-coded. */
  href: string;
};

/**
 * The fixed vertical "BOOK NOW" tab on the right edge of the screen.
 *
 * It looks like rotated text, but inspecting the live site shows it isn't a
 * CSS `writing-mode` or `transform: rotate()` trick at all — it's just each
 * letter in its own block-level `<div>`, which stack top-to-bottom for free
 * because that's how block elements naturally flow. Reproducing that exact
 * structure (rather than a rotated string) is what makes the letter spacing
 * and the "BOOK" / "NOW" grouping gap match the original precisely.
 *
 * This is a Server Component — it's a static link with no state or browser
 * APIs involved, so there's no reason to ship it as client-side JS.
 */
export function BookNowRibbon({ href }: BookNowRibbonProps) {
  return (
    <div className="fixed top-[200px] right-0 z-[100] flex h-[230px] w-10 items-center justify-center bg-ink">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center text-base font-bold text-primary transition-opacity duration-200 hover:opacity-80"
      >
        {/* Keyed by index, not the letter itself — "BOOK" repeats "O", so
            using the letter as the key would collide. */}
        {["B", "O", "O", "K"].map((letter, i) => (
          <div key={i}>{letter}</div>
        ))}
        {/* The live site wraps "NOW" in its own div with margin-top: 15px,
            which is what visually separates it from "BOOK" above it. */}
        <div className="mt-[15px] flex flex-col items-center">
          {["N", "O", "W"].map((letter, i) => (
            <div key={i}>{letter}</div>
          ))}
        </div>
      </a>
    </div>
  );
}
