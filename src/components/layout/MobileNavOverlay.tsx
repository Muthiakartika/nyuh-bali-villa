"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export type MobileNavLink = {
  label: string;
  href: string;
  /** Defaults to true. Set false to render as plain non-clickable text — see
   * PropertyNavItem's `inScope`. */
  inScope?: boolean;
};

type MobileNavOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  links: MobileNavLink[];
  /** Optional: the homepage's two-link menu has no single property to book. */
  bookingHref?: string;
};

/**
 * The full-screen menu shared by the homepage chrome and the property headers.
 *
 * A mobile menu is a page on a phone, not a dropdown, so it gets the same
 * typographic care as one: left-aligned items at a real heading step, separated
 * by hairlines, arriving in a short stagger, with the booking action where a
 * thumb reaches.
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

    // Locking the page behind the overlay stops swiping the menu from
    // scrolling the article underneath it.
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
    <div className="fixed inset-0 z-[200] flex flex-col bg-primary px-6 pt-6 pb-10">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-h4 leading-none text-on-dark"
        >
          &times;
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center">
        <ul className="flex flex-col">
          {links.map((link, index) => {
            const rowClassName =
              "flex items-center border-b border-white/10 py-4 text-h4 font-medium";

            return (
              <li
                key={link.label}
                className="animate-rise-in"
                // Inline so any number of links can stagger without a matching
                // arbitrary class needing to exist in the stylesheet.
                style={{ animationDelay: `${index * 55}ms` }}
              >
                {link.inScope === false ? (
                  <span className={`${rowClassName} text-muted`}>{link.label}</span>
                ) : (
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`${rowClassName} text-on-dark`}
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
        <Button href={bookingHref} external variant="accent" className="w-full animate-rise-in">
          Book Now
        </Button>
      ) : null}
    </div>
  );
}
