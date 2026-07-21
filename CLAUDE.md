# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Nyuh Bali Villas clone** — a pixel-accurate Next.js recreation of [nyuhbalivillas.com](https://nyuhbalivillas.com), a real Bali villa rental business with two properties (Seminyak and Ubud). This is client/authorized work, not an unaffiliated scrape — confirmed with the user before building, which is why real content (guest testimonial names, contact details) is used verbatim and images are hotlinked directly from the live site rather than replaced with placeholders.

Scope is deliberately limited to **7 pages**: Home, About Us (×2 properties), Contact (×2 properties), Terms & Conditions, Privacy Policy. The live site has many more pages (Villas, Offers, Dining, SPA, Explore/Culture, Blog, per-property sub-pages) — none of those are built here. Nav items and grid links that point to those out-of-scope pages render as plain, non-clickable text instead of dead links (see "The `inScope` convention" below).

Every visual value (colors, font sizes, spacing, breakpoints) was measured from the live site's computed styles rather than eyeballed — if you're adding something new, measure it the same way rather than guessing.

## Commands

- `npm run dev` — start the dev server on **port 3001**, not 3000. The sibling `nextjs-art-gallery-clone` repo (same parent folder) often has its own server occupying 3000; the script is pinned to 3001 to avoid that collision outright rather than relying on Next's auto-port-increment.
- `npm run build` — production build (Turbopack), statically generates all 7 routes
- `npm run start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)

There is no test suite in this project.

**Windows/Turbopack note:** if routes start 404ing after killing and restarting the dev server (a symptom of a corrupted `.next` cache), don't delete `.next` while a server is still running against it — that corrupts its persistent cache further. Stop the process first (`taskkill`), then delete `.next`, then restart.

## Architecture

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS v4. Fonts are Open Sans (body) and Source Sans 3 (headings, at a light 300 weight for large text) via `next/font/google`, matching the live site's self-hosted webfonts.

**Design tokens** live in `src/app/globals.css` via a Tailwind v4 `@theme` block (CSS-first config, not `tailwind.config.js`): `primary` (gold, `#c7a259`), `text` (`#404040`), `background` (white), `ink` (`#261e13` — the dark brown reused across footers, the mobile nav overlay, and the "BOOK NOW" ribbon), `error` (`#ff0000`, required-field asterisks). Font tokens (`font-body`, `font-heading`) use a separate `@theme inline` block because they reference `next/font`'s runtime CSS variables rather than literal values.

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
- `home/` — components used only on `/` (HomeHeader, HomeFooter, PropertyPanel). Not reused elsewhere because Home's chrome is structurally simpler than the property pages' (2 nav links vs. 7–8, transparent header vs. a solid dark one).
- `property/` — everything shared across the Seminyak/Ubud About and Contact pages (PropertyHeader, PropertyFooter, HeroSlider, BookingSearchBar, AboutNarrative, PromoBanner, LinkCardGrid, TestimonialCarousel, InstagramTeaser, AwardsRow, DirectBookingDeals, ContactForm).
- `legal/` — LegalSection, the paragraph-or-bulleted-list renderer shared by Terms & Privacy.
- `layout/` — the two pieces genuinely shared between Home *and* the property pages: MobileNavOverlay (the full-screen mobile nav, generalized after two independent call sites needed the identical treatment) and BookNowRibbon (Home's fixed vertical "BOOK NOW" tab).
- `ui/icons.tsx` — hand-drawn inline SVGs (map pin, phone, envelope, Facebook, Instagram, chevron) instead of an icon library dependency. Deliberately avoids recreating any brand's actual logomark (e.g. Google Maps links use the generic pin icon, not Google's "G").

**The `inScope` convention:** `PropertyNavItem`, `LinkCardItem`, and `MobileNavLink` all carry an `inScope?: boolean`. When true (or omitted), the item renders as a real `<Link>`; when explicitly `false`, it renders as plain `<span>` text with identical styling — used everywhere a live-site link points at a page this project doesn't build (Villas, Dining, SPA, Offers, Blog, etc.). Follow this same pattern for any new nav/grid item rather than inventing a different scoping mechanism.

**Carousels** (HeroSlider, TestimonialCarousel) follow one consistent pattern: local `useState` index, plain prev/next handlers with wraparound, dot indicators — no carousel library, same approach as the sibling art-gallery project's `Reviews.tsx`.

**Deliberately simplified, not faked, functionality:**
- `BookingSearchBar` reproduces the live third-party booking widget's *appearance* (including check-in/out dates genuinely computed as today/tomorrow) but not its full date-picker/guest-counter logic; Search links out to the real booking engine.
- `ContactForm` is a real, working form interaction (client-side `preventDefault` + a confirmation-message state) but doesn't send email anywhere — there's no backend to receive it. A comment in the file marks where a Server Action would plug in for a real deployment.
- `InstagramTeaser` shows the heading and a real "Follow on Instagram" link, not a live photo grid (the source is a Smash Balloon widget requiring an authenticated Instagram API connection).

**Known live-site content quirks, preserved rather than "fixed":** the Privacy Policy's Ubud contact email is `info@ubudnyuhbali.co` (no "m"), genuinely different from the `info@ubudnyuhbali.com` used everywhere else on the live site — that inconsistency is in the source content itself. Conversely, `/ubud/contact/` is *broken* on the live site (always serves Seminyak's cached content, confirmed via network inspection) — that bug was **not** reproduced; the real `contact-us-ubud.webp` photo was recovered via the WordPress REST API and used with Ubud's own correct header/footer/form instead.

---

## UI Facelift — session progress (2026-07-20, resume here)

A UI-refinement pass ("~75% original / ~25% polish") measured against the live site with computed styles (not eyeballing) at 390 / 768 / 1024 / 1440 / 1920 px. **Everything below is done and verified against `nyuhbalivillas.com`; the dev server was clean-restarted after each batch (see gotcha #1).**

### Done & verified
- **Shared `Container`** (`src/components/ui/Container.tsx`) — centered content wrapper, `max-w-[1080px]`. The live site wraps content in a 1120px box that itself has 20px inner padding → **1080px** content. Since every section already applies its own `px-5`, capping content at 1080 reproduces the live width at every viewport (wide = 1080 centered; mobile = viewport−40). Used by `PropertyHeader`, `PropertyFooter`, `HomeHeader`, `HomeFooter`, `AwardsRow`, and the contact / terms / privacy `<main>`s. Backgrounds stay full-bleed on the outer element; only the *content* is capped.
- **`PropertyHeader`** — height `h-[82px] lg:h-[60px]` (live is 60px on desktop, 82px below `lg`). Real nav `<Link>`s get a hover-brighten; `inScope:false` spans do not.
- **`HeroSlider`** — viewport-relative height `h-[30vh] md:h-[50vh] lg:h-[70vh] heroxl:h-[80vh]` (four tiers measured on live). `heroxl` is a custom breakpoint (see gotcha #2).
- **Hover polish** — `LinkCardGrid` + `PropertyPanel` images `group-hover:scale-105` (wrappers got `overflow-hidden`); primary CTA buttons `hover:opacity-90`; footer social icons `hover:opacity-70`.
- **`PropertyFooter`** rebuilt to match live: 2px gold divider at top (`border-t-2 border-primary`); logo is now the per-property wordmark `site.logoSrc` at 136×50 (was a 40×40 round icon); top block is stacked & left-aligned (logo → copyright → nav — was a horizontal `justify-between` row); nav `tracking-[1px]`. Gold line belongs to the footer (shows on Contact/legal pages too, which have no awards row).
- **`AwardsRow`** — now takes a `variant` prop. Seminyak `"grid"` (default) = 5 equal columns spanning full width, square badges, single row that scales down (was centered/clustered). Ubud `variant="marquee"` = animated logo slider matching the live site (`animate-marquee`, 30s linear infinite; badges rendered twice and track slides `-50%` for a seamless loop). All award images are square.
- **`globals.css`** — added `--breakpoint-heroxl: 70.3125rem`, `--animate-marquee` token, `@keyframes marquee`, and a `prefers-reduced-motion` guard that freezes the marquee.
- **All remaining content sections moved onto `Container`** — `AboutNarrative`, `PromoBanner`, `LinkCardGrid`, `TestimonialCarousel`, `InstagramTeaser`, `BookingSearchBar` no longer use the old `md:px-[92px]` + inner `max-w-*` pattern. `Container` is now the single source of content width across the whole site. Two real visual corrections came out of this, both measured against live: the narrative paragraphs now fill the full 1080px (were capped at `max-w-4xl` / 896px), and every card grid is 1080px (was `max-w-5xl` / 1024px). Verified column widths match live exactly — 2-col 530px, 3-col 346.67px, 4-col 255px, awards 5-col 200px, all with 20px gaps; testimonial quote stays 640px, which already matched.
- **Home page picker on `Container`** — `src/app/page.tsx`'s two-panel Seminyak/Ubud row was the last place still on `px-5 md:px-[92px]`. Now inside `Container`, so each half is 540px and each panel's 500px photo/description lands where the original's does (verified: container 1080, panels 540/540, images 500×333, heading 166px — all identical to live). `PropertyPanel`'s own internals already matched and were left untouched.
- **`PromoBanner` heading font fix** — its `<h2>` was the only heading in the codebase missing `font-heading`, so "Best Price Guaranteed" fell back to the Open Sans body font and rendered ~60px wider than the original. Now uses Source Sans like every other heading. (Residual 369px vs live's 357px is just Google's "Source Sans 3" vs the live site's older self-hosted "source-sans" — expected.)

### Gotchas that WILL bite you if forgotten
1. **Turbopack + Tailwind v4 does not pick up brand-new class names** added to `.tsx` files on an incremental rebuild — the new utilities are silently absent from the compiled CSS and just don't apply (JSX changes still hot-reload fine, which makes it look like only *some* of your edit landed). **Fix: stop the dev server → delete `.next` → restart.** Touching `globals.css`'s mtime did **not** help. So after adding any new Tailwind class, do a clean restart before trusting the result. (This bit us 3× this session.)
2. **Custom breakpoints must be `rem`, not `px`.** `--breakpoint-heroxl` had to be `70.3125rem` (= 1125px). In px, Tailwind can't order it against the rem-based defaults and emits its `@media` block out of sequence, so `lg:` wins the cascade and the tier silently does nothing. In rem it sorts correctly between `lg` and `xl`.
3. Windows/Turbopack: always stop the `next dev` process **before** deleting `.next` (see the Commands note above). Dev server is on **port 3001**.

### Not done yet / next steps
- `Container` is now used by every section on every page — if you add a new section, reuse it rather than reintroducing `md:px-[92px]`.

---

## Modern redesign (supersedes pixel-accuracy in specific places)

**Read this before "fixing" anything back to match the live site.** The project began as a strict pixel-accurate clone (see the top of this file), but the homepage picker and the About Us pages were then deliberately redesigned to be "a bit more modern". Those sections are **intentionally different from nyuhbalivillas.com** — do not treat the differences as bugs to correct.

**Constraints that still hold** (unchanged from the original brief): same fonts (Open Sans body, Source Sans headings), same palette (gold `primary` `#c7a259`, `ink` `#261e13`, `text` `#404040`), same logo, and **same copy** — no headline, paragraph, button label or nav item was reworded. Only composition, spacing, image treatment and motion changed.

**What changed, and why:**
- **`PropertyPanel` (homepage picker)** — was heading → paragraph → photo stacked as three separate blocks. Now one image card per property: photo fills a square card (`aspect-[4/3] md:aspect-square`, `object-cover`), a flat `bg-ink/55` scrim over it for legibility, name + description centred on top, and a short gold rule that widens on hover. `page.tsx` uses a `grid` with a real gutter so the two read as two distinct choices.
- **`AboutNarrative`** — body copy was running the full 1080px, which on Ubud is a single ~1,000-character paragraph. Now capped at `max-w-[68ch]` (≈622px rendered) with `leading-[1.9]`. This is the one place that **knowingly reverses** an earlier accuracy fix; readability won.
- **`LinkCardGrid`** — label moved from loose text *below* the photo to an overlay *on* it, over a scrim, so each tile is one object that responds to hover as a whole.
- **`PromoBanner`** — same four pieces of copy, but arranged as a hairline gold-bordered card with real hierarchy: small "Promo code" label, the code itself large in gold, perks below a rule.
- **`TestimonialCarousel`** — circular arrow buttons with a hover state, a decorative (aria-hidden) quote mark, author set as a small gold caption, and an active dot that stretches into a pill.

**Design vocabulary to reuse:** a short gold rule (`h-px w-16 bg-primary/70`) sits under every section heading, and interactive imagery uses a flat `bg-ink/xx` scrim that lightens on hover plus a slow `scale-[1.04]`–`scale-[1.06]` zoom. Deliberately no gradients, glassmorphism or shadows — the restraint is part of the brand.
- No visual screenshots were captured this session (the browser tool's screenshot + the live site's own screenshots timed out). Verification was computed-style measurement only — worth an eyeball pass in a normal browser, especially the **Ubud marquee motion** (its interpolation was proven correct via the Web Animations API, but it was paused under automation because the pane reported the document as `hidden`; it runs on a real visible tab).
