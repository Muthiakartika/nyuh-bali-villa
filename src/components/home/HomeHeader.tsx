"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PROPERTIES } from "@/data/properties";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";
import { Container } from "@/components/ui/Container";

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
    // The header used to sit on bare white, which made the landing page open
    // on a stark white band above the imagery. It now shares the dark `ink`
    // of the page body and footer, so the whole landing reads as one
    // continuous dark surface with the photography as the only light.
    // (Checked first that the homepage logo is a light/gold mark — ~8% dark
    // pixels — so it stays legible here.)
    <header className="relative z-[150] bg-ink px-5 py-6">
      {/* Content capped at 1080px and centred via Container — see Container.tsx. */}
      <Container className="flex items-center justify-between">
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
                  className="text-[15px] tracking-[2px] text-primary uppercase transition-opacity duration-200 hover:opacity-70"
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
          {/* Gold, not `ink` — these bars now sit on the dark header, where
              dark-on-dark would be invisible. Same reasoning as HomeFooter's. */}
          <span className="block h-0.5 w-full bg-primary" />
          <span className="block h-0.5 w-full bg-primary" />
          <span className="block h-0.5 w-full bg-primary" />
        </button>
      </Container>

      <MobileNavOverlay
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={PROPERTIES}
      />
    </header>
  );
}
