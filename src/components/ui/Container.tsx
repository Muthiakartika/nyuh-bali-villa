import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** `wide` is the documented marketing width. `narrow` is a reading measure
   * for long-form legal copy, which DESIGN.md does not cover — a 1280px column
   * of terms & conditions would run to ~150 characters a line. */
  width?: "wide" | "narrow";
};

// DESIGN.md → Layout → Grid & Container: "Marketing pages use 1280px
// max-width with 32px gutters". The gutter lives on Section (px-8 = 32px), so
// this only carries the cap.
const WIDTH_CLASS: Record<"wide" | "narrow", string> = {
  wide: "max-w-[1280px]",
  narrow: "max-w-[720px]",
};

/**
 * Caps and centres content while the section's background stays full-bleed.
 * That split is what produces edge-to-edge colour bands with aligned content
 * from one shared place, instead of each component inventing its own padding.
 *
 * Media is deliberately allowed to escape the cap — the hero and the homepage
 * property panels are full-bleed. Contained text against uncontained image is
 * most of what makes the composition read as designed rather than stacked.
 */
export function Container({
  children,
  className = "",
  width = "wide",
}: ContainerProps) {
  return (
    <div className={`mx-auto w-full ${WIDTH_CLASS[width]} ${className}`}>
      {children}
    </div>
  );
}
