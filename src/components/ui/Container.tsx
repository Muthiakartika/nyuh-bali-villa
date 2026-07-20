import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** Extra classes for the caller's own layout needs (e.g. `flex items-center
   * justify-between`). Merged onto the same div rather than requiring a
   * wrapper, so Container can drop straight into an existing flex/grid
   * without an extra DOM level. */
  className?: string;
};

/**
 * Why this file exists: measuring the live nyuhbalivillas.com site's computed
 * styles showed every section's *content* (header nav, footer, card grids,
 * testimonials) sits inside a centered box — even though the *background
 * color* of each section (the dark "ink" bars) still spans the full browser
 * width behind it.
 *
 * Before this component existed, components like PropertyHeader/PropertyFooter
 * applied side padding directly (`md:px-[92px]`) with no upper limit, so on a
 * wide monitor (1920px+) that content just kept stretching outward instead of
 * stopping at a fixed width like the original does. Wrapping the *content* in
 * this Container — while leaving the *background* on the outer section
 * element — reproduces that same "full-bleed color, centered content" split
 * seen on the live site, from one shared place.
 *
 * Why 1080px, not 1120px: the live site wraps content in a 1120px box that
 * *itself* carries 20px of horizontal padding, so the actual content width is
 * 1120 − 40 = 1080px. Every section here already applies its own `px-5` (20px)
 * for the mobile edge gap, so we get the same result more simply by capping
 * the content at 1080px directly: at wide viewports the cap wins (content =
 * 1080px, centered), and on mobile the section's px-5 wins (content =
 * viewport − 40px). Both match the live site exactly at every width — capping
 * at 1120px instead left every section ~40px wider than the original.
 *
 * Why a component and not just a Tailwind utility class: it's used in enough
 * places (header, footer, awards row, and more) that a name (`Container`) is
 * easier to read at each call site than remembering "1080" is the site's
 * magic content-width number.
 */
export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1080px] ${className}`}>
      {children}
    </div>
  );
}
