"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PropertySite } from "@/data/properties";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ChevronIcon } from "@/components/ui/icons";

type PropertyHeaderProps = {
  site: PropertySite;
  /** The href of whichever nav item matches the page currently being viewed,
   * so the shared header knows which one to mark as current. */
  activeHref: string;
};

/**
 * The navigation bar shared by every property page.
 *
 * **Solid on every page, from the first pixel.** It used to float transparent
 * over the hero photograph and only take on a background once you scrolled
 * (an `overlay` prop, a scroll listener, and a brown scrim gradient to keep the
 * logo readable over foliage). That is gone: no state depends on scroll
 * position, the bar sits in normal flow as a `sticky` element, and the hero
 * begins underneath it rather than behind it.
 *
 * The reason is legibility, and it's the same reason the scrim existed at all.
 * A gold wordmark and letter-spaced white nav over a bright, high-detail
 * photograph is legible only as long as that particular photograph stays dark
 * behind that particular corner — and these heroes are a slideshow of live-site
 * images that can change. A solid `ink` bar makes the header's contrast a
 * property of the design rather than of whichever slide happens to be showing.
 *
 * `sticky` (not `fixed`) keeps it in the document flow, so no page needs a
 * spacer element to make up for a header that left it.
 *
 * A Client Component only because of the mobile menu's `useState`.
 */
export function PropertyHeader({ site, activeHref }: PropertyHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-[150] h-[68px] w-full bg-ink px-5 shadow-[0_10px_30px_-18px_rgba(38,30,19,0.55)] sm:px-8 lg:h-[72px]">
        {/*
          The old site's signature: a thin gold rule under the header. Kept as
          identity, reinterpreted for premium — not a flat edge-to-edge 2px line
          but a 1px gold gradient that's brightest at the centre and dissolves
          into nothing at both edges, so it reads as a drawn accent rather than a
          border. With the bar now solid it's doing the job it was always best
          at: separating the header from whatever follows it, warmly, without a
          hard line. The soft shadow adds the barely-there depth.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
        />

        <Container className="relative flex h-full items-center justify-between gap-6">
          <Link href={`/${site.slug}`} className="relative h-[46px] w-[128px] shrink-0">
            {/* Enlarged from 104px. The logo is a fine gold wordmark and read
                faint at the old size on the dark bar; keeping it larger is what
                makes it legible without touching the (hotlinked) asset. */}
            <Image
              src={site.logoSrc}
              alt={`Nyuh Bali Villas - ${site.label}`}
              fill
              sizes="128px"
              className="object-contain object-left"
              priority
            />
          </Link>

          {/*
            Appears at `lg`, not `md`. These navs carry 7 (Seminyak) or 8
            (Ubud) letter-spaced items which, alongside the logo and the Book
            Now button, simply do not fit a 768px tablet — the original build
            confirmed this caused ~75px of horizontal page scroll. The
            hamburger covers everything below 1024px.
          */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {site.navItems.map((item) => {
                const isActive = item.href === activeHref;

                // Inactive items were `text-white/50` on the old design —
                // dimming *everything except* the current page is backwards,
                // and at 50% on a photograph it was barely legible. The
                // current page is now marked by a gold rule instead, which
                // lets every other item stay readable at 75%.
                const labelClassName = `relative block py-1 text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  isActive ? "text-white" : "text-white/75"
                }`;

                // The gold rule marks the current page, and on real links it
                // also sweeps out from the left on hover. Inert items get the
                // static version only — no hover treatment, so a
                // non-clickable label never hints that it is interactive.
                const marker = (
                  <span
                    aria-hidden
                    className={`absolute -bottom-1 left-0 block h-px bg-primary transition-all duration-500 ease-out ${
                      isActive
                        ? "w-full"
                        : item.inScope
                          ? "w-0 group-hover/nav:w-full"
                          : "w-0"
                    }`}
                  />
                );

                return (
                  // `group/item` scopes the dropdown's open state to this one
                  // entry. Opening is pure CSS — hover for a mouse,
                  // `focus-within` for a keyboard — so the submenu needs no
                  // React state and stays available if hydration is slow.
                  <li key={item.label} className="group/item relative">
                    {item.inScope ? (
                      <Link
                        href={item.href}
                        className={`group/nav ${labelClassName} flex items-center gap-1.5 hover:text-white`}
                      >
                        {item.label}
                        {item.children?.length ? (
                          <ChevronIcon
                            aria-hidden
                            className="h-2.5 w-2.5 rotate-90 text-primary transition-transform duration-300 group-hover/item:-rotate-90"
                          />
                        ) : null}
                        {marker}
                      </Link>
                    ) : (
                      <span className={labelClassName}>
                        {item.label}
                        {marker}
                      </span>
                    )}

                    {item.children?.length ? (
                      // `top-full` + `pt-4` means the gap between the bar and
                      // the panel is the panel's own padding, so the pointer
                      // never crosses dead space on its way down and the menu
                      // can't flicker shut mid-travel.
                      <div className="invisible absolute top-full left-0 z-10 pt-4 opacity-0 transition-opacity duration-300 group-focus-within/item:visible group-focus-within/item:opacity-100 group-hover/item:visible group-hover/item:opacity-100">
                        <ul className="min-w-[212px] border-t border-primary/50 bg-ink py-2 shadow-[0_18px_40px_-20px_rgba(0,0,0,0.75)]">
                          {item.children.map((child) => {
                            const childClassName =
                              "block px-5 py-2.5 text-[11px] tracking-[0.2em] text-white/75 uppercase transition-colors duration-300 hover:bg-white/5 hover:text-primary";

                            return (
                              <li key={child.label}>
                                {child.external ? (
                                  <a
                                    href={child.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={childClassName}
                                  >
                                    {child.label}
                                  </a>
                                ) : child.inScope ? (
                                  <Link href={child.href} className={childClassName}>
                                    {child.label}
                                  </Link>
                                ) : (
                                  <span className="block px-5 py-2.5 text-[11px] tracking-[0.2em] text-white/40 uppercase">
                                    {child.label}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-5">
            {/*
              The old header had no booking CTA at all — the site's primary
              conversion action was absent from its most persistent surface,
              delegated instead to a dismissible promo card floating in the
              corner. It belongs here, visible on every page and every scroll
              position.
            */}
            {/*
              Hidden below `sm` on a WRAPPER, not on the Button itself. The
              button used to carry `hidden sm:inline-flex` directly, and it
              never worked: `buttonClassName` hardcodes `inline-flex`, so the
              element had two competing `display` utilities and Tailwind's own
              stylesheet order — not the class attribute's order — decided that
              `inline-flex` won. The CTA therefore rendered on every phone, and
              logo + CTA + hamburger overflowed a 360px viewport by 17px. A
              wrapper has no display utility of its own to lose to.

              Phones aren't losing the booking action: `DirectBookingDeals`
              docks it to the bottom of the screen at exactly these widths.
            */}
            <span className="hidden sm:block">
              <Button href={site.bookingHref} external size="sm">
                Book Now
              </Button>
            </span>

            {/* 44×44 hit area with a 24px visual mark. The bars used to be the
                button, which made the primary navigation control on mobile
                exactly 24×24 — the bare WCAG minimum and well under what a
                thumb actually wants. The negative margin pulls the enlarged box
                outward so the visible *mark* still lines up with the container
                edge; it is exactly half the difference between the box and the
                mark ((44 − 24) / 2 = 10px), so the box lands inside the
                header's own 20px padding instead of past it. It was -12px,
                which overhung the mark by 2px and spent more of that padding
                than it needed to. */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="-mr-2.5 flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span className="block h-px w-6 bg-primary" />
              <span className="block h-px w-6 bg-primary" />
              <span className="block h-px w-6 bg-primary" />
            </button>
          </div>
        </Container>
      </header>

      <MobileNavOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={site.navItems}
        bookingHref={site.bookingHref}
      />
    </>
  );
}
