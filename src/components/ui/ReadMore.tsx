"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronIcon } from "@/components/ui/icons";

type ReadMoreProps = {
  children: ReactNode;
  /**
   * Visible height, in pixels, before the toggle takes over. Measured against
   * the content's own `scrollHeight`, so a block that already fits is left
   * alone entirely — no clamp, no button.
   *
   * 128px is roughly four bullet rows (two columns' worth on the offers) or
   * five lines of a tour note — enough to show what the list is before asking
   * for a click. It is tuned, not arbitrary: the fixed parts of a `PackageList`
   * text column (title, rule, description, CTA) already measure ~337px against
   * a 352px photograph, so the preview *cannot* be much taller than this
   * without the column overshooting again.
   */
  collapsedHeight?: number;
  /**
   * The band this sits on, so the fade at the clipped edge matches the surface
   * instead of guessing white. Only the two light tones are supported because
   * they are the only ones a page body uses (see Section's `tone`).
   */
  tone?: "sand" | "sand-deep";
  /** Announced to screen readers, e.g. "Honeymoon Getaway Package benefits". */
  label?: string;
};

// Below this much overflow the clamp isn't worth a control: the visitor would
// click "Read more" to gain a line and a half. Rows that overshoot the
// photograph by a little are supposed to stay untouched.
const MIN_OVERFLOW = 72;

// Must stay in step with the `duration-500` on the clipping wrapper below: it
// is how long the cap is held before being dropped entirely.
const TRANSITION_MS = 500;

const SCRIM_CLASS: Record<"sand" | "sand-deep", string> = {
  sand: "from-sand",
  "sand-deep": "from-sand-deep",
};

/**
 * Clamps a long block to a fixed height behind a "Read more" toggle.
 *
 * It exists because `PackageList`'s two columns disagree badly on some pages:
 * the photograph is a fixed 352px while the text beside it runs to 725–905px
 * on the Ubud/Seminyak offers (19–21 benefit bullets) and the Explore Bali
 * tours (multi-stop itineraries), leaving a third of the row as empty band.
 * Rows that already fit — most of the dining and retreat items, which measure
 * *shorter* than their photograph — must not sprout a control, which is why
 * this measures rather than truncating at a fixed item count.
 *
 * **Nothing is hidden until the client has confirmed it can give it back.**
 * Same rule as `Reveal`: the server renders the block at full height with no
 * clamp and no button, so the copy is in the HTML for crawlers and stays
 * readable if JavaScript never runs. The clamp is applied only after a real
 * measurement — and if that measurement never happens, the failure mode is
 * "everything visible", not "content stuck behind a button that isn't there".
 *
 * **The first measurement is taken synchronously on mount, not left to the
 * `ResizeObserver`.** `ResizeObserver` is documented to deliver an initial
 * callback on `observe()`, but it was confirmed here that a page which never
 * composites frames (a background or headless tab — this project's browser
 * pane reports `visibilityState: "hidden"`) gets *no* callback at all, exactly
 * like `IntersectionObserver`. Relying on it alone left every row unclamped.
 * The observer is kept, but only for what it is actually needed for: re-,
 * measuring when the column width changes and the text reflows.
 */
export function ReadMore({
  children,
  collapsedHeight = 128,
  tone = "sand",
  label,
}: ReadMoreProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [fullHeight, setFullHeight] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  // True once the expand animation has finished, at which point the height cap
  // is dropped altogether — see `collapse` below.
  const [uncapped, setUncapped] = useState(false);
  const regionId = useId();

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    // **Not `element.scrollHeight`.** The benefits list is a CSS multi-column
    // container (`sm:columns-2`), and the column balancer settles on a column
    // height and then lets the final item *overflow the container's own box*
    // rather than growing it. `scrollHeight` therefore under-reported by
    // 8–16px on the offers pages, which is exactly one or two bullets — they
    // stayed clipped even when expanded. Measuring to the furthest child edge
    // is the only reading that survives multicol.
    //
    // Clipping doesn't affect this: `overflow: hidden` on the wrapper changes
    // what is painted, not the layout rects the children report.
    const measure = () => {
      const box = element.getBoundingClientRect();
      let bottom = box.bottom;
      for (const child of element.querySelectorAll("li, p")) {
        bottom = Math.max(bottom, child.getBoundingClientRect().bottom);
      }
      setFullHeight(Math.ceil(bottom - box.top));
    };

    // Measured synchronously rather than from a scheduled callback: rAF is
    // throttled in a tab that isn't painting, the same trap the observer below
    // falls into.
    measure();

    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setUncapped(true), TRANSITION_MS + 80);
    return () => window.clearTimeout(timer);
  }, [open]);

  const collapse = () => {
    // Put the measured height back for one tick before collapsing. Once
    // `uncapped` has removed the cap the computed `max-height` is `none`, and
    // `none → 128px` is not interpolable, so the close would snap instead of
    // animating. A timeout (not rAF) because a tab that isn't painting still
    // has to be able to close this.
    setUncapped(false);
    window.setTimeout(() => setOpen(false), 0);
  };

  const collapsible =
    fullHeight !== null && fullHeight > collapsedHeight + MIN_OVERFLOW;
  const clamped = collapsible && !open;

  return (
    <div>
      <div
        id={regionId}
        className="relative overflow-hidden transition-[max-height] duration-500 ease-out motion-reduce:transition-none"
        // `undefined` — not a large number — whenever there is nothing to hide:
        // unmeasured, not collapsible, or fully open and settled. No cap at all
        // is the only state that provably cannot clip, so the expanded block
        // ends up there rather than trusting a measurement to stay correct
        // after fonts swap or the column count changes.
        style={{
          maxHeight:
            collapsible && !uncapped
              ? `${clamped ? collapsedHeight : fullHeight}px`
              : undefined,
        }}
      >
        <div ref={contentRef}>{children}</div>

        {/* Fades the cut edge into the band so the clip reads as an
            affordance rather than as content that failed to load. */}
        {clamped ? (
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t to-transparent ${SCRIM_CLASS[tone]}`}
          />
        ) : null}
      </div>

      {collapsible ? (
        <button
          type="button"
          onClick={() => (open ? collapse() : setOpen(true))}
          aria-expanded={open}
          aria-controls={regionId}
          aria-label={label ? `${open ? "Read less" : "Read more"}: ${label}` : undefined}
          // Matches the "Read more" already on the blog cards (PostGrid) —
          // gold eyebrow type with a hairline underline — rather than adding a
          // second treatment for the same words.
          className="text-eyebrow font-body mt-4 inline-flex cursor-pointer items-center gap-2 text-primary-deep uppercase underline decoration-primary/40 underline-offset-[6px] transition-colors duration-300 hover:decoration-primary"
        >
          {open ? "Read less" : "Read more"}
          <ChevronIcon
            aria-hidden
            className={`h-3 w-3 transition-transform duration-300 motion-reduce:transition-none ${
              open ? "-rotate-90" : "rotate-90"
            }`}
          />
        </button>
      ) : null}
    </div>
  );
}
