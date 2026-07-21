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
  activeHref: string;
  /**
   * True on pages that open with a full-bleed hero (both About pages). The
   * header then floats over the photograph and only takes a background once
   * scrolled. Pages with no hero pass false and get a solid bar from the first
   * pixel — a transparent header over a plain canvas is just invisible.
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
    // A solid header has nothing to react to, so the listener is never attached
    // on Contact/legal pages.
    if (!overlay) return;

    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    // Called once up front: a browser restoring a scroll position on reload
    // would otherwise leave the header transparent halfway down the page.
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
        which keeps it in normal flow so no page needs a spacer element.
      */}
      <header
        className={`z-[150] w-full px-5 transition-colors duration-300 sm:px-8 ${
          overlay ? "fixed inset-x-0 top-0" : "sticky top-0"
        } ${isSolid ? "bg-primary" : "bg-transparent"}`}
      >
        <Container className="flex h-[72px] items-center justify-between gap-6 md:h-20">
          <Link href={`/${site.slug}`} className="relative h-9 w-28 shrink-0">
            <Image
              src={site.logoSrc}
              alt={`Nyuh Bali Villas - ${site.label}`}
              fill
              sizes="112px"
              className="object-contain object-left"
              priority
            />
          </Link>

          {/*
            Centred nav, per the reference composition. Appears at `lg`, not
            `md`: these navs carry 7 (Seminyak) or 8 (Ubud) items which, with
            the logo and the booking pill either side, do not fit a 768px
            tablet and previously forced horizontal page scroll.
          */}
          <nav className="hidden lg:block">
            {/*
              `gap-6` up to `xl`, not `gap-8`. Measured on Ubud (8 items, the
              worst case) at 1024px: the header's inner width is 945px and the
              logo + nav + booking pill already used 810px of it, leaving 87px
              of slack. Stepping the labels from 14px to 16px adds roughly 50px
              of text, which that slack cannot absorb at `gap-8` — the row would
              have wrapped or pushed the pill off. Tightening the gap by 8px ×
              7 gaps buys back 56px, so the larger labels fit with room to
              spare. Above `xl` there is width for the looser spacing again.
            */}
            <ul className="flex items-center gap-6 xl:gap-8">
              {site.navItems.map((item) => {
                const isActive = item.href === activeHref;
                // `inline-block py-1` gives the anchor a 29px box instead of the
                // 21px an inline element collapses to — the label sits where it
                // did, but the clickable area is no longer thinner than the
                // text it wraps.
                const className = `inline-block py-1 text-body transition-colors duration-200 ${
                  isActive ? "text-on-dark" : "text-on-dark-muted"
                }`;

                // Out-of-scope destinations render as plain text, not links —
                // see PropertyNavItem.inScope.
                return (
                  <li key={item.label}>
                    {item.inScope ? (
                      <Link href={item.href} className={className}>
                        {item.label}
                      </Link>
                    ) : (
                      <span className={className}>{item.label}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            {/* Gold pill: on the brand's dark brown bar the `primary` fill is
                the same colour as the bar and would vanish, so the booking CTA
                takes the accent. Gold on brown measures 6.93:1. */}
            <Button
              href={site.bookingHref}
              external
              variant="accent"
              className="hidden sm:inline-flex"
            >
              Book Now
            </Button>

            {/* 44×44 hit area with a 24px visual mark — the bars used to be the
                button, making the primary mobile control exactly 24×24. */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="-mr-3 flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden"
            >
              <span className="block h-px w-6 bg-accent" />
              <span className="block h-px w-6 bg-accent" />
              <span className="block h-px w-6 bg-accent" />
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
