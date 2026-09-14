"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PROPERTIES } from "@/data/properties";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";
import { Container } from "@/components/ui/Container";

/**
 * The homepage's header: logo left, "Seminyak / Ubud" links right, collapsing
 * to a hamburger and full-screen overlay below `md`.
 *
 * It has no background of its own. The landing page is now two full-height
 * photographs, so the header floats over them and relies on the panels' own
 * top gradient for legibility — the same relationship PropertyHeader has with
 * the hero on the About pages, which keeps the two entry points to the site
 * feeling like one design.
 *
 * A Client Component because it needs `useState` for the mobile menu — that's
 * ephemeral, browser-only UI state with no reason to exist on the server.
 */
type HomeHeaderProps = {
  /** The wordmark, resolved from Site settings by the route — see
   *  `getHomeLogo`. A Client Component cannot read Sanity itself. */
  logoSrc: string;
  logoAlt: string;
};

export function HomeHeader({ logoSrc, logoAlt }: HomeHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-[150] px-5 py-6 sm:px-8 md:py-7">
      <Container className="flex items-center justify-between">
        <Link href="/" className="relative h-[46px] w-[126px] shrink-0">
          {/* A prop, not a path. This is a Client Component — it owns the
              hamburger's open state — so it cannot read Sanity itself; the
              route resolves the wordmark and passes it in. It was the last
              image on the site with no CMS field behind it, because the
              landing page is the one route with no property document to take
              a logo from. */}
          <Image
            src={logoSrc}
            alt={logoAlt}
            fill
            sizes="126px"
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex gap-9">
            {PROPERTIES.map((property) => (
              <li key={property.slug}>
                <Link
                  href={property.href}
                  className="group/nav relative block py-1 text-[11px] tracking-[0.2em] text-white uppercase"
                >
                  {property.label}
                  {/* Same gold underline sweep as the property nav, so both
                      headers share one interaction language. */}
                  <span
                    aria-hidden
                    className="absolute -bottom-1 left-0 block h-px w-0 bg-primary transition-all duration-500 ease-out group-hover/nav:w-full"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 44×44 hit area, 24px visual mark — see the note in PropertyHeader. */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          className="-mr-3 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span className="block h-px w-6 bg-primary" />
          <span className="block h-px w-6 bg-primary" />
          <span className="block h-px w-6 bg-primary" />
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
