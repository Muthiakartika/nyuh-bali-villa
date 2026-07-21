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
   * unbroken dark brown. Dark is now a *punctuation mark*: it appears three
   * or four times per page, always with light on either side, so it lands as
   * emphasis instead of as the page's baseline.
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
 * These were tuned down from `py-20 md:py-28` / `py-24 md:py-36` after review:
 * the wider spacing read as *empty* rather than as generous, and it pushed the
 * page's actual content so far apart that the reader lost the sense that two
 * adjacent bands belonged to the same page. The steps still differ from each
 * other — that difference is what gives the page a cadence — they're just no
 * longer competing with the content for the screen.
 *
 * The mobile→desktop ratio matters as much as the values. Each step grows by
 * about 40% at `md`, so a phone gets genuinely tighter spacing rather than the
 * desktop rhythm scaled down: vertical space is far scarcer on a 390px screen,
 * where the same padding costs a much larger share of the viewport.
 */
const SPACE_CLASS: Record<SectionSpace, string> = {
  none: "",
  tight: "py-10 md:py-14",
  normal: "py-14 md:py-20",
  loose: "py-16 md:py-24",
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
