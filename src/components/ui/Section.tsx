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
  width?: "wide" | "narrow";
  /** Classes for the outer <section> (the full-bleed background layer). */
  className?: string;
  /** Classes for the inner Container (the content layer). */
  innerClassName?: string;
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
 * their line box: measured here, the cap of a 42px section heading sits ~7px
 * below it (half-leading plus the font's ascent-above-cap). So a symmetrical
 * `py-12` band renders ~55px of visible space above the title and exactly 48px
 * below the last card — the client read the difference straight off a
 * screenshot. Each step therefore carries 8px more on the bottom than the top,
 * which lands the two *visible* gaps within a pixel of each other.
 *
 * The sums are unchanged (56/80, 72/96, 80/112 mobile/`md`), so this is a
 * redistribution, not extra height — no band grew and no gap between bands
 * widened.
 *
 * The mobile→desktop ratio still matters: each step grows ~30% at `md`, so a
 * phone gets genuinely tighter spacing, not the desktop rhythm scaled down —
 * vertical space is far scarcer on a 390px screen.
 */
const SPACE_CLASS: Record<SectionSpace, string> = {
  none: "",
  tight: "pt-6 pb-8 md:pt-9 md:pb-11",
  normal: "pt-8 pb-10 md:pt-11 md:pb-13",
  loose: "pt-9 pb-11 md:pt-13 md:pb-15",
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
}: SectionProps) {
  return (
    <section
      className={`px-5 sm:px-8 ${TONE_CLASS[tone]} ${SPACE_CLASS[space]} ${className}`}
    >
      <Container width={width} className={innerClassName}>
        {children}
      </Container>
    </section>
  );
}
