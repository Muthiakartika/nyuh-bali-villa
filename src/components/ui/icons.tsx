import type { SVGProps } from "react";

// The live site uses Font Awesome for its footer icons (location pin,
// phone, envelope, Facebook, Instagram). Rather than pull in an icon
// library as a dependency for six small glyphs, each one is hand-drawn here
// as a small inline SVG — same approach as the sibling art-gallery project.
// These are original path data (simple geometric recreations of each
// symbol's general shape), not traced copies of Font Awesome's specific
// glyphs, and deliberately avoid recreating any brand's actual logomark
// (e.g. the "open in Google Maps" link uses this generic pin, not Google's
// trademarked "G").
//
// Every icon takes the same `SVGProps<SVGSVGElement>` so callers can pass
// `className`, `width`/`height`, etc. straight through, and every icon
// fills with `currentColor` so its color follows the surrounding text
// color utility (e.g. `text-primary`) instead of needing its own color prop.

export function MapPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.72 11.36 7.01 11.62a1.5 1.5 0 0 0 1.98 0C13.28 21.36 20 15.25 20 10c0-4.42-3.58-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
    </svg>
  );
}

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4.9c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1.1L6.6 10.8Z" />
    </svg>
  );
}

export function EnvelopeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-13Zm2.2.5 6.8 5.4L18.8 6H5.2ZM5 8.1V18h14V8.1l-6.4 5.1a1 1 0 0 1-1.2 0L5 8.1Z" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// The forward arrow on the booking widget's "Search" primary action. A full
// arrow (shaft + head) reads as "go / take me there", where a bare chevron
// reads as "there's more this way" — different intents at the same small size.
export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

// Used for the hero slider's prev/next controls. A plain chevron rotated
// with a Tailwind class (`rotate-180`) does double duty as both arrows
// instead of needing two separate icon components.
export function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
