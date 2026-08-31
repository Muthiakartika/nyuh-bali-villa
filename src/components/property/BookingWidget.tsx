"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { BookingSearchBar } from "@/components/property/BookingSearchBar";
import type { PropertySite } from "@/data/properties";

type BookingWidgetProps = {
  site: PropertySite;
};

const LOADER_SRC =
  "https://booking.nyuhbalivillas.com/plugin/js/booking-service.min.js";

/** How long to wait for the vendor widget before showing our own bar instead.
 * The loader polls for its container every 100ms and then pulls a second
 * script and two stylesheets from `settings.swiftbook.io`, so a few seconds is
 * normal on a cold cache; past this it isn't coming. */
const FALLBACK_AFTER_MS = 7000;

/**
 * The property's real booking widget, embedded the way the live site embeds it.
 *
 * **Why the vendor's widget rather than our own bar.** Ours could carry the
 * dates across and nothing else: measured against the engine, it ignores
 * `promoCode` and every guest-count spelling there is, and it has no deep link
 * at all for the thing that actually sells a room — the availability calendar,
 * with a nightly rate on every date and the sold-out days greyed out. That
 * calendar is generated from live inventory; there is no way to reproduce it
 * from this codebase, and a booking bar that can't show a price or a vacancy is
 * a form, not a booking bar. So this mounts the engine's own widget, exactly as
 * `nyuhbalivillas.com` does:
 *
 * ```html
 * <div id="quickbook-widget"></div>
 * <script id="propInfo" src="…/booking-service.min.js"
 *         propertyid="…" cal-rendererId="quickbook-widget" JDRN="Y"></script>
 * ```
 *
 * **The DOM here is not React's.** That loader waits for `#quickbook-widget`
 * and then calls `replaceWith` on it *and* on its own `<script>` — nodes React
 * thinks it owns would be swapped out underneath it, which is how you get a
 * `removeChild` crash on the next render. So the wrapper below renders empty
 * and everything inside it is created imperatively; React never reconciles a
 * child of it.
 *
 * **`BookingSearchBar` is still here, as the fallback.** If the vendor script
 * is blocked or slow, the primary call to action on the page would otherwise be
 * an empty strip — so our own bar takes over after `FALLBACK_AFTER_MS`. It
 * carries the dates to the engine on its own (see that file), so the fallback
 * is a working booking bar, not a placeholder.
 */
export function BookingWidget({ site }: BookingWidgetProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Strict Mode runs effects twice in development; a second `#propInfo`
    // would have the loader race itself over one container.
    if (host.childElementCount > 0) return;

    const mount = document.createElement("div");
    mount.id = "quickbook-widget";
    host.append(mount);

    const script = document.createElement("script");
    script.id = "propInfo";
    script.src = LOADER_SRC;
    // The loader reads these off its own tag, so they have to be real
    // attributes rather than dataset entries.
    script.setAttribute("propertyid", site.bookingWidgetId);
    script.setAttribute("cal-rendererId", "quickbook-widget");
    script.setAttribute("JDRN", "Y");
    host.append(script);

    // The loader renames the container to `quickbook-widget-<id>-<id>`, so its
    // presence — with content — is the signal that the widget really rendered
    // rather than merely that the script tag was appended.
    const timer = window.setTimeout(() => {
      const rendered = host.querySelector('[id^="quickbook-widget-"]');
      if (!rendered || rendered.childElementCount === 0) setFailed(true);
    }, FALLBACK_AFTER_MS);

    return () => window.clearTimeout(timer);
  }, [site.bookingWidgetId]);

  if (failed) return <BookingSearchBar bookingHref={site.bookingHref} />;

  return (
    // Same overlap and gutters as the bar it replaces, so the widget docks over
    // the hero's bottom edge exactly where the card used to sit.
    <div className="relative z-20 -mt-10 px-5 sm:px-8 md:-mt-14">
      <Container>
        {/* `booking-widget` is the hook the brand skin in globals.css hangs
            off — see the block at the bottom of that file for what it
            overrides and why it is scoped this tightly.

            `min-h` reserves the widget's measured height at each breakpoint —
            345px stacked, 142px at `md`, 126px once it goes to one row — so
            the band below it does not jump upward for the second or two before
            the widget paints. These are the *skinned* heights; re-measure them
            after any change to the skin or to the vendor's own layout. */}
        <div
          ref={hostRef}
          className="booking-widget min-h-[21.5rem] md:min-h-[9rem] lg:min-h-[8rem]"
        />
      </Container>
    </div>
  );
}
