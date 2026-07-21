"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PropertySite } from "@/data/properties";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";
import { Container } from "@/components/ui/Container";

type PropertyHeaderProps = {
  site: PropertySite;
  /** The href of whichever nav item matches the page currently being
   * viewed. The live site shows the current page's nav item at full white
   * and dims every other item to 50% opacity — this prop is how each page
   * tells the shared header which one that is. */
  activeHref: string;
};

/**
 * The header used across every Seminyak/Ubud page (About, Contact, and any
 * of the out-of-scope pages this project doesn't build). Structurally
 * almost identical to HomeHeader — logo, nav, hamburger + overlay on mobile
 * — but with a dark bar instead of a transparent one, a longer nav list
 * that's driven by data instead of hard-coded, and the "active page" dimming
 * logic the homepage's simple 2-link nav didn't need.
 */
export function PropertyHeader({ site, activeHref }: PropertyHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // Height is 82px up to the `lg` breakpoint and 60px above it — measured
    // directly from the live site, which shrinks its header bar once there's
    // enough width for it to feel less cramped. The old version used a flat
    // 82px at every size, which only happened to match on mobile/tablet.
    <header className="relative z-[150] flex h-[82px] items-center bg-ink px-5 lg:h-[60px]">
      {/* Content (logo, nav, hamburger) is capped at 1120px and centered via
          Container, while this <header> keeps the full-width dark background
          — see Container.tsx for why that split matters. */}
      <Container className="flex items-center justify-between">
        <Link href={`/${site.slug}`} className="relative h-[50px] w-[136px] shrink-0">
          <Image
            src={site.logoSrc}
            alt={`Nyuh Bali Villas - ${site.label}`}
            fill
            sizes="136px"
            className="object-contain"
            priority
          />
        </Link>

        {/* Appears at `lg`, not `md`. These navs carry 7 (Seminyak) or 8
            (Ubud) letter-spaced items — about 672px — which alongside the
            136px logo simply does not fit a 768px tablet, and forced ~75px of
            horizontal page scroll. The hamburger now covers everything below
            1024px, which is also where the header shrinks to 60px. */}
        <nav className="hidden lg:block">
          <ul className="flex gap-8">
            {site.navItems.map((item) => {
              const isActive = item.href === activeHref;
              const baseClassName = `text-[15px] tracking-[3px] uppercase ${
                isActive ? "text-white" : "text-white/50"
              }`;

              // Out-of-scope destinations (Villas, Offers, Dining, …) render
              // as plain text, not a Link — see PropertyNavItem.inScope. The
              // hover-brighten effect is only added to the real <Link>
              // variant below, not this <span>, so a non-clickable label
              // never hints that it's interactive when it isn't.
              if (!item.inScope) {
                return (
                  <li key={item.label}>
                    <span className={baseClassName}>{item.label}</span>
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`${baseClassName} transition-colors duration-200 ${
                      isActive ? "" : "hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          className="flex h-6 w-6 flex-col justify-center gap-1.5 lg:hidden"
        >
          <span className="block h-0.5 w-full bg-primary" />
          <span className="block h-0.5 w-full bg-primary" />
          <span className="block h-0.5 w-full bg-primary" />
        </button>
      </Container>

      {/* The live site's mobile overlay doesn't dim/highlight the active
          item the way the desktop nav does — every link is the same shade
          of grey regardless of which page you're on — so `inScope` is the
          only thing passed through here, not `isActive`. */}
      <MobileNavOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={site.navItems}
      />
    </header>
  );
}
