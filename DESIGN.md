# DESIGN.md — Nyuh Bali Villas

The design system for the `main` branch: a warm, restrained **Luxury Editorial**
treatment for a Bali villa business. This documents what the code actually does
so a change can be made in one place and stay consistent everywhere. Where this
disagrees with a component, this file is the intent — fix the component.

> Note: the tokens below are Tailwind CSS v4 `@theme` variables declared in
> `src/app/globals.css`. There is no `tailwind.config.js`.

## Brand — fixed

These three are the business's actual marks and never change:

| Token | Value | Role |
|---|---|---|
| `primary` | `#c7a259` | Brand gold — accents, rules, icons, button fills, eyebrows |
| `ink` | `#261e13` | Brand dark brown — dark bands, footer, headings, button text |
| `text` | `#404040` | Body copy on light surfaces |

**Contrast rule (do not break):** gold on white is only 2.39:1 and fails WCAG AA.
So gold is used as a *fill / rule / icon* colour, never as small text on a light
surface. On light surfaces, gold **text** uses `primary-deep` (`#8a6f31`,
4.78:1). On the dark `ink` band, full gold is fine (6.93:1) and carries the
promo code, eyebrows, and rules. Buttons are gold fill with `ink` text (6.93:1),
never white-on-gold.

## Surfaces

The page runs on warm off-whites, not stark white:

- `sand` `#faf8f2` — default page surface (gold at 8% over white)
- `sand-deep` `#f6f0e4` — the alternating band (gold at 16%)
- `ink` `#261e13` — dark bands (offer, testimonial), header-on-scroll, footer, awards
- `background` `#ffffff` — reserved

Dark is **punctuation, not the baseline**: it appears a few times per page with
light on either side, never as slabs stacked back to back.

## Typography

Two families via `next/font`: **Open Sans** (`font-body`) and **Source Sans 3**
(`font-heading`, weight 300 for display). Headings are set in `ink`, not gold —
gold headings were the loudest "2005 luxury site" tell and failed contrast.

Scale tokens: `text-eyebrow` (letter-spaced caps label), `text-section` (band
heading), `text-display` (page-opening heading). Heading lockup = optional
eyebrow + heading + a short gold rule beneath (`SectionHeading`).

## Layout & rhythm

- **Width:** `components/ui/Container.tsx` — `wide` (1240px) is the content cap;
  `narrow` (680px) is the legal-copy reading measure. Background colour is
  full-bleed on the outer `<section>`; only the content is capped.
- **Bands:** compose with `components/ui/Section.tsx` — declare `tone`
  (`sand` / `sand-deep` / `ink` / `white`) × `space` (`tight` 40/56 · `normal`
  56/80 · `loose` 64/96, mobile/`md`), never hand-rolled section padding.
- Sharp corners are the convention (`rounded-none` on cards and buttons); the
  booking card and pill nav markers are the deliberate exceptions.
- No gradients-as-decoration and one shadow only (the booking card). The
  restraint is the premium signal.

## Components

### Buttons (`components/ui/Button.tsx`)
One CTA. Gold fill + `ink` text; hover **inverts** the fill (never
`hover:opacity`). Square corners. `buttonClassName()` is exported so a real
`<button type="submit">` matches the link-shaped CTAs.

### Header (`property/PropertyHeader.tsx`)
Floats over the hero with a **brown scrim gradient** (`ink/90 → transparent`) +
a gold hairline so the logo and nav read over photography — **not** frosted
glass. On scroll it cross-dissolves to a solid `ink` bar and compacts height.
The logo is enlarged (hero 154×56, scrolled 128×46) to stay legible on the dark
bar. Carries the Book Now CTA. Nav appears at `lg` (the 7–8 items don't fit a
tablet alongside the logo + CTA).

### Hero (`property/PropertyHero.tsx`)
Full-bleed slider, bottom-left typographic lockup, slow Ken-Burns push-in.
Navigated by **gold bullet indicators** (one centred row, no arrows). A
single-image gallery (Ubud) shows no controls.

### Booking bar (`property/BookingSearchBar.tsx`)
A `sand` card **overlapping the hero's bottom edge**, framed in a gold-brown
hairline (`border-primary/45`) like the live widget, fields split by warm gold
hairlines. The one shadow on the site.

### Cards (`property/LinkCardGrid.tsx`) — **fixed height, not aspect-ratio**
Every card in every grid shares ONE height (`h-44` mobile / `h-60` = 240px
desktop) and crops its photo with `object-cover`. This is deliberate: an
aspect-ratio prop made height vary with width (a 2-up card towered over a 4-up
one) and let portrait source photos stretch the card. Fixed height means all
cards line up, the frame is always landscape-or-square, and a tall photo is
cropped, not allowed to grow the card. Column count (2/3/4) sets the card
*width* and label size; height is constant. Label sits bottom-left over a
bottom-weighted gradient with a gold rule that extends on hover.

### About + offer (`property/AboutNarrative.tsx`)
The "About Us" narrative and the "Best Price Guaranteed" offer are **one
section**. Explicit grid: heading top-left, a dark offer plate bottom-left
(dark so the gold promo code keeps contrast on the light band), narrative
spanning the right. DOM order heading → narrative → offer so the mobile stack
reads sensibly.

### Footer (`property/PropertyFooter.tsx`) — **compact, single row**
Four columns on one row: **brand column** (logo + Book Now + social) beside
**Menu**, **Contact**, **Blog**, then a thin legal bar (copyright + Terms /
Privacy). The CTA lives in the grid, not on a separate banner row above it. Tight
gaps (`gap-x-10 gap-y-8`, `pt-9 md:pb-6`); the gold `border-t-2` and gold eyebrow
headings carry the premium note without spending height. Desktop footer ≈ 324px.
Mobile keeps `pb-24` to clear the fixed booking bar.

### Awards (`property/AwardsRow.tsx`)
Short badge row on `ink` (badges capped to ~68px, not full-column squares).
Seminyak = static grid; Ubud = marquee.

## Copy & scope

- **No copy is invented.** Every headline, paragraph, label, and eyebrow is
  verbatim from the live site; eyebrows reuse strings already present (a property
  name, a nav label).
- Nav/grid items pointing at pages outside this project's 7-page scope render as
  plain non-clickable text (`inScope: false`), not dead links.

## Verification notes

- After adding a **new** Tailwind class, Turbopack can drop it on an incremental
  rebuild — stop the dev server, delete `.next`, restart. A clean production
  build (`npm run build`) always picks it up.
- The browser tooling in this workspace can't screenshot; layout has been
  verified by computed-style measurement, not by eye. Photo cropping and gold
  legibility over photography still want a real eyeball pass.
