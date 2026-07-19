"use client";

import Link from "next/link";
import { useState } from "react";
import { PROPERTIES } from "@/data/properties";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";

/**
 * The homepage's closing bar: copyright notice on the left, the same
 * "Seminyak / Ubud" links as the header on the right, collapsing to its own
 * hamburger + full-screen overlay on mobile — mirroring HomeHeader's
 * pattern exactly, because the live site's footer nav is built from the
 * same underlying menu component as its header nav.
 */
export function HomeFooter() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <footer className="flex items-center justify-between bg-ink px-5 py-6 md:px-[92px]">
      <p className="text-xs text-white/50">Copyright © Nyuh Bali Villas</p>

      <nav className="hidden md:block">
        <ul className="flex gap-8">
          {PROPERTIES.map((property) => (
            <li key={property.slug}>
              <Link
                href={property.href}
                className="text-[15px] text-primary uppercase"
              >
                {property.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Same hamburger pattern as HomeHeader, but gold bars instead of dark
          ones — this button sits on the dark footer background, so it needs
          the light/gold color to stay visible, whereas the header's sits on
          a white background and needs the dark color for the same reason. */}
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

      <MobileNavOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={PROPERTIES}
      />
    </footer>
  );
}
