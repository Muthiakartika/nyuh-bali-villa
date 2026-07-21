import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

type SectionTone = "canvas" | "surface" | "accent" | "dark";
type SectionSpace = "none" | "tight" | "normal" | "loose";

type SectionProps = {
  children: ReactNode;
  /**
   * Surface colour. The palette is Nyuh's own brand, not DESIGN.md's — see the
   * note at the top of globals.css for why those two diverge. The page runs on
   * a white canvas; `surface` and `accent` are warm gold tints that break it
   * up, and `dark` is the brand brown, reserved for the offer band, the
   * testimonial and the footer.
   */
  tone?: SectionTone;
  /**
   * Vertical rhythm, from DESIGN.md → Layout → Spacing System:
   * section-sm 48px · section 64px · section-lg 96px.
   *
   * DESIGN.md gives desktop values only, so each step steps down on mobile —
   * 96px of padding on a 390px screen is a quarter of the viewport spent on
   * nothing, and the spec's "generous breathing room" is written about
   * desktop marketing surfaces.
   */
  space?: SectionSpace;
  width?: "wide" | "narrow";
  /** Classes for the outer <section> (the full-bleed background layer). */
  className?: string;
  /** Classes for the inner Container (the content layer). */
  innerClassName?: string;
};

const TONE_CLASS: Record<SectionTone, string> = {
  canvas: "bg-canvas text-slate",
  surface: "bg-surface text-slate",
  accent: "bg-surface-warm text-slate",
  dark: "bg-primary text-on-dark-muted",
};

const SPACE_CLASS: Record<SectionSpace, string> = {
  none: "",
  tight: "py-10 md:py-12",
  normal: "py-12 md:py-16",
  loose: "py-16 md:py-24",
};

/**
 * The standard page band: a full-bleed coloured background with contained
 * content inside it.
 *
 * `px-5 sm:px-8` — the 32px gutter DESIGN.md documents, relaxed to 20px on
 * phones where 32px either side of a 390px screen is a sixth of the width.
 */
export function Section({
  children,
  tone = "canvas",
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
