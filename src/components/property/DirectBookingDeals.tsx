"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type DirectBookingDealsProps = {
  bookingHref: string;
};

/**
 * The dismissible direct-booking promo on every property page.
 *
 * **Two problems with the old version.** Visually it was a white pill with a
 * heavy grey drop shadow (`2px 2px 16px rgba(68,68,68,.6)`) floating in the
 * corner — the exact appearance of an ad unit or a cookie notice, which is
 * what visitors have learned to dismiss without reading. And on a phone it
 * stayed a floating corner box, overlapping whatever was underneath it.
 *
 * It's now built as two different things at two sizes: a sand card with a gold
 * hairline docked to the bottom-right on desktop, and a full-width bar pinned
 * to the bottom edge on mobile, which is the pattern every hospitality site
 * uses because it converts and because it never covers content mid-column.
 * The copy is unchanged.
 *
 * Returning `null` after dismissal removes it from the DOM entirely, matching
 * how a visitor expects a close button to behave.
 */
export function DirectBookingDeals({ bookingHref }: DirectBookingDealsProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9000] md:inset-x-auto md:right-6 md:bottom-6 md:w-[292px]">
      {/* Kept deliberately shallow on mobile: every pixel of this bar has to be
          paid for twice — once here, and again as bottom padding on
          PropertyFooter so the copyright and legal links aren't trapped behind
          it. Re-measure both if this changes. */}
      <div className="relative flex items-center gap-4 border-t border-primary/50 bg-sand px-5 py-3 md:flex-col md:items-start md:gap-4 md:border md:px-6 md:py-6 md:shadow-[0_20px_60px_-24px_rgba(38,30,19,0.6)]">
        {/* Was a bare 10×18px glyph — the smallest control on the site, and the
            only way to get this bar off the bottom of a phone screen. Now a
            36×36 box; the glyph inside is unchanged. */}
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss"
          className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center text-lg leading-none text-ink/45 transition-colors duration-300 hover:text-ink md:top-1 md:right-1"
        >
          &times;
        </button>

        <p className="flex-1 pr-6 text-[13.5px] leading-tight text-ink md:flex-none md:pr-0 md:text-base md:leading-snug">
          Direct Booking Deals 66% Off
          <br />
          {/* The code is the takeaway, so it gets the gold and the letter
              spacing rather than being another line of the same sentence. */}
          <span className="mt-1 inline-block tracking-[0.14em] text-primary-deep md:mt-1.5">
            Code : &quot;ilovenyuh&quot;
          </span>
        </p>

        <Button
          href={bookingHref}
          external
          size="sm"
          className="shrink-0 md:w-full"
        >
          Book Now
        </Button>
      </div>
    </div>
  );
}
