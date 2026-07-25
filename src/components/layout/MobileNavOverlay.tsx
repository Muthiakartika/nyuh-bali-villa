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
  /** Off-site destination (opens in a new tab). */
  external?: boolean;
  /** Dropdown entries on desktop; an indented sub-list here. */
  children?: MobileNavLink[];
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

      {/* `overflow-y-auto` matters once submenus are expanded: the Ubud menu
          is 8 top-level items plus 8 children, which is taller than a phone
          screen. `justify-center` only centres the list while it still fits. */}
      <nav className="flex flex-1 flex-col justify-center overflow-y-auto">
        <ul className="flex flex-col">
          {/* Flattened so the entrance stagger keeps running across parents and
              children instead of restarting inside each sub-list. */}
          {links
            .flatMap((link) => [
              { link, isChild: false },
              ...(link.children ?? []).map((child) => ({
                link: child,
                isChild: true,
              })),
            ])
            .map(({ link, isChild }, index) => {
              // Children are set smaller and indented behind a short gold rule
              // — a submenu on a phone reads as a sub-list, not as a peer of
              // the section it belongs to.
              const rowClassName = isChild
                ? "flex items-center border-b border-white/10 py-2.5 pl-5 font-body text-[15px] tracking-[0.12em] uppercase"
                : "flex items-center border-b border-white/10 py-4 font-heading text-2xl font-light";

              const content = (
                <>
                  {isChild ? (
                    <span
                      aria-hidden
                      className="mr-3 -ml-5 block h-px w-3 bg-primary/60"
                    />
                  ) : null}
                  {link.label}
                </>
              );

              return (
                <li
                  key={`${isChild ? "child" : "top"}-${link.label}`}
                  className="animate-rise-in"
                  // Inline rather than a Tailwind class so any number of links
                  // can stagger without a matching arbitrary class needing to
                  // exist in the stylesheet.
                  style={{ animationDelay: `${index * 55}ms` }}
                >
                  {link.inScope === false ? (
                    <span className={`${rowClassName} text-white/45`}>
                      {content}
                    </span>
                  ) : link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className={`${rowClassName} text-white transition-colors duration-300 hover:text-primary`}
                    >
                      {content}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className={`${rowClassName} text-white transition-colors duration-300 hover:text-primary`}
                    >
                      {content}
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
