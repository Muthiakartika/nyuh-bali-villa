"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PROPERTIES } from "@/data/properties";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";

/**
 * The homepage's header: logo on the left, "Seminyak / Ubud" text links on
 * the right (desktop), collapsing to a hamburger icon that opens a
 * full-screen overlay (mobile, below Tailwind's `md` breakpoint).
 *
 * This is a Client Component (`"use client"` at the top) — the first one in
 * this project — because it needs `useState` to remember whether the mobile
 * menu is open. That's ephemeral, browser-only UI state with no reason to
 * exist on the server, which is exactly the situation Client Components and
 * hooks like `useState` are for. Everything that came before this file
 * (layout, config, PropertyPanel) had no interactivity, so it could stay a
 * plain Server Component by default.
 */
export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative z-[150] flex items-center justify-between px-5 py-4 md:px-[92px] md:py-[5px]">
      <Link href="/" className="relative h-[50px] w-[136px] shrink-0">
        {/* Hotlinked straight from the live site, per the project brief —
            see next.config.ts for the remotePatterns allow-list that makes
            this legal for next/image to optimize. */}
        <Image
          src="https://nyuhbalivillas.com/wp-content/uploads/2023/04/logonyuhbali.webp"
          alt="Nyuh Bali Villas"
          fill
          sizes="136px"
          className="object-contain"
          priority
        />
      </Link>

      {/* Desktop nav: `hidden md:block` means this literally doesn't render
          below the md breakpoint, matching the live site hiding these text
          links (rather than just visually shrinking them) on small screens. */}
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

      {/* Hamburger: only rendered below md. Three plain <span> bars — no
          icon library needed for something this simple. */}
      <button
        type="button"
        onClick={() => setIsMenuOpen((open) => !open)}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
        className="flex h-6 w-6 flex-col justify-center gap-1.5 md:hidden"
      >
        <span className="block h-0.5 w-full bg-ink" />
        <span className="block h-0.5 w-full bg-ink" />
        <span className="block h-0.5 w-full bg-ink" />
      </button>

      <MobileNavOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={PROPERTIES}
      />
    </header>
  );
}
