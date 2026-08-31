"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { ArrowIcon } from "@/components/ui/icons";

type BookingSearchBarProps = {
  bookingHref: string;
};

/** ISO (`yyyy-mm-dd`) — the value format `<input type="date">` requires, and
 * the format the live site's own booking form posts to the same engine. */
type BookingDates = { checkIn: string; checkOut: string };

function toIso(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** `yyyy-mm-dd` + n days, without touching `Date` parsing rules — the string is
 * split and rebuilt so a timezone can never shift the day by one. */
function addDays(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  return toIso(date);
}

/**
 * Append the search to `bookingHref` **inside its fragment**, not as a query
 * string.
 *
 * This is the whole trick, and getting it wrong is silent. The booking engine
 * (STAAH SwiftBook) is a hash-routed SPA: its address is
 * `…/inst/#home?propertyId=…&JDRN=Y`, and it reads its parameters out of that
 * fragment. A plain `<form method="GET">` — which is what the live site's own
 * booking form uses — puts the fields in the *query* instead, before the `#`,
 * where the app never looks: measured against the live engine, dates sent that
 * way left it sitting on its own today/tomorrow defaults. Appended to the
 * fragment, the same `checkIn`/`checkOut` land in its date fields.
 *
 * Only the dates are honoured. `promoCode` and every guest-count spelling
 * tried against the engine (`adult`/`adults`/`noOfAdults`, `room`/`rooms`,
 * `child`, `promo`/`promocode`/`couponCode`) were ignored, so those stay
 * local to this card — see the component note below. `promoCode` and
 * `currency` are still sent because the live site sends them and they cost
 * nothing if the engine starts reading them.
 */
function bookingUrl(bookingHref: string, params: Record<string, string>) {
  const query = new URLSearchParams(params).toString();
  if (!query) return bookingHref;

  const [path, fragment] = bookingHref.split("#");
  if (!fragment) return `${path}?${query}`;
  return `${path}#${fragment}${fragment.includes("?") ? "&" : "?"}${query}`;
}

function computeDates(): BookingDates {
  const today = new Date();
  const checkIn = toIso(today);
  return { checkIn, checkOut: addDays(checkIn, 1) };
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

// `primary-deep`, not `primary`: these labels are small gold text and the card
// is now a light surface, where full-strength gold measures 2.39:1. See the
// contrast note on `primary-deep` in globals.css.
const labelClassName = "text-eyebrow font-body text-primary-deep uppercase";
// Compact cell: a tight label→value gap and modest vertical padding keep the
// whole widget shorter than the earlier `py-4` version without crowding.
const cellClassName = "flex flex-col justify-center gap-1 px-6 py-3.5";
const valueClassName = "text-[15px] font-medium text-ink";
// The date fields have to read as the plain values they replaced, not as form
// controls: no border, no background, the card's own type. The arbitrary
// variant tints the native picker button gold-brown instead of browser blue.
const dateInputClassName =
  `${valueClassName} w-[8.5rem] cursor-pointer border-0 bg-transparent p-0 outline-none ` +
  "focus-visible:underline focus-visible:decoration-primary focus-visible:underline-offset-4 " +
  "disabled:cursor-not-allowed disabled:text-ink/35 " +
  "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-50 " +
  "[&::-webkit-calendar-picker-indicator]:hover:opacity-100";

/** One row of the guest popover. */
function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) {
  const buttonClassName =
    "flex h-7 w-7 shrink-0 items-center justify-center border border-primary-deep/50 text-base leading-none text-primary-deep transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-ink disabled:cursor-not-allowed disabled:border-ink/15 disabled:text-ink/25 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-[14px] font-light text-text">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label={`Fewer ${label.toLowerCase()}`}
          className={buttonClassName}
        >
          −
        </button>
        {/* `tabular-nums` so the row doesn't jitter as the digit changes. */}
        <span className="w-4 text-center text-[15px] font-medium tabular-nums text-ink">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`More ${label.toLowerCase()}`}
          className={buttonClassName}
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * The availability search that docks over the hero's bottom edge.
 *
 * **A modern reinterpretation of the live site's booking widget.** The original
 * is the DNA — check-in → check-out with an arrow between them, a room summary
 * with a `+` guest control, a promo field, a gold Search — and this keeps every
 * one of those cues so a returning visitor recognises it. What changes is the
 * execution: instead of flat white boxes floating on a dark bar (the 2012
 * booking-engine look), it's one cream card *framed* by the brand's dark brown —
 * a thick `ink` border rather than a filled `ink` panel, which keeps the brown in
 * the composition as structure instead of as mass, and stops the widget reading
 * as a third dark slab between the hero and the page. Hairlines separate the
 * fields, and the `+` and the arrow are drawn as small refined marks rather than
 * heavy UI controls.
 *
 * Colour on a light card follows the site's contrast rule: `primary-deep` for
 * the small gold text and marks, `ink` for the values. The Search block is the
 * one thing that keeps full-strength brand gold — it's a fill, not text, so it
 * measures fine, and it stays the single brightest element on the card.
 *
 * **It is a real form now.** This used to be a picture of a booking widget —
 * static text where the dates should be, an inert `+`, a promo box wired to
 * nothing and a Search link that dropped you on the booking engine's own blank
 * search. Search now carries the chosen dates onto the engine, which arrives
 * already showing them; see `bookingUrl` for why they have to go in the
 * fragment rather than the query string.
 *
 * Two things are deliberately still local to this card, because the engine
 * **ignores them however they are passed** — this was tested against it, not
 * assumed:
 *
 *  - **The guest stepper** sets the summary line, and the count is then chosen
 *    again on the booking engine. It is interactive rather than decorative
 *    because an inert `+` invites a click that does nothing.
 *  - **PromoCode** is still submitted (the live site submits it too) but the
 *    engine does not prefill its own promo box from it.
 *
 * **Flexible Dates** disables the two date fields, so the search goes without
 * them and the engine opens on its own calendar — which is what "I don't have
 * fixed dates yet" should do.
 */
export function BookingSearchBar({ bookingHref }: BookingSearchBarProps) {
  const defaults = useSyncExternalStore(
    subscribe,
    getClientDates,
    getServerDates,
  );
  // `null` until the visitor edits something, so the fields keep following the
  // store — that is what lets the build-time date be replaced by the real one
  // at hydration without an effect writing state.
  const [picked, setPicked] = useState<BookingDates | null>(null);
  const [flexible, setFlexible] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const dates = picked ?? defaults;
  const ids = useId();
  const checkInId = `${ids}-check-in`;
  const checkOutId = `${ids}-check-out`;
  const promoId = `${ids}-promo`;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const promoCode = String(
      new FormData(event.currentTarget).get("promoCode") ?? "",
    ).trim();

    window.open(
      bookingUrl(bookingHref, {
        currency: "IDR",
        // Flexible Dates means "I have no fixed dates yet", so the engine
        // should open on its own calendar rather than on ours.
        ...(flexible
          ? {}
          : { checkIn: dates.checkIn, checkOut: dates.checkOut }),
        ...(promoCode ? { promoCode } : {}),
      }),
      "_blank",
      "noopener,noreferrer",
    );
  }

  function setCheckIn(value: string) {
    // Check-out has to stay after check-in; pushing it out by a night is what
    // every booking form does and it beats submitting an invalid range.
    const checkOut =
      value && dates.checkOut <= value ? addDays(value, 1) : dates.checkOut;
    setPicked({ checkIn: value, checkOut });
  }

  const guestSummary = `${rooms} Room, ${adults} Adult, ${children} Child`;

  // The negative top margin lifts the card up over the hero's bottom edge.
  // Eased off from -mt-20 → -mt-14 so the card no longer touches the hero title:
  // the title lockup sits ~80px off the hero's bottom (its `pb-20`), and pulling
  // the card up by only 56px leaves a ~24px gap below "Seminyak" while still
  // overlapping the photograph. The card-to-"About Us" spacing below is
  // unaffected — this only shifts the card relative to the hero.
  return (
    <div className="relative z-20 -mt-10 px-5 sm:px-8 md:-mt-14">
      <Container>
        {/* `target="_blank"`: the engine is a separate product, and a visitor
            part-way through reading a villa page should not lose it. */}
        <form
          action={bookingHref}
          method="GET"
          target="_blank"
          onSubmit={handleSubmit}
          className="rounded-none border-[3px] border-ink bg-sand-deep shadow-[0_18px_48px_-22px_rgba(38,30,19,0.7)]"
        >
          {/* `action`/`method` are the no-JavaScript fallback — they land on
              the engine's own search, which is where the Search button used to
              go anyway. With JS, `handleSubmit` builds the fragment URL that
              actually carries the dates across. */}
          <input type="hidden" name="currency" value="IDR" />

          <div className="grid grid-cols-1 divide-y divide-ink/15 lg:grid-cols-[1.6fr_1.25fr_1fr_auto] lg:items-stretch lg:divide-x lg:divide-y-0">
            {/* Dates — check-in and check-out share one field with a gold arrow
                between them, exactly as the live widget reads. Native date
                inputs rather than a hand-built calendar: they are keyboard
                operable and screen-reader labelled for free, they bring the
                platform's own picker (including the phone's), and they post the
                `yyyy-mm-dd` the engine expects. */}
            <div className={cellClassName}>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor={checkInId} className={labelClassName}>
                    check in
                  </label>
                  <input
                    id={checkInId}
                    name="checkIn"
                    type="date"
                    suppressHydrationWarning
                    value={dates.checkIn}
                    min={defaults.checkIn}
                    disabled={flexible}
                    onChange={(event) => setCheckIn(event.target.value)}
                    className={dateInputClassName}
                  />
                </div>
                <ArrowIcon
                  aria-hidden
                  className="mt-3 h-4 w-4 shrink-0 text-primary-deep"
                />
                <div className="flex flex-col gap-1">
                  <label htmlFor={checkOutId} className={labelClassName}>
                    check out
                  </label>
                  <input
                    id={checkOutId}
                    name="checkOut"
                    type="date"
                    suppressHydrationWarning
                    value={dates.checkOut}
                    min={addDays(dates.checkIn, 1)}
                    disabled={flexible}
                    onChange={(event) =>
                      setPicked({
                        checkIn: dates.checkIn,
                        checkOut: event.target.value,
                      })
                    }
                    className={dateInputClassName}
                  />
                </div>
              </div>
            </div>

            {/* Room — the live widget's `+` guest control. `<details>` rather
                than a JS popover: it opens without a click-outside listener,
                is keyboard operable, and matches the disclosure pattern the
                FAQ and treatment lists already use. */}
            <details className="group/guests relative flex flex-col justify-center px-6 py-3.5">
              <summary className="flex cursor-pointer list-none flex-col gap-1 [&::-webkit-details-marker]:hidden">
                <span className={labelClassName}>Room</span>
                <span className="flex items-center justify-between gap-3">
                  <span className={valueClassName}>{guestSummary}</span>
                  <span
                    aria-hidden
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-none border border-primary-deep/50 text-base leading-none text-primary-deep transition-transform duration-300 group-open/guests:rotate-45"
                  >
                    +
                  </span>
                </span>
              </summary>

              {/* Above the page, below the header: the card already sits at
                  z-20 over the hero, and this only has to clear the band under
                  it. */}
              <div className="absolute top-full right-0 left-0 z-30 flex flex-col gap-3 border-[3px] border-t-0 border-ink bg-sand-deep px-6 py-4 shadow-[0_18px_48px_-22px_rgba(38,30,19,0.7)]">
                <Stepper label="Room" value={rooms} min={1} max={5} onChange={setRooms} />
                <Stepper label="Adult" value={adults} min={1} max={10} onChange={setAdults} />
                <Stepper label="Child" value={children} min={0} max={10} onChange={setChildren} />
              </div>
            </details>

            <div className={cellClassName}>
              <label htmlFor={promoId} className={labelClassName}>
                PromoCode
              </label>
              <input
                id={promoId}
                name="promoCode"
                type="text"
                placeholder="Promo"
                className="w-full border-0 bg-transparent px-0 py-1 text-[15px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink/40"
              />
            </div>

            {/* Primary action: unchanged when the card went from ink to cream —
                a solid block of full-strength brand gold with a forward arrow,
                stretched by `items-stretch` to the full field-row height on lg.
                It's the only saturated area on the card either way, so it stays
                the obvious action. Hover deepens the gold and switches the label
                to white rather than flipping to a third colour. On mobile it's
                the full-width row that closes the card. */}
            <button
              type="submit"
              className="group/search flex items-center justify-center gap-2.5 bg-primary px-10 py-4 text-xs tracking-[0.22em] text-ink uppercase transition-colors duration-500 ease-out hover:bg-primary-deep hover:text-white"
            >
              Search
              <ArrowIcon className="h-4 w-4 transition-transform duration-500 ease-out group-hover/search:translate-x-1" />
            </button>
          </div>

          {/* Kept, but demoted: it modifies the search rather than being one of
              its fields, so it reads as a footnote to the card. Checking it
              disables the two date inputs, which drops them from the submitted
              query — the engine then opens on its own calendar. */}
          <label className="flex cursor-pointer items-center gap-2.5 border-t border-ink/15 px-6 py-2.5 text-[13px] text-text">
            <input
              type="checkbox"
              checked={flexible}
              onChange={(event) => setFlexible(event.target.checked)}
              className="h-3.5 w-3.5 accent-primary-deep"
            />
            Flexible Dates
          </label>
        </form>
      </Container>
    </div>
  );
}
