import { DirectBookingDealsBar } from "@/components/property/DirectBookingDealsBar";
import { getDirectBookingDeal } from "@/sanity/lib/content";

type DirectBookingDealsProps = {
  bookingHref: string;
  /** Overrides for the one page that sets its own — `dealsSection`. */
  headline?: string;
  code?: string;
  buttonLabel?: string;
};

/**
 * The site-wide direct-booking promo, with its wording resolved from the CMS.
 *
 * A thin server component in front of the client bar that actually draws it.
 * The split exists because the bar needs `useState` to be dismissible and a
 * client component cannot read Sanity — so this reads, and it renders. Every
 * route already imports `DirectBookingDeals` from this path, so nothing at a
 * call site changed when the wording moved.
 *
 * Unpublished or unconfigured it resolves to exactly the three literals the
 * bar used to hold, which is why the rendered bar is unchanged.
 */
export async function DirectBookingDeals({
  bookingHref,
  headline,
  code,
  buttonLabel,
}: DirectBookingDealsProps) {
  const deal = await getDirectBookingDeal();
  return (
    <DirectBookingDealsBar
      bookingHref={bookingHref}
      headline={headline || deal.headline}
      code={code ?? deal.code}
      buttonLabel={buttonLabel || deal.buttonLabel}
      // Not content: it is the accessible name of a close button, which is
      // structural UI rather than anything a client would want to reword.
      dismissLabel="Dismiss"
    />
  );
}
