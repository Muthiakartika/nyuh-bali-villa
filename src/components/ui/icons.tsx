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

// ---------------------------------------------------------------------------
// Amenity glyphs — used by property/AmenityGrid on the Villas/Stay pages.
//
// The live site draws this row from Font Awesome (wifi, leaf, cutlery, heart,
// star, users) plus two uploaded PNGs for Yoga and Gym. Same approach as the
// icons above: each one is redrawn here as a simple geometric inline SVG so the
// row costs no icon-library dependency and no hotlinked image, and each fills
// with `currentColor` so it follows the surrounding gold utility.
// ---------------------------------------------------------------------------

export function WifiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      {...props}
    >
      <path d="M2.5 8.5a15 15 0 0 1 19 0M5.5 12.2a10.5 10.5 0 0 1 13 0M8.5 15.9a6 6 0 0 1 7 0" />
      <circle cx="12" cy="19.4" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

// SPA — a leaf, matching the live site's `leaf` glyph.
export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20 3c-8.5 0-14 4-14 10 0 1.6.4 3 1.1 4.2L4 20.3a1 1 0 1 0 1.4 1.4l3.1-3.1A8 8 0 0 0 12.7 20C18 20 20 13.6 20 3ZM8.5 15.9C9.9 10.7 13.4 7 17.8 5.6c-.5 7.5-2.4 12.4-5.1 12.4a6 6 0 0 1-4.2-2.1Z" />
    </svg>
  );
}

// 16-Hour In Room Dining — the site's `cutlery` glyph.
export function CutleryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 2.5v7a2.5 2.5 0 0 0 5 0v-7M8.5 12v9.5M6 2.5v5M11 2.5v5" />
      <path d="M17.5 2.5c-1.4 1.6-2 3.6-2 6 0 1.7.7 2.8 2 3.2v9.8" />
    </svg>
  );
}

// Romance / Romantic Villa.
export function HeartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 21s-8.5-5.3-8.5-11A5 5 0 0 1 12 7.2 5 5 0 0 1 20.5 10c0 5.7-8.5 11-8.5 11Z" />
    </svg>
  );
}

// Personalised Service.
export function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
    </svg>
  );
}

// Yoga — a seated figure, standing in for the uploaded yoga PNG.
export function YogaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="4.4" r="2.1" fill="currentColor" stroke="none" />
      <path d="M12 8v5" />
      <path d="M12 13c-2.6 0-4.8 1.4-6 3.6h12c-1.2-2.2-3.4-3.6-6-3.6Z" />
      <path d="M3.2 12.2 8 14.4M20.8 12.2 16 14.4M4.5 19.6h15" />
    </svg>
  );
}

// Gym — a dumbbell, standing in for the uploaded barbell PNG.
export function DumbbellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      {...props}
    >
      <path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" />
    </svg>
  );
}

// Room specs on the Villas/Stay pages: bedding, floor area, occupancy. The
// live site uses Font Awesome's `bed`, `expand` and `users` for the same trio.
export function BedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 6a1 1 0 0 0-1 1v11a1 1 0 1 0 2 0v-2h16v2a1 1 0 1 0 2 0v-6a3 3 0 0 0-3-3h-8V7a1 1 0 0 0-1-1H3Zm1 2h5v3H4V8Zm3.5-.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z" />
    </svg>
  );
}

export function ExpandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6" />
    </svg>
  );
}

// Balinese Class — a small group, the site's `users` glyph.
export function UsersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9 11.5a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Zm0 1.6c-3 0-6 1.5-6 3.4v2.4h12v-2.4c0-1.9-3-3.4-6-3.4Zm7.6-1.6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 1.6c-.5 0-1 0-1.5.2 1.3 1 2.1 2.2 2.1 3.6v2h4.3v-2.4c0-1.9-2.6-3.4-4.9-3.4Z" />
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
