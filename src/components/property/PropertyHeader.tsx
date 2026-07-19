"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PropertySite } from "@/data/properties";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";

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
    <header className="relative z-[150] flex h-[82px] items-center justify-between bg-ink px-5 md:px-[92px]">
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

      <nav className="hidden md:block">
        <ul className="flex gap-8">
          {site.navItems.map((item) => {
            const isActive = item.href === activeHref;
            const linkClassName = `text-[15px] tracking-[3px] uppercase ${
              isActive ? "text-white" : "text-white/50"
            }`;

            // Out-of-scope destinations (Villas, Offers, Dining, …) render
            // as plain text, not a Link — see PropertyNavItem.inScope.
            return (
              <li key={item.label}>
                {item.inScope ? (
                  <Link href={item.href} className={linkClassName}>
                    {item.label}
                  </Link>
                ) : (
                  <span className={linkClassName}>{item.label}</span>
                )}
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
        className="flex h-6 w-6 flex-col justify-center gap-1.5 md:hidden"
      >
        <span className="block h-0.5 w-full bg-primary" />
        <span className="block h-0.5 w-full bg-primary" />
        <span className="block h-0.5 w-full bg-primary" />
      </button>

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
