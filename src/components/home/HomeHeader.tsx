"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PROPERTIES } from "@/data/properties";
import { MobileNavOverlay } from "@/components/layout/MobileNavOverlay";
import { Container } from "@/components/ui/Container";

/**
 * The homepage's header: logo left, the two property links right, collapsing to
 * a hamburger and full-screen overlay below `md`.
 *
 * It has no background of its own — the landing page is two full-height
 * photographs, so the header floats over them and relies on the panels' top
 * gradient for legibility. That keeps both entry points to the site feeling
 * like one design.
 *
 * A Client Component because it needs `useState` for the mobile menu.
 */
export function HomeHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-[150] px-5 py-6 sm:px-8">
      <Container className="flex items-center justify-between">
        <Link href="/" className="relative h-11 w-32 shrink-0">
          {/* Hotlinked from the live site per the project brief — see
              next.config.ts for the remotePatterns allow-list. */}
          <Image
            src="https://nyuhbalivillas.com/wp-content/uploads/2023/04/logonyuhbali.webp"
            alt="Nyuh Bali Villas"
            fill
            sizes="128px"
            className="object-contain object-left"
            priority
          />
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-3">
            {PROPERTIES.map((property) => (
              <li key={property.slug}>
                {/* Pill links, per the badge geometry in DESIGN.md. */}
                <Link
                  href={property.href}
                  className="inline-flex rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-body-sm font-medium text-on-dark backdrop-blur-sm transition-colors duration-200 active:bg-white/20"
                >
                  {property.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 44×44 hit area, 24px visual mark. */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          className="-mr-3 flex h-11 w-11 flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span className="block h-px w-6 bg-accent" />
          <span className="block h-px w-6 bg-accent" />
          <span className="block h-px w-6 bg-accent" />
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
