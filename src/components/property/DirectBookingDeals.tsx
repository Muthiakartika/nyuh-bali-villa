"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type DirectBookingDealsProps = {
  bookingHref: string;
};

/**
 * The dismissible direct-booking promo.
 *
 * Built as two different things at two sizes: a card docked bottom-right on
 * desktop, and a full-width bar pinned to the bottom edge on mobile, which is
 * the pattern every hospitality site uses because it converts and because it
 * never covers content mid-column. Copy is unchanged.
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
    <div className="fixed inset-x-0 bottom-0 z-[9000] md:inset-x-auto md:right-6 md:bottom-6 md:w-[300px]">
      {/* Deliberately shallow on mobile: every pixel of this bar is paid for
          twice — once here, and again as bottom padding on PropertyFooter so
          the copyright and legal links aren't trapped behind it. */}
      <div className="relative flex items-center gap-4 border-t border-hairline bg-canvas px-5 py-3 md:flex-col md:items-start md:gap-4 md:rounded-xl md:border md:p-6 md:shadow-[0_12px_32px_-4px_rgba(5,0,56,0.08)]">
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss"
          className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center text-subtitle leading-none text-muted transition-colors duration-200 active:text-ink md:top-1 md:right-1"
        >
          &times;
        </button>

        <p className="flex-1 pr-6 text-body-sm text-ink md:flex-none md:pr-0">
          Direct Booking Deals 66% Off
          <br />
          <span className="mt-1 inline-block font-medium text-accent-dark">
            Code : &quot;ilovenyuh&quot;
          </span>
        </p>

        <Button href={bookingHref} external className="shrink-0 md:w-full">
          Book Now
        </Button>
      </div>
    </div>
  );
}
