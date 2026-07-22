"use client";

import { useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { ArrowIcon } from "@/components/ui/icons";

type BookingSearchBarProps = {
  bookingHref: string;
};

type BookingDates = { checkIn: string; checkOut: string };

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

function computeDates(): BookingDates {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  return { checkIn: formatDate(today), checkOut: formatDate(tomorrow) };
}

/*
 * These pages are statically generated, so "today" inside the rendered HTML is
 * whatever day the site was *built* — it would sit there showing a stale date
 * forever. The dates therefore have to be recomputed in the browser.
 *
 * `useSyncExternalStore` is the right tool for that rather than a `useState` +
 * `useEffect` pair: it exists precisely to describe a value that legitimately
 * differs between server and client, and it re-renders once after hydration
 * without a setState inside an effect (which React's lint rules flag, fairly,
 * as a cascading render).
 *
 * Both snapshots must be referentially stable — `getSnapshot` runs on every
 * render, and returning a fresh object each time would loop forever.
 */
const SERVER_DATES = computeDates();
let clientDates: BookingDates | null = null;

function subscribe() {
  return () => {};
}

function getClientDates(): BookingDates {
  clientDates ??= computeDates();
  return clientDates;
}

function getServerDates(): BookingDates {
  return SERVER_DATES;
}

const labelClassName = "text-eyebrow font-body text-primary uppercase";
// Compact cell: a tight label→value gap and modest vertical padding keep the
// whole widget shorter than the earlier `py-4` version without crowding.
const cellClassName = "flex flex-col justify-center gap-1 px-6 py-3.5";
const valueClassName = "text-[15px] font-medium text-white";

/**
 * The availability search that docks over the hero's bottom edge.
 *
 * **A modern reinterpretation of the live site's booking widget.** The original
 * is the DNA — the dark-brown bar, check-in → check-out with an arrow between
 * them, a room summary with a `+` guest control, a promo field, a gold Search —
 * and this keeps every one of those cues, colour included, so a returning
 * visitor recognises it. What changes is the execution: instead of flat white
 * boxes on the bar (the 2012 booking-engine look), it's one premium card in the
 * brand's dark brown (`ink`) floating over the hero — `rounded-xl`, a gold-brown
 * hairline frame, a soft warm elevation shadow, gold labels and white values,
 * and gold hairlines *between* fields. The `+` and the arrow are drawn in brand
 * gold as small, refined marks rather than heavy UI controls.
 *
 * Behaviour is unchanged and deliberately simplified: this reproduces the
 * widget's *appearance* (dates genuinely default to today/tomorrow) while the
 * fields are static and Search links out to the real booking engine, which is
 * the only thing that can check availability. The `+` mirrors the live control
 * visually; guests are actually chosen on the booking engine after Search.
 */
export function BookingSearchBar({ bookingHref }: BookingSearchBarProps) {
  const dates = useSyncExternalStore(subscribe, getClientDates, getServerDates);

  // The negative top margin lifts the card up over the hero's bottom edge.
  // Eased off from -mt-20 → -mt-14 so the card no longer touches the hero title:
  // the title lockup sits ~80px off the hero's bottom (its `pb-20`), and pulling
  // the card up by only 56px leaves a ~24px gap below "Seminyak" while still
  // overlapping the photograph. The card-to-"About Us" spacing below is
  // unaffected — this only shifts the card relative to the hero.
  return (
    <div className="relative z-20 -mt-10 px-5 sm:px-8 md:-mt-14">
      <Container>
        <div className="overflow-hidden rounded-xl border border-primary/45 bg-ink shadow-[0_18px_48px_-22px_rgba(38,30,19,0.7)]">
          <div className="grid grid-cols-1 divide-y divide-white/12 lg:grid-cols-[1.6fr_1.25fr_1fr_auto] lg:items-stretch lg:divide-x lg:divide-y-0">
            {/* Dates — check-in and check-out share one field with a gold arrow
                between them, exactly as the live widget reads. */}
            <div className={cellClassName}>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className={labelClassName}>check in</span>
                  <span suppressHydrationWarning className={valueClassName}>
                    {dates.checkIn}
                  </span>
                </div>
                <ArrowIcon
                  aria-hidden
                  className="mt-3 h-4 w-4 shrink-0 text-primary"
                />
                <div className="flex flex-col gap-1">
                  <span className={labelClassName}>check out</span>
                  <span suppressHydrationWarning className={valueClassName}>
                    {dates.checkOut}
                  </span>
                </div>
              </div>
            </div>

            {/* Room — the live widget's `+` guest control, redrawn as a small
                gold mark. Static, like the rest of the fields; guests are set on
                the booking engine after Search. */}
            <div className={cellClassName}>
              <span className={labelClassName}>Room</span>
              <div className="flex items-center justify-between gap-3">
                <span className={valueClassName}>1 Room, 2 Adult, 0 Child</span>
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-primary/60 text-base leading-none text-primary"
                >
                  +
                </span>
              </div>
            </div>

            <div className={cellClassName}>
              <label htmlFor="promo-code" className={labelClassName}>
                PromoCode
              </label>
              <input
                id="promo-code"
                type="text"
                placeholder="Promo"
                className="w-full border-0 bg-transparent px-0 py-1 text-[15px] font-medium text-white outline-none placeholder:font-normal placeholder:text-white/35"
              />
            </div>

            {/* Primary action: a solid gold block with a forward arrow. On lg
                `items-stretch` fills it to the full field-row height, so it's a
                full-height slab of brand gold — the one bright element on the
                dark card. Hover deepens the gold (not to `ink`, which would make
                it vanish into the card) and switches the label to white. On
                mobile it's the full-width row that closes the card. */}
            <a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group/search flex items-center justify-center gap-2.5 bg-primary px-10 py-4 text-xs tracking-[0.22em] text-ink uppercase transition-colors duration-500 ease-out hover:bg-primary-deep hover:text-white"
            >
              Search
              <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-out group-hover/search:translate-x-1" />
            </a>
          </div>

          {/* Kept, but demoted: it modifies the search rather than being one of
              its fields, so it reads as a footnote to the card. */}
          <label className="flex cursor-pointer items-center gap-2.5 border-t border-white/12 px-6 py-2.5 text-[13px] text-white/70">
            <input type="checkbox" className="h-3.5 w-3.5 accent-primary" />
            Flexible Dates
          </label>
        </div>
      </Container>
    </div>
  );
}
