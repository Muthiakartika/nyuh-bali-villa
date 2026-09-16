import { priceFromOption, type SpaPricing } from "@/data/spa-reservations";

/**
 * The running total the two spa forms show beside their treatment list.
 *
 * It reproduces the live site's own panel: the chosen treatments listed with
 * their duration and price, then Price / Tax and Service / Discount / TOTAL
 * PRICE. The arithmetic is read off the live `updateReview()` and every price
 * is checked against the `data-price` the live markup carries — see
 * `SPA_RESERVATION_PRICING`, which also explains why the two forms differ.
 *
 * **Presentational.** `InquiryForm` owns the selection and hands it down, so
 * this stays a plain function of its props and the form stays uncontrolled —
 * the fields are still read with `FormData` on submit, exactly as before.
 */
export type ReservationTotals = {
  items: { label: string; duration: string; price: number }[];
  subtotal: number;
  tax: number;
  discount: number;
  payable: number;
};

/** Indonesian grouping — 1.350.000, the way every price on this site is set. */
function idr(amount: number): string {
  // `|| 0` collapses negative zero: the discount row is `-0` before anything
  // is ticked, and `(-0).toLocaleString()` prints "-0".
  return "IDR " + (Math.round(amount) || 0).toLocaleString("id-ID");
}

/**
 * An option label is one long string: the treatment name, then its
 * description, then the duration and price. Everything before the duration is
 * taken as the label and the row clamps it to two lines.
 *
 * **No attempt is made to separate the name from the description**, and an
 * earlier version that tried is why. It cut at the first capitalised word, so
 * "Honeymoon Enjoyment Package" appeared as "Honeymoon" and "Cleopatra's Rose
 * Ritual" as "Cleopatra's" — a guest reading a total for a treatment whose
 * name has been silently truncated. The live form separates them because its
 * markup has a `.package-name` element to read; this data is one string, and
 * showing a little too much is better than confidently showing the wrong
 * thing.
 */
function splitOption(option: string): { label: string; duration: string } {
  const match = /(\d+\s*mins)/i.exec(option);
  if (!match) return { label: option.trim(), duration: "" };
  return {
    label: option.slice(0, match.index).trim(),
    duration: match[1].replace(/\s+/g, " "),
  };
}

export function computeTotals(
  selected: string[],
  pricing: SpaPricing,
): ReservationTotals {
  const items = selected.map((option) => {
    const { label, duration } = splitOption(option);
    return { label, duration, price: priceFromOption(option) };
  });
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = (pricing.taxPercent / 100) * subtotal;
  const total = subtotal + tax;
  const discount = (pricing.discountPercent / 100) * total;
  return { items, subtotal, tax, discount, payable: total - discount };
}

export function ReservationReview({
  totals,
  pricing,
}: {
  totals: ReservationTotals;
  pricing: SpaPricing;
}) {
  const row = "flex items-baseline justify-between gap-4";
  return (
    // `aria-live` because the figures change as boxes are ticked and nothing
    // else announces it; `polite` so it waits for a pause rather than cutting
    // across the label the visitor just checked.
    <section
      aria-live="polite"
      className="mt-10 border border-ink/15 bg-sand-deep p-5 md:p-6"
    >
      <h3 className="font-heading text-[20px] leading-tight font-light text-ink md:text-[23px]">
        Reservation Review
      </h3>
      <span aria-hidden className="mt-4 block h-px w-12 bg-primary" />

      {totals.items.length ? (
        <ul className="mt-5 flex flex-col divide-y divide-ink/10 border-y border-ink/10">
          {totals.items.map((item, index) => (
            <li key={index} className={`${row} py-2.5`}>
              <span className="text-[15px] leading-snug font-light text-ink">
                <span className="line-clamp-2">{item.label}</span>
                {item.duration ? (
                  <span className="block text-[13px] text-text">{item.duration}</span>
                ) : null}
              </span>
              <span className="shrink-0 text-[15px] font-light whitespace-nowrap text-text">
                {idr(item.price)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 text-[15px] leading-relaxed font-light text-text">
          Choose your treatments above and the total appears here.
        </p>
      )}

      <dl className="mt-5 flex flex-col gap-2">
        {[
          ["Price", totals.subtotal],
          [`Tax and Service`, totals.tax],
          [pricing.note ? "Discount*" : "Discount", -totals.discount],
        ].map(([label, value]) => (
          <div key={label as string} className={row}>
            <dt className="text-[15px] font-light text-text">{label}</dt>
            <dd className="text-[15px] font-light whitespace-nowrap text-text">
              {idr(value as number)}
            </dd>
          </div>
        ))}
        <div className={`${row} border-t border-ink/15 pt-3`}>
          <dt className="text-eyebrow font-body text-primary-deep uppercase">Total price</dt>
          <dd className="font-heading text-[22px] leading-none font-light whitespace-nowrap text-ink md:text-[26px]">
            {idr(totals.payable)}
          </dd>
        </div>
      </dl>

      {pricing.note ? (
        <p className="mt-4 text-[13px] leading-relaxed font-light text-text">
          *{pricing.note}
        </p>
      ) : null}
    </section>
  );
}
