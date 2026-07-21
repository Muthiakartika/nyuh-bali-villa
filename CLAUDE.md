# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Nyuh Bali Villas clone** — a pixel-accurate Next.js recreation of [nyuhbalivillas.com](https://nyuhbalivillas.com), a real Bali villa rental business with two properties (Seminyak and Ubud). This is client/authorized work, not an unaffiliated scrape — confirmed with the user before building, which is why real content (guest testimonial names, contact details) is used verbatim and images are hotlinked directly from the live site rather than replaced with placeholders.

Scope is deliberately limited to **7 pages**: Home, About Us (×2 properties), Contact (×2 properties), Terms & Conditions, Privacy Policy. The live site has many more pages (Villas, Offers, Dining, SPA, Explore/Culture, Blog, per-property sub-pages) — none of those are built here. Nav items and grid links that point to those out-of-scope pages render as plain, non-clickable text instead of dead links (see "The `inScope` convention" below).

Every visual value (colors, font sizes, spacing, breakpoints) was originally measured from the live site's computed styles rather than eyeballed. **That is no longer the whole story** — most pages have since been deliberately redesigned away from the original. Read "Design state" below before matching anything to the live site; the design system documented there is the current source of truth, not nyuhbalivillas.com.

## Commands

- `npm run dev` — start the dev server on **port 3001**, not 3000. The sibling `nextjs-art-gallery-clone` repo (same parent folder) often has its own server occupying 3000; the script is pinned to 3001 to avoid that collision outright rather than relying on Next's auto-port-increment.
- `npm run build` — production build (Turbopack), statically generates all 7 routes
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)

There is no test suite in this project.

**Windows/Turbopack note:** if routes start 404ing after killing and restarting the dev server (a symptom of a corrupted `.next` cache), don't delete `.next` while a server is still running against it — that corrupts its persistent cache further. Stop the process first (`taskkill`), then delete `.next`, then restart.

## Architecture

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS v4. Fonts are Open Sans (body) and Source Sans 3 (headings, at a light 300 weight for large text) via `next/font/google`, matching the live site's self-hosted webfonts.

**Design tokens** live in `src/app/globals.css` via a Tailwind v4 `@theme` block (CSS-first config, not `tailwind.config.js`).

*Brand colours, fixed:* `primary` (gold `#c7a259`), `text` (`#404040`), `ink` (`#261e13`), `error` (`#ff0000`).

*Derived, not invented:* `sand` (`#faf8f2` = gold at 8% over white) is the site's default surface and is set on `<body>`, so no page can open on stark white; `sand-deep` (`#f6f0e4` = gold at 16%) is the alternating band. `primary-deep` (`#8a6f31`) is the accessible gold for **text on light surfaces** — brand gold on white measures 2.39:1 and fails WCAG AA, `primary-deep` measures 4.78:1 and passes. The rule: full-strength `primary` for gold-on-dark, rules/hairlines, icons and button fills; `primary-deep` for gold text on sand or white.

*Type scale:* `text-eyebrow`, `text-section`, `text-display`, `text-quote`, the last three using `clamp()`. Font tokens (`font-body`, `font-heading`) use a separate `@theme inline` block because they reference `next/font`'s runtime CSS variables rather than literal values.

*Animation tokens:* `animate-marquee` (Ubud awards), `animate-kenburns` (hero push-in), `animate-rise-in` (mobile menu stagger, testimonial changes).

**Images are hotlinked, not downloaded** — every `<Image>` `src` points at `nyuhbalivillas.com`'s own CDN. `next.config.ts`'s `images.remotePatterns` allow-lists that host, scoped to `/wp-content/uploads/**` specifically.

**Route structure:**
```
/                     Home (property picker)
/seminyak             About Us – Seminyak
/seminyak/contact     Contact – Seminyak
/ubud                 About Us – Ubud
/ubud/contact         Contact – Ubud
/terms-conditions     Terms & Conditions (global, not per-property)
/privacy-policy       Privacy Policy (global, not per-property)
```
Terms & Conditions and Privacy Policy hard-code `PROPERTY_SITES.ubud` for their header/footer chrome rather than taking a `site` prop — that's not an arbitrary choice, it's what the live site actually does (both legal pages render with Ubud's nav/footer regardless of referring property).

**Data model** (`src/data/`): `properties.ts` exports `PROPERTY_SITES` (nav items, contact info, logo, booking URL, blog post titles, per property) and the smaller `PROPERTIES` list (just label+href, used by Home's picker). `testimonials.ts` and `legal.ts` hold the two properties' guest reviews and the two legal pages' section content respectively — kept separate from `properties.ts` because they're long and only needed by specific pages, not by every page's nav/footer.

**Component organization** (`src/components/`):
- `home/` — components used only on `/` (HomeHeader, HomeFooter, PropertyPanel). Home's chrome floats over full-bleed photography and carries 2 nav links, so it isn't shared with the property pages' 7–8-item header.
- `property/` — everything shared across the Seminyak/Ubud About and Contact pages (PropertyHeader, PropertyFooter, PropertyHero, BookingSearchBar, AboutNarrative, PromoBanner, LinkCardGrid, TestimonialCarousel, InstagramTeaser, AwardsRow, DirectBookingDeals, ContactForm).
- `legal/` — LegalSection, the paragraph-or-bulleted-list renderer shared by Terms & Privacy.
- `layout/` — the two pieces genuinely shared between Home *and* the property pages: MobileNavOverlay (the full-screen mobile nav) and BookNowRibbon (Home's fixed vertical "BOOK NOW" tab).
- `ui/` — the design-system primitives. **Reach for these before writing layout by hand:**
  - `Container` — content width (`wide` 1240px / `narrow` 680px).
  - `Section` — the standard page band: full-bleed `tone` background + contained content + `space` rhythm. Replaces the `px-5 py-14 md:py-20` + `<Container>` boilerplate that was repeated in eight components.
  - `SectionHeading` — eyebrow + heading + gold rule, with `surface="light|dark"` picking the safe gold.
  - `Button` / `buttonClassName()` — the one CTA treatment. The exported class helper is what lets the contact form's real `<button type="submit">` match without being wrapped in an anchor.
  - `Reveal` — scroll entrances.
  - `icons.tsx` — hand-drawn inline SVGs instead of an icon library dependency. Deliberately avoids recreating any brand's actual logomark (e.g. Google Maps links use the generic pin icon, not Google's "G").

**The `inScope` convention:** `PropertyNavItem`, `LinkCardItem`, and `MobileNavLink` all carry an `inScope?: boolean`. When true (or omitted), the item renders as a real `<Link>`; when explicitly `false`, it renders as plain `<span>` text with identical styling — used everywhere a live-site link points at a page this project doesn't build (Villas, Dining, SPA, Offers, Blog, etc.). Follow this same pattern for any new nav/grid item rather than inventing a different scoping mechanism.

**Carousels** (PropertyHero, TestimonialCarousel) follow one consistent pattern: local `useState` index, plain prev/next handlers with wraparound, hairline-rule indicators — no carousel library. Both hide their controls entirely when given a single item (the live Ubud hero genuinely has one slide). PropertyHero also auto-advances every 6s, pausing on hover and disabled outright under `prefers-reduced-motion`.

**Deliberately simplified, not faked, functionality:**
- `BookingSearchBar` reproduces the live third-party booking widget's *appearance* (including check-in/out dates genuinely computed as today/tomorrow) but not its full date-picker/guest-counter logic; Search links out to the real booking engine.
- `ContactForm` is a real, working form interaction (client-side `preventDefault` + a confirmation-message state) but doesn't send email anywhere — there's no backend to receive it. A comment in the file marks where a Server Action would plug in for a real deployment.
- `InstagramTeaser` shows the heading and a real "Follow on Instagram" link, not a live photo grid (the source is a Smash Balloon widget requiring an authenticated Instagram API connection).

**Known live-site content quirks, preserved rather than "fixed":** the Privacy Policy's Ubud contact email is `info@ubudnyuhbali.co` (no "m"), genuinely different from the `info@ubudnyuhbali.com` used everywhere else on the live site — that inconsistency is in the source content itself. Conversely, `/ubud/contact/` is *broken* on the live site (always serves Seminyak's cached content, confirmed via network inspection) — that bug was **not** reproduced; the real `contact-us-ubud.webp` photo was recovered via the WordPress REST API and used with Ubud's own correct header/footer/form instead.

---

## Design state — read this before "fixing" anything back toward the live site

This began as a pixel-accurate clone. **Every page has since been deliberately redesigned.** Differences from nyuhbalivillas.com are intentional, not defects — do not "fix" anything back toward the live site.

The current design answers a client brief of **"75% keep the identity, 25% modernise"**, run as *evolution, not revolution*. Identity is preserved at the **information-architecture** layer: section order is byte-for-byte the same on every page, so a returning visitor finds everything where they left it. Modernisation happens entirely in the **visual/compositional** layer.

**Still binding, do not change:** same fonts (Open Sans body, Source Sans headings), same brand colours, same logo, same images, same booking flow, and **same copy** — no headline, paragraph, button label or nav item has been reworded. Where the redesign needed a label it didn't have (hero eyebrows, footer column headings), it reuses a string that already exists on the site ("Nyuh Bali Villas", "About Us", "Seminyak", "Our Blog", "Contact Us"). Composition, spacing, scale, colour *placement* and motion are fair game; wording, brand and photography are not.

### Two authorities — read this before reconciling anything

`DESIGN.md` at the repo root governs **structure**: the 10-step type ramp
(13/14/16/18/22/28/36/48/60/80), the 4px spacing scale, the 1280px container,
the radius scale, component geometry, and the **no-hover policy** ("hover states
are NOT documented. Default and pressed/active states only" — affordances use
`active:`, never hover-only).

`DESIGN.md` does **not** govern colour. It documents Miro's palette; the site
runs Nyuh Bali Villas' own brand — gold `#c7a259`, brown `#261e13`. **That
divergence is deliberate. Do not "fix" the palette back toward DESIGN.md.**

Token names are generic (`accent`, `surface`, `ink`) rather than literal
(`yellow`, `sand`) so a colour can be retuned without every component reading as
a lie. An earlier pass had a token named `yellow` holding gold — exactly the kind
of collision that makes a codebase untrustworthy.

Typography note: DESIGN.md specifies **Roobert PRO**, a commercial Displaay face
that cannot be licensed or self-hosted here. **Plus Jakarta Sans** stands in —
same geometric-humanist construction, carries the 500 weight the ramp leans on.
Swapping in the real face is one loader in `layout.tsx` plus the `@theme inline`
block in `globals.css`.

Verification: `npx impeccable detect src` reads the ramp out of DESIGN.md and
flags any literal `text-[Npx]` that misses it. It must report **0**.

### The design system as it stands

- **Width:** `ui/Container` — `wide` 1240px (was 1080px, a 2012-era measure that squeezed 4-up grids to ~280px), `narrow` 680px for legal copy (~75 characters/line). Backgrounds stay full-bleed on the outer section; only content is capped. Media (hero, homepage panels, marquee) is deliberately allowed to escape the cap — contained text against uncontained image is most of what makes the layout read as editorial.
- **Bands:** compose with `ui/Section` (`tone` × `space`), never hand-rolled padding. The rhythm is `tight` 40/56px, `normal` 56/80px, `loose` 64/96px (mobile/`md`). These were **tuned down ~30%** from an earlier pass (`py-20 md:py-28` / `py-24 md:py-36`) after the client said the gaps were too wide — that spacing read as empty rather than generous. Each step grows ~40% at `md` so phones get genuinely tighter spacing, not the desktop rhythm scaled down. Heading→content inside a band is `mt-8 md:mt-10`.
- **Dark is punctuation, not the baseline.** The old design ran **seven** full-width `ink` slabs per page, three of them consecutive at the foot. It's now **two** in `<main>` (PromoBanner, TestimonialCarousel) with sand either side, plus the awards row + footer as one dark base. Verify with: count `main > section` whose computed background is `rgb(38, 30, 19)` — it should be 2.
- **Headings are `ink`, gold is the accent.** This is the single most important typographic rule here. Gold headings on white measured 2.39:1 and were the loudest "luxury website, 2005" signal on the page. Gold now lives in eyebrows (`primary-deep` on light, `primary` on dark), rules, icons, button fills and hover states.
- **Buttons:** gold fill with **`ink` text** (6.93:1, passes AA — white on gold was 2.39:1 and failed), `rounded-none`, hover *inverts* the fill. Never reintroduce `hover:opacity-90`; opacity was the old universal hover and makes an element look disabled exactly when it should look ready.
- **Cards** (`LinkCardGrid`, `PropertyPanel`, hero): square corners, **bottom-weighted gradient scrim** (never a flat wash over the whole photo), label anchored bottom-left, a gold rule that extends on hover, and a slow `scale-[1.05]` zoom. No inset hairline frames.
- **Responsive art direction, not just a responsive grid:** `LinkCardGrid` crops land **landscape on phones, portrait from `sm` up** — three stacked portrait cards on a 390px screen is ~1,500px of scrolling for one section.
- **Header:** transparent over a hero, solid `ink` + compacted height on scroll (`overlay` prop). Pages with no hero pass no `overlay` and get a solid `sticky` bar. The header carries the **Book Now CTA** — the old one had no booking action at all.
- **`BookingSearchBar` overlaps the hero's bottom edge** by `-mt-14 / md:-mt-24`. This is what removes the old hero → dark slab → white section seam, and it carries the site's **one** shadow; everything else stays flat.
- **`AboutNarrative`** is an editorial two-column split (heading `0.9fr`, narrative `1.1fr`) with the heading `md:sticky md:top-28` so it anchors the left margin for the whole narrative.
- **Landing page** is two full-height photographs meeting at a gapless seam, with `HomeHeader`/`HomeFooter` absolutely positioned *over* them. The page wrapper is `relative min-h-screen` — that's what they anchor to.

### Non-obvious constraints (every one of these was a real bug)
1. **Turbopack + Tailwind v4 silently drops brand-new class names** on an incremental rebuild — JSX hot-reloads but the new utilities are missing from the compiled CSS, so an edit looks half-applied. **After adding any new Tailwind class: stop the server → delete `.next` → restart.** Touching `globals.css` does not help.
2. **Custom breakpoints must be `rem`.** `--breakpoint-heroxl: 70.3125rem` (= 1125px). In px, Tailwind can't order it against the rem-based defaults, emits its media block out of sequence, and `lg:` silently wins.
3. **Hover effects must not depend on a `<Link>` ancestor.** Every grid item is `inScope: false` and renders as a plain div, so `group-hover:` keyed to a wrapping link never fires — this left the entire grid visually inert. Use a named group on the tile itself (`group/card` + `group-hover/card:`).
4. **The property nav appears at `lg`, not `md`.** 7 (Seminyak) or 8 (Ubud) letter-spaced items plus the logo *and* the Book Now button do not fit a 768px tablet, and previously caused ~75px of horizontal page scroll.
5. **`BookingSearchBar`'s five-across row is `lg:`, not `md:`.** At exactly 768px the md variant gave each field ~120px — "1 Room, 2 Adult, 0 Child" wrapped to three lines and the promo input was unusable. Below 1024px the card is a vertical stack.
6. **`Reveal` must never be able to hide content permanently.** Server HTML ships visible (`curl <url> | grep -c reveal-hidden` must return `0` for every route); the client only hides what is already below the fold; a 1500ms fail-safe releases content if no `IntersectionObserver` callback arrives — a working observer always delivers one initial callback per target, so silence means it is broken. `prefers-reduced-motion` disables the whole thing in CSS.
7. **Date defaults in `BookingSearchBar` use `useSyncExternalStore`, not `useState` + `useEffect`.** These routes are statically generated, so "today" baked into the HTML is the *build* date and must be recomputed in the browser. A `setState` inside an effect is the obvious way to do that and is flagged by `react-hooks/set-state-in-effect`; `useSyncExternalStore` with distinct client/server snapshots is the correct API. Both snapshots must be module-level constants — `getSnapshot` runs every render and a fresh object each time loops forever.
8. **Mobile bottom padding is load-bearing — never trim it as "spacing".** Two fixed elements overlay the bottom of the page on phones, and the padding that clears them is functional, not decorative:
   - `PropertyFooter` `pb-28 md:pb-7` clears `DirectBookingDeals`, which docks as a full-width bar. **The bar's height is width-dependent** — its text wraps to 2 lines at 390px (66px tall) but 3 lines at 360px (80px tall), so sizing this against a 390px measurement alone is a trap. `pb-28` leaves ~46px clearance at 390px and ~32px at 360px. During the spacing pass this was briefly cut to `pb-24` while the bar was still 101px tall, leaving the legal links clearing it by **1px**.
   - `PropertyPanel` `pb-28 md:pb-32` clears `HomeFooter`, which floats over the homepage panels. `HomeFooter` runs a deliberately shallow `py-3 md:py-5` because its nav links carry their own `py-2` for tap size — without that the two paddings double-count and eat the clearance.

   Re-measure both pairs after any change to either side.

### Verification limits — important
The browser pane in this environment reports `document.visibilityState: "hidden"`. Consequences, all confirmed: **screenshots time out**, `IntersectionObserver` never fires, **native scroll events never fire** (`window.scrollTo` moves `scrollY` but no listener runs — dispatch `new Event('scroll')` manually to test scroll behaviour), and **CSS transitions never advance**, so `getComputedStyle` on a transitioning property returns the *start* value forever. To read a real end state, set `el.style.transition = 'none'` first.

**No visual check of any page has ever been performed.** All verification is computed-style measurement. An eyeball pass on a real browser/phone is still outstanding — particularly photo cropping in the portrait/square crops, gold legibility over the photography, and whether the award badges (kept on `ink` precisely because several may be light-on-transparent) would survive being moved to a light surface.

### Verified state (redesign pass)
Typecheck, lint and production build all pass; 9 static routes. Measured in-browser:
- No horizontal document scroll at 390 / 768 / 1440 on any page. (The Ubud marquee's track legitimately extends past the viewport but is clipped by `overflow-hidden` on its `Container`; check `documentElement.scrollWidth > clientWidth`, not per-element rects, or it reports false positives.)
- All 7 routes return 200 with `reveal-hidden` count **0** in the server HTML.
- Header transitions transparent/104px → `rgb(38,30,19)`/72px on scroll; `main > section` dark count is 2 on both property pages; h1 68px `ink` at 1440; exactly one `<h1>` per page; hero 591px at 390×844 (was ~253px).
- Mobile nav: opens, locks body scroll, restores on close, closes on Escape, carries a Book Now CTA, staggers at 55ms.
- Zero console errors; all hotlinked images resolve 200 through `next/image`.
