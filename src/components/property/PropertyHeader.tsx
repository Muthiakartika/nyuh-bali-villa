"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PropertySite } from "@/data/properties";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

type PropertyHeaderProps = {
  site: PropertySite;
  /** The href of whichever nav item matches the page currently being viewed,
   * so the shared header knows which one to mark as current. */
  activeHref: string;
  /**
   * True on pages that open with a full-bleed hero image (both About pages).
   * The header then floats *over* that image and only takes on a background
   * once the visitor scrolls. Pages with no hero (Contact, the legal pages)
   * pass false and get a solid bar from the first pixel, because a
   * transparent header over a plain surface is just invisible.
   */
  overlay?: boolean;
};

export function PropertyHeader({
  site,
  activeHref,
  overlay = false,
}: PropertyHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // A solid header has nothing to react to, so the listener is never
    // attached on Contact/legal pages.
    if (!overlay) return;

    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    // Called once up front: a browser restoring a previous scroll position on
    // reload would otherwise leave the header transparent halfway down the page.
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [overlay]);

  const isSolid = !overlay || isScrolled;

  return (
    <>
      {/*
        `fixed` only for the overlay variant — it has to sit on top of the hero
        rather than above it in the flow. The solid variant stays `sticky`,
        which keeps it in normal flow and means no page needs a spacer element
        to make up for a header that left the document.

        The height change is the whole effect: the header opens tall and
        weightless over the photograph, then compacts into a working navigation
        bar as soon as you start reading. Same transition every luxury
        hospitality site uses, and it buys back ~28px of hero.
      */}
      <header
        className={`z-[150] w-full px-5 transition-[background-color,height,box-shadow] duration-500 ease-out sm:px-8 ${
          overlay ? "fixed inset-x-0 top-0" : "sticky top-0"
        } ${
          isSolid
            ? "h-[68px] bg-ink shadow-[0_10px_30px_-18px_rgba(38,30,19,0.55)] lg:h-[72px]"
            : "h-[84px] bg-transparent lg:h-[104px]"
        }`}
      >
        {/*
          Over foliage photography the fully transparent bar left the gold logo
          and white nav hard to read. Rather than a frosted-glass panel (a
          decorative default this design avoids), the at-hero state gets a
          brown scrim gradient in the brand's own `ink` — dark at the top edge,
          fading to nothing by the foot of the bar. It fades out (opacity)
          exactly as the solid `bg-ink` fades in on scroll, so the two states
          cross-dissolve rather than snap. `pointer-events-none` keeps it clear
          of the logo, nav and Book Now clicks underneath.
        */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/90 via-ink/45 to-transparent transition-opacity duration-500 ease-out ${
            isSolid ? "opacity-0" : "opacity-100"
          }`}
        />

        {/*
          The old site's signature: a thin gold rule under the header. Kept as
          identity, reinterpreted for premium — not a flat edge-to-edge 2px line
          but a 1px gold gradient that's brightest at the centre and dissolves
          into nothing at both edges, so it reads as a drawn accent rather than a
          border. It's persistent in both states (over the photo at the hero,
          over the solid bar once scrolled), which is what keeps the header from
          ever looking like it's floating with no separator. The soft shadow on
          the solid state (above) adds the barely-there depth; together they
          separate header from content without a hard line.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
        />

        <Container className="relative flex h-full items-center justify-between gap-6">
          <Link
            href={`/${site.slug}`}
            className={`relative shrink-0 transition-all duration-500 ease-out ${
              isSolid ? "h-[46px] w-[128px]" : "h-[56px] w-[154px]"
            }`}
          >
            {/* Enlarged from 104/126px. The logo is a fine gold wordmark, and at
                the old scrolled size it read faint on the dark bar; keeping it
                larger — and shrinking it less on scroll — is what makes it
                legible without touching the (hotlinked) asset. */}
            <Image
              src={site.logoSrc}
              alt={`Nyuh Bali Villas - ${site.label}`}
              fill
              sizes="154px"
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
                  <li key={item.label}>
                    {item.inScope ? (
                      <Link
                        href={item.href}
                        className={`group/nav ${labelClassName} hover:text-white`}
                      >
                        {item.label}
                        {marker}
                      </Link>
                    ) : (
                      <span className={labelClassName}>
                        {item.label}
                        {marker}
                      </span>
                    )}
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
            <Button
              href={site.bookingHref}
              external
              size="sm"
              className="hidden sm:inline-flex"
            >
              Book Now
            </Button>

            {/* 44×44 hit area with a 24px visual mark. The bars used to be the
                button, which made the primary navigation control on mobile
                exactly 24×24 — the bare WCAG minimum and well under what a
                thumb actually wants. `-mr-3` pulls the enlarged box back so the
                visible mark stays aligned with the container edge. */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="-mr-3 flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
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
