import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type SectionTone = "sand" | "sand-deep" | "ink" | "white";
type SectionSpace = "none" | "tight" | "normal" | "loose";

type SectionProps = {
  children: ReactNode;
  /**
   * Surface colour. The old design ran seven full-width `ink` slabs down a
   * single page — header, booking bar, two card grids, Instagram, awards and
   * footer — with the last three stacked back-to-back into ~600px of
   * unbroken dark brown. The body of a page now carries **no** `ink` band at
   * all: dark survives as the site's chrome (header-on-scroll, awards, footer)
   * and as small plates inside light sections, so it frames the content
   * instead of being the content's baseline.
   */
  tone?: SectionTone;
  /** Vertical rhythm. `tight` and `loose` exist so adjacent sections can be
   * pulled into one visual band (Instagram + Awards) or given extra air
   * around a moment that needs it (the testimonial). */
  space?: SectionSpace;
  /** Long-form reading measure instead of the full grid width. */
  width?: "wide" | "narrow" | "read";
  /** Classes for the outer <section> (the full-bleed background layer). */
  className?: string;
  /** Classes for the inner Container (the content layer). */
  innerClassName?: string;
  /** Anchor target for same-page links — the Explore Bali tours all link down
   * to the booking form. Pair it with a `scroll-mt-*` class so the jump clears
   * the sticky header. */
  id?: string;
};

// Dark sections set a light default text colour so body copy inside them
// doesn't have to remember to; headings override it themselves.
const TONE_CLASS: Record<SectionTone, string> = {
  sand: "bg-sand text-text",
  "sand-deep": "bg-sand-deep text-text",
  ink: "bg-ink text-white/70",
  white: "bg-background text-text",
};

/*
 * One rhythm, four steps.
 *
 * Tuned down twice — from `py-20 md:py-28` originally, and again after the
 * client still read the section-to-section gaps as too wide. The catch is that
 * adjacent sections *stack* their padding: a `loose` band's bottom plus the next
 * `normal` band's top used to total ~176px of empty space between two pieces of
 * content on desktop. At the values below that worst case is ~104px, which reads
 * as a deliberate pause rather than a void.
 *
 * **The top and bottom values are deliberately unequal, to look equal.** Every
 * band opens on a heading and closes on something with a hard edge — a row of
 * photographs, a plate, a button. A heading's glyphs don't start at the top of
 * their line box: half-leading plus the font's ascent-above-cap puts the first
 * ink some way below it. So a symmetrical `py-12` band renders more visible
 * space above the title than below the last card — the client read the
 * difference straight off a screenshot. Each step therefore carries more on
 * the bottom than the top, which lands the two *visible* gaps on each other.
 *
 * **The desktop correction is 6px, and it is measured, not estimated.** It was
 * 8px, from an assumed ~7px glyph offset; measuring the real ink (canvas
 * `actualBoundingBoxAscent` against the text node's baseline, rather than the
 * element's box) puts it at exactly 6px for the 42px section heading. That 2px
 * error was visible as a consistent "the gap under the boundary is tighter
 * than the gap above it" across every band on every page. The `md` values are
 * therefore written in px rather than as spacing steps — the correction is an
 * optical constant, not a rhythm value, and the 4px scale cannot express it.
 * **Each step's total is unchanged** (80 / 96 / 112), so no page moved; only
 * the split did.
 *
 * The other half of that correction lives in `SectionHeading`: an 11px eyebrow
 * has an 8px ink offset against the heading's 6px, so a band opening on one
 * would sit 2px lower. It pulls itself up by that difference, which is what
 * lets one padding pair serve every band.
 * **On a phone it's 12px, which is more than the geometry alone asks for**, and
 * that is deliberate: stacked bands put the bottom strip directly under a
 * photograph while the top strip sits under a plain colour change, and a gap
 * bounded by a dark image reads tighter than the same gap bounded by text. The
 * client called the phone's bottom strip too narrow while it measured *wider*
 * than the top one — so the compensation is optical, not arithmetic. Numerically
 * the phone now runs 24px above / 36px below on a `normal` band.
 *
 * **The mobile column is a third tighter than the desktop one, not a scaled
 * copy.** Vertical space is far scarcer on a 390px screen, and stacked bands
 * make every boundary read wider than the same number does beside a full-width
 * grid: two `normal` bands used to meet across 72px on a phone, which the client
 * flagged as too much room between a row of cards and the next heading. At the
 * values below that boundary is 52px, and the widest boundary anywhere on a
 * phone is 56px (against 104px on desktop).
 */
/*
 * **On desktop all three steps are the same.** A boundary's upper half comes
 * from band A's `pb` and its lower half from band B's `pt`, so the two halves
 * can only match when `pb` and `pt` are constants — the moment two adjacent
 * bands use different steps the boundary is lopsided by the difference between
 * them, which is exactly what the testimonial's `loose` was doing (+8px against
 * the `normal` band above it, the largest imbalance on the site). The client
 * asked for every desktop boundary to read the same, and one shared pair is
 * the only way to guarantee it.
 *
 * The steps still differ on mobile, which was explicitly out of scope for that
 * request and is tuned separately (see the note above). If desktop ever wants
 * its variation back, give `loose` its own `md:` pair here — and accept that
 * every boundary it touches goes back to being uneven.
 */
const DESKTOP_SPACE = "md:pt-[45px] md:pb-[51px]";

const SPACE_CLASS: Record<SectionSpace, string> = {
  none: "",
  tight: `pt-5 pb-8 ${DESKTOP_SPACE}`,
  normal: `pt-6 pb-9 ${DESKTOP_SPACE}`,
  loose: `pt-7 pb-10 ${DESKTOP_SPACE}`,
};

/**
 * The standard page band: a full-bleed coloured background with contained
 * content inside it.
 *
 * This exists because eight separate components were each repeating
 * `px-5 py-14 md:py-20` plus their own `<Container>`, which meant the site's
 * vertical rhythm and tone alternation lived in eight places and drifted.
 * Sections now declare *intent* (`tone="ink" space="loose"`) rather than
 * spacing values, so the whole page's cadence can be retuned from this file.
 */
export function Section({
  children,
  tone = "sand",
  space = "normal",
  width = "wide",
  className = "",
  innerClassName = "",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`px-5 sm:px-8 ${TONE_CLASS[tone]} ${SPACE_CLASS[space]} ${className}`}
    >
      <Container width={width} className={innerClassName}>
        {children}
      </Container>
    </section>
  );
}
