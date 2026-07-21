"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";

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
 * render, and returning a fresh object each time would loop forever — hence
 * the module-level values below rather than calling `computeDates()` inline.
 */
const SERVER_DATES = computeDates();
let clientDates: BookingDates | null = null;

// Nothing to subscribe to: the value is read once per page load, exactly as
// the live booking widget behaves.
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

const labelClassName = "text-eyebrow font-body text-primary-deep uppercase";
const cellClassName = "flex flex-col justify-center gap-1.5 px-6 py-4";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={cellClassName}>
      <span className={labelClassName}>{label}</span>
      {children}
    </div>
  );
}

/**
 * The availability search below the hero.
 *
 * **This was the single most dated element on the site.** A full-width dark
 * bar packed with white rectangular input boxes is the look of a third-party
 * booking engine dropped into a page circa 2012, and stacking it directly
 * under the hero created a hard three-band seam — photo, dark slab, white
 * section — right at the top of every page.
 *
 * It is now a card that *overlaps* the bottom edge of the hero. That single
 * change does three things at once: it removes the seam, it creates the only
 * real sense of depth on the page, and it makes the most conversion-critical
 * element on the site look like it belongs to the brand rather than to a
 * vendor. Fields are separated by hairlines instead of being drawn as boxes,
 * labels are small caps, and Search is a full-height block of brand gold.
 *
 * The fields, their labels and the behaviour are unchanged: this reproduces
 * the live widget's *appearance* (including check-in/out genuinely defaulting
 * to today/tomorrow) while Search links out to the real booking engine.
 */
export function BookingSearchBar({ bookingHref }: BookingSearchBarProps) {
  // See the note above the store functions. `suppressHydrationWarning` on the
  // two date spans covers the expected server/client difference on any day
  // after the build — it is the difference, not a bug.
  const dates = useSyncExternalStore(subscribe, getClientDates, getServerDates);

  return (
    <div className="relative z-20 -mt-12 px-5 sm:px-8 md:-mt-20">
      <Container>
        {/*
          The one shadow on the site. Elsewhere the design is deliberately flat,
          but a card that overlaps an image has to actually read as sitting in
          front of it — a warm, wide, very low-opacity cast in the brand's own
          ink rather than a generic grey drop shadow.
        */}
        <div className="border border-ink/10 bg-sand shadow-[0_24px_70px_-30px_rgba(38,30,19,0.55)]">
          {/*
            The five-across row waits until `lg`, not `md`. At exactly 768px the
            md variant gave each field about 120px — "1 Room, 2 Adult, 0 Child"
            wrapped to three lines and the promo input was too narrow to type
            in. Below 1024px the card is a clean vertical stack of four fields
            with a full-width Search, which is the better tablet layout anyway.
          */}
          <div className="grid grid-cols-1 divide-y divide-ink/10 lg:grid-cols-[1fr_1fr_1.35fr_1fr_auto] lg:divide-x lg:divide-y-0">
            <Field label="check in">
              <span suppressHydrationWarning className="text-[15px] text-ink">
                {dates.checkIn}
              </span>
            </Field>

            <Field label="check out">
              <span suppressHydrationWarning className="text-[15px] text-ink">
                {dates.checkOut}
              </span>
            </Field>

            {/* Static, not an interactive counter — the live widget's full
                guest/room logic needs an availability backend this project
                does not have. */}
            <Field label="Room">
              <span className="text-[15px] text-ink">1 Room, 2 Adult, 0 Child</span>
            </Field>

            <div className={cellClassName}>
              <label htmlFor="promo-code" className={labelClassName}>
                PromoCode
              </label>
              <input
                id="promo-code"
                type="text"
                placeholder="Promo"
                // `py-1.5` rather than `p-0`: as a bare text node the field was
                // only 23px tall, too shallow to reliably tap into on a phone.
                className="w-full border-0 bg-transparent px-0 py-1.5 text-[15px] text-ink outline-none placeholder:text-ink/35"
              />
            </div>

            <a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-primary px-10 py-4 text-xs tracking-[0.22em] text-ink uppercase transition-colors duration-500 ease-out hover:bg-ink hover:text-primary"
            >
              Search
            </a>
          </div>

          {/* Kept, but demoted: it modifies the search rather than being one of
              its fields, so it reads as a footnote to the card instead of
              competing with the dates for attention. */}
          <label className="flex cursor-pointer items-center gap-2.5 border-t border-ink/10 px-6 py-3 text-[13px] text-text">
            <input type="checkbox" className="h-3.5 w-3.5 accent-primary" />
            Flexible Dates
          </label>
        </div>
      </Container>
    </div>
  );
}
