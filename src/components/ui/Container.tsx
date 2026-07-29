import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** Extra classes for the caller's own layout needs (e.g. `flex items-center
   * justify-between`). Merged onto the same div rather than requiring a
   * wrapper, so Container can drop straight into an existing flex/grid
   * without an extra DOM level. */
  className?: string;
  /**
   * `wide` (default) is the site's normal content width. `narrow` is for
   * long-form reading — legal copy, the contact form column — where the
   * limiting factor is line length, not the grid. `read` is the blog article's
   * slightly more generous version of the same idea.
   */
  width?: ContainerWidth;
};

type ContainerWidth = "wide" | "narrow" | "read";

// Both reading widths are measures, not grid widths — they are set by line
// length. `narrow` at 680px is ~75 characters at the 17px the legal pages use;
// measured at 760px the same copy ran to ~88, well past the point where the eye
// starts losing its place on the return sweep.
//
// `read` is 760px carrying 19px body copy, which lands at ~80 characters. That
// is knowingly a little past the 75 the legal pages hold to, and it is a
// trade: the blog's photographs are now capped to the same width as the text
// (they used to break out to 900px, which read as a misalignment rather than
// as a device), so the measure had to give some width back or the whole
// article would have narrowed by 180px.
const WIDTH_CLASS: Record<ContainerWidth, string> = {
  wide: "max-w-[1240px]",
  narrow: "max-w-[680px]",
  read: "max-w-[760px]",
};

/**
 * Why this file exists: every section's *content* sits inside a centered box,
 * even though the *background* of each section spans the full browser width
 * behind it. Wrapping the content here — while leaving the background on the
 * outer section element — is what produces that "full-bleed colour, centered
 * content" split from one shared place, instead of each component inventing
 * its own padding.
 *
 * **Why 1240px and not the 1080px this used to be.** 1080 was measured off
 * the live site, and it's a width from the era the redesign is trying to move
 * away from: on a 1440px display it leaves 180px of dead margin either side
 * and squeezes a 4-up card grid down to ~280px per card. 1240px gives the
 * grids room to breathe and lets display type reach a size that reads as
 * architectural rather than as a blog post, while still stopping well short
 * of edge-to-edge on a wide monitor.
 *
 * Media is deliberately allowed to escape this cap — the hero, the homepage
 * property panels and the awards marquee are all full-bleed. That contrast
 * (contained text, uncontained image) is most of what separates an editorial
 * layout from a stack of centered blocks.
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
