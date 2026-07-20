"use client";

import { useState } from "react";

type DirectBookingDealsProps = {
  bookingHref: string;
};

/**
 * The small dismissible promo card fixed to the bottom-right corner of
 * every property page ("Direct Booking Deals 66% Off / Code: 'ilovenyuh'").
 * It needs `useState` for exactly one thing — whether the visitor has
 * closed it — so, like the mobile nav toggle, it's a small Client Component
 * rather than pulling its whole page into the client bundle.
 *
 * Returning `null` after dismissal (instead of e.g. an `isVisible` class)
 * removes it from the DOM entirely, matching how a user would expect a
 * "close" button to behave.
 */
export function DirectBookingDeals({ bookingHref }: DirectBookingDealsProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return null;
  }

  return (
    <div className="fixed right-5 bottom-5 z-[9000] flex items-center gap-[15px] rounded-xl bg-white px-5 py-2.5 shadow-[2px_2px_16px_0_rgba(68,68,68,0.6)]">
      <button
        type="button"
        onClick={() => setIsDismissed(true)}
        aria-label="Dismiss"
        className="text-lg text-ink transition-opacity duration-200 hover:opacity-60"
      >
        &times;
      </button>
      <p className="text-base leading-tight text-ink">
        Direct Booking Deals 66% Off
        <br />
        Code : &quot;ilovenyuh&quot;
      </p>
      <a
        href={bookingHref}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 rounded-[3px] bg-ink px-4 py-2.5 text-base text-white transition-opacity duration-200 hover:opacity-90"
      >
        Book Now
      </a>
    </div>
  );
}
