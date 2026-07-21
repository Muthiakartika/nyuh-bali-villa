"use client";

import { useMemo } from "react";
import { Container } from "@/components/ui/Container";

type BookingSearchBarProps = {
  bookingHref: string;
};

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

/**
 * The dark bar below the hero slider showing check-in/check-out dates, a
 * room summary, and a promo code field.
 *
 * On the live site this is a full third-party booking-engine widget: real
 * date pickers, a nested guest counter with +/- buttons per room, live
 * availability. Rebuilding that entire reservation system is out of scope
 * for a visual clone with no backend to check availability against — so
 * this reproduces its *appearance* (including the check-in/out dates
 * genuinely defaulting to today/tomorrow, which is what the live widget
 * does too) while "Search" links out to the real booking engine, the same
 * treatment as the other booking CTAs on this site.
 */
export function BookingSearchBar({ bookingHref }: BookingSearchBarProps) {
  const { checkIn, checkOut } = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return { checkIn: formatDate(today), checkOut: formatDate(tomorrow) };
  }, []);

  const fieldValueClassName =
    "rounded-[3px] border border-ink bg-white px-3 py-2 text-[13px] text-ink";
  const fieldLabelClassName = "text-xs text-white uppercase";

  return (
    // Dark bar stays full-bleed; the fields sit inside the shared 1080px
    // Container instead of the old unbounded `md:px-[92px]`.
    <div className="bg-ink px-5 py-8">
      <Container className="flex flex-col items-center gap-6 md:flex-row md:flex-wrap md:justify-center md:gap-6">
      <label className="flex items-center gap-2 text-sm text-white">
        <input type="checkbox" className="h-4 w-4 accent-primary" />
        Flexible Dates
      </label>

      <div className="flex items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className={fieldLabelClassName}>check in</span>
          <span className={fieldValueClassName}>{checkIn}</span>
        </div>
        <span className="pb-2 text-white">→</span>
        <div className="flex flex-col gap-1">
          <span className={fieldLabelClassName}>check out</span>
          <span className={fieldValueClassName}>{checkOut}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <span className={fieldLabelClassName}>Room</span>
        {/* Static, not an interactive counter — see the note above. */}
        <span className={fieldValueClassName}>1 Room, 2 Adult, 0 Child</span>
      </div>

      <div className="flex flex-col gap-1">
        <span className={fieldLabelClassName}>PromoCode</span>
        <input
          type="text"
          placeholder="Promo"
          className={`w-[197px] ${fieldValueClassName}`}
        />
      </div>

      <a
        href={bookingHref}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded bg-primary px-[10px] py-[6px] text-base text-white transition-opacity duration-200 hover:opacity-90"
      >
        Search
      </a>
      </Container>
    </div>
  );
}
