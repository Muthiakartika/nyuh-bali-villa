"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export type MobileNavLink = {
  label: string;
  href: string;
  /** Defaults to true. Set false to render this entry as plain
   * non-clickable text instead of a Link — see PropertyNavItem's `inScope`
   * for why some nav destinations aren't real links in this project. */
  inScope?: boolean;
};

type MobileNavOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  links: MobileNavLink[];
  /** Optional because the homepage's two-link menu has no single property to
   * book — its booking CTA is the group ribbon instead. */
  bookingHref?: string;
};

/**
 * The full-screen menu shared by the homepage chrome and the property
 * headers.
 *
 * Redesigned from a column of identical 15px grey links centred in the void.
 * Menu items are now left-aligned and set large, separated by hairlines, and
 * arrive in a short stagger — a mobile menu is a *page* on a phone, not a
 * dropdown, so it gets treated with the same typographic care as one. The
 * booking CTA sits at the bottom where a thumb reaches.
 */
export function MobileNavOverlay({
  isOpen,
  onClose,
  links,
  bookingHref,
}: MobileNavOverlayProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    // Locking the page behind the overlay stops the situation where swiping
    // the menu scrolls the article underneath it — the previous version was
    // a fixed layer over a still-scrollable document.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-ink px-6 pt-6 pb-10">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-10 w-10 items-center justify-center text-2xl leading-none text-primary transition-opacity duration-300 hover:opacity-70"
        >
          &times;
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center">
        <ul className="flex flex-col">
          {links.map((link, index) => {
            const rowClassName =
              "flex items-center border-b border-white/10 py-4 font-heading text-2xl font-light";

            return (
              <li
                key={link.label}
                className="animate-rise-in"
                // Inline rather than a Tailwind class so any number of links
                // can stagger without a matching arbitrary class needing to
                // exist in the stylesheet.
                style={{ animationDelay: `${index * 55}ms` }}
              >
                {link.inScope === false ? (
                  <span className={`${rowClassName} text-white/45`}>
                    {link.label}
                  </span>
                ) : (
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`${rowClassName} text-white transition-colors duration-300 hover:text-primary`}
                  >
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {bookingHref ? (
        <Button
          href={bookingHref}
          external
          className="w-full animate-rise-in"
        >
          Book Now
        </Button>
      ) : null}
    </div>
  );
}
