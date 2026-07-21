"use client";

import { useSyncExternalStore, type ReactNode } from "react";
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
 * These pages are statically generated, so "today" baked into the HTML is
 * whatever day the site was *built* — it would sit there showing a stale date
 * forever. The dates therefore have to be recomputed in the browser.
 *
 * `useSyncExternalStore` is the right tool rather than `useState` + `useEffect`:
 * it exists to describe a value that legitimately differs between server and
 * client, and it re-renders once after hydration without a setState inside an
 * effect (which React's lint rules flag as a cascading render).
 *
 * Both snapshots must be referentially stable — `getSnapshot` runs on every
 * render and returning a fresh object each time would loop forever.
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-4 md:px-6">
      <span className="text-caption text-on-dark-muted">{label}</span>
      {children}
    </div>
  );
}

/**
 * The availability search that docks under the hero.
 *
 * In the reference composition this is a dark strip fused to the bottom of the
 * hero block — labels above values, no boxed inputs, and a single pill action
 * at the end. That is what this reproduces: it continues the hero's dark ground
 * rather than introducing a third band, which is what made the previous
 * photo → slab → section sequence read as three hard seams.
 *
 * Behaviour is unchanged and deliberately simplified: this reproduces the live
 * widget's *appearance* (including check-in/out genuinely defaulting to
 * today/tomorrow) while Search links out to the real booking engine, which is
 * the only thing that can check availability.
 */
export function BookingSearchBar({ bookingHref }: BookingSearchBarProps) {
  // `suppressHydrationWarning` on the two date values covers the expected
  // server/client difference on any day after the build — it is the difference,
  // not a bug.
  const dates = useSyncExternalStore(subscribe, getClientDates, getServerDates);

  return (
    <div className="bg-primary px-5 pb-8 sm:px-8">
      <Container>
        <div className="grid grid-cols-1 divide-y divide-white/10 rounded-xl border border-white/10 lg:grid-cols-[1fr_1fr_1.4fr_1fr_auto] lg:items-center lg:divide-x lg:divide-y-0">
          <Field label="Check in">
            <span suppressHydrationWarning className="text-body font-medium text-on-dark">
              {dates.checkIn}
            </span>
          </Field>

          <Field label="Check out">
            <span suppressHydrationWarning className="text-body font-medium text-on-dark">
              {dates.checkOut}
            </span>
          </Field>

          {/* Static, not an interactive counter — the live widget's full
              guest/room logic needs an availability backend this project does
              not have. */}
          <Field label="Room">
            <span className="text-body font-medium text-on-dark">
              1 Room, 2 Adult, 0 Child
            </span>
          </Field>

          <div className="flex flex-col gap-1.5 px-5 py-4 md:px-6">
            <label htmlFor="promo-code" className="text-caption text-on-dark-muted">
              PromoCode
            </label>
            <input
              id="promo-code"
              type="text"
              placeholder="Promo"
              className="w-full border-0 bg-transparent p-0 text-body font-medium text-on-dark outline-none placeholder:font-normal placeholder:text-on-dark-muted"
            />
          </div>

          <div className="p-4 lg:pr-4 lg:pl-6">
            {/* Gold pill: the emphasis variant, and the only one of the
                documented button styles that reads on the brand's brown bar. */}
            <a
              href={bookingHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-body-sm font-medium text-primary transition-colors duration-200 active:bg-accent-deep lg:w-auto"
            >
              Search
              <ArrowIcon className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Kept, but demoted: it modifies the search rather than being one of
            its fields. */}
        <label className="mt-4 flex w-fit cursor-pointer items-center gap-2.5 text-body-sm text-on-dark-muted">
          <input type="checkbox" className="h-4 w-4 accent-primary" />
          Flexible Dates
        </label>
      </Container>
    </div>
  );
}
