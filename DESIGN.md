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
surface. On light surfaces, gold **text** uses `primary-deep` (`#81693a` = brand
gold at 65%). Measure any new gold text against **`sand-deep`**, the darkest
light surface — not white: `primary-deep` is 4.61:1 there, 4.93:1 on `sand`,
5.23:1 on white. (It used to be `#8a6f31`, calibrated against white, which left
it at 4.21:1 on the warm bands the site actually uses.) On `ink`, full gold is
fine (6.93:1) and carries the promo code, eyebrows, and rules. Buttons are gold
fill with `ink` text (6.93:1), never white-on-gold.

## Surfaces

The page runs on warm off-whites, not stark white:

- `sand` `#faf8f2` — default page surface (gold at 8% over white)
- `sand-deep` `#f6f0e4` — the alternating band (gold at 16%), and the booking card
- `ink` `#261e13` — the booking card's frame, the offer plate, header-on-scroll,
  awards, footer
- `background` `#ffffff` — the Instagram note only, as the page's light break
  before the dark awards base

Dark is **chrome and frame, not a band**. A page body carries no `ink` section at
all: the closing run steps `sand` → `sand-deep` → white → `ink` base, so the page
fades to light and then lands, instead of dropping into a dark slab and back out.
Verify with: `main > section` whose computed background is `rgb(38, 30, 19)` — 0.

## Typography

Two families via `next/font`: **Open Sans** (`font-body`) and **Source Sans 3**
(`font-heading`, weight 300 for display). Headings are set in `ink`, not gold —
gold headings were the loudest "2005 luxury site" tell and failed contrast.

Scale tokens: `text-eyebrow` (letter-spaced caps label), `text-section` (band
heading), `text-display` (page-opening heading). Heading lockup = optional
eyebrow + heading + a short gold rule beneath (`SectionHeading`).

## Layout & rhythm

- **Width:** `components/ui/Container.tsx` — `wide` (1240px) is the content cap;
  `narrow` (680px) is the legal-copy reading measure at 17px; `read` (760px) is
  the blog article's, at 19px. Both reading widths are set by line length
  (~75–77 characters), not by the grid. Background colour is full-bleed on the
  outer `<section>`; only the content is capped.
- **Bands:** compose with `components/ui/Section.tsx` — declare `tone`
  (`sand` / `sand-deep` / `ink` / `white`) × `space` (mobile totals `tight` 52 ·
  `normal` 60 · `loose` 68; **desktop is one shared 96px split 45/51 for every
  step**, so no band boundary is lopsided), never hand-rolled section
  padding. **The mobile column is ~60% of the desktop one, not a scaled copy** —
  stacked bands read wider than side-by-side ones at the same value.
  Content-to-content across a boundary: ~64px on a phone, ~104px on desktop.
- **Bottom padding runs deeper than top, on purpose** — 8px at `md`, 12px on
  mobile. A band opens on a heading whose glyphs sit ~7px below their line box
  and closes on a hard edge, so equal padding reads top-heavy; on a phone the
  bottom strip also sits directly under a photograph, which compresses it
  further. The split (`normal` = `pt-6 pb-9 md:pt-11 md:pb-13`) makes the two
  *visible* gaps match. Only `AboutNarrative` opts out — its top is clearance
  under the booking card.
- Sharp corners are the convention (`rounded-none` on cards and buttons); the
  booking card and pill nav markers are the deliberate exceptions.
- No gradients-as-decoration and one shadow only (the booking card). The
  restraint is the premium signal.

## Components

### Buttons (`components/ui/Button.tsx`)
One CTA. Gold fill + `ink` text; hover **inverts** the fill (never
`hover:opacity`). Square corners. `buttonClassName()` is exported so a real
`<button type="submit">` matches the link-shaped CTAs.

### Nav dropdowns (`PropertyHeader` · `MobileNavOverlay`)
Ubud's menu has three submenus (Offers, SPA, Retreat); Seminyak's is flat.

On desktop the panel opens on **hover *and* `focus-within`, in pure CSS** — no
React state, so it works before hydration and for keyboard users alike. It is an
extension of the header, not a floating card: same `ink` fill, a gold hairline on
top, square corners, letter-spaced uppercase items. The panel sits at `top-full`
with its own `pt-4`, so the gap between bar and panel *is* the panel's padding
and the pointer never crosses dead space on the way down. A small gold chevron
marks a parent and flips when open.

On mobile the overlay is a page, not a dropdown, so children are simply indented
one level behind a short gold rule and set smaller — and the list gains
`overflow-y-auto`, because 8 parents plus 8 children is taller than a phone.

### Header (`property/PropertyHeader.tsx`) — **always solid, never transparent**
One `sticky` `ink` bar on every page: 68px (72px at `lg`), a gold hairline
gradient under it, a soft shadow, logo 128×46. It has **no** transparent /
over-hero variant — no `overlay` prop, no scroll listener, no scrim — and the
hero starts below it, not behind it. Reason: gold-on-photography is only legible
while that particular slide stays dark in that particular corner, and the heroes
are a slideshow. Carries the Book Now CTA. Nav appears at `lg` (the 7–8 items
don't fit a tablet alongside the logo + CTA).

### Hero (`property/PropertyHero.tsx`)
Full-bleed slider, bottom-left typographic lockup, slow Ken-Burns push-in.
Navigated by **gold bullet indicators** (one centred row, no arrows). A
single-image gallery (Ubud) shows no controls.

### Booking bar (`property/BookingSearchBar.tsx`)
A `sand-deep` card **overlapping the hero's bottom edge**, framed in a **thick
`ink` border** — the live widget's brown kept as structure rather than as a
filled dark panel, which is what stops it reading as a third dark slab under the
hero. Fields split by `ink/15` hairlines; labels and the small marks (the date
arrow, the `+`) in `primary-deep` per the contrast rule; values in `ink`. Search
stays a full-strength gold block with `ink` text — the only saturated area on the
card. The one shadow on the site.

### Testimonial (`property/TestimonialCarousel.tsx`)
`sand-deep`, centred — the only heading on the site that isn't left-aligned. Set
for a light surface throughout: `ink` quote, `primary-deep` attribution and
active indicator rule (full gold at 1px disappears on cream), `ink/25` arrows
that fill gold on hover.

### Cards (`property/LinkCardGrid.tsx`) — **fixed height, not aspect-ratio**
Every card in every grid shares ONE height (`h-44` mobile / `h-60` = 240px
desktop) and crops its photo with `object-cover`. This is deliberate: an
aspect-ratio prop made height vary with width (a 2-up card towered over a 4-up
one) and let portrait source photos stretch the card. Fixed height means all
cards line up, the frame is always landscape-or-square, and a tall photo is
cropped, not allowed to grow the card. Column count (2/3/4) sets the card
*width* and label size; height is constant. Label sits bottom-left over a
bottom-weighted gradient with a gold rule that extends on hover. The 4-up stays
**two columns until `lg`** — four ~160px tiles against a 240px height is a
portrait card, the exact shape this grid exists to prevent.

### About + offer (`property/AboutNarrative.tsx`)
The "About Us" narrative and the "Best Price Guaranteed" offer are **one
section**. Explicit grid: heading top-left, a dark offer plate bottom-left
(dark so the gold promo code keeps contrast on the light band), narrative
spanning the right. DOM order heading → narrative → offer so the mobile stack
reads sensibly. The **CTA button's bottom edge sits on the plate's bottom edge**
— `lg:justify-between` on the text column pushes the closing block down, `h-full`
+ `justify-center` on the plate makes it reach the same line. Splits at `lg`;
below that it stacks and the paragraphs cap at `34rem`.

### Footer (`property/PropertyFooter.tsx`) — **compact, single row**
Four columns on one row: **brand column** (logo + Book Now + social) beside
**Menu**, **Contact**, **Blog**, then a thin legal bar (copyright + Terms /
Privacy). The CTA lives in the grid, not on a separate banner row above it. Tight
gaps (`gap-x-10 gap-y-8`, `pt-9 md:pb-6`); the gold `border-t-2` and gold eyebrow
headings carry the premium note without spending height. Desktop footer ≈ 308px.
The legal bar is `mt-0 pt-2 sm:mt-4 sm:pt-4`. On a phone the columns stack, so
its rule lands right under the last blog title and takes the same 8px above /
8px below the `divide-y` gives every blog row — it reads as one more row of that
list rather than a separated block. From `sm` it spans a grid with ragged column
bottoms and goes back to 16px either side. Mobile keeps `pb-24` to clear the
fixed booking bar.

### Listings (`property/RoomList` · `PackageList` · `TreatmentList`)
The three shapes the content pages are built from. All obey the same rules as
the cards above: square corners, `object-cover` crops at a fixed height, gold
rules, `ink` headings, no card container and no shadow.

- **`RoomList`** — accommodation. Photo, name, three spec lines (bed / area /
  occupancy) with gold glyphs, then Check Rates (solid) + Details. Two columns
  at `lg`. `mt-auto` on the action row so buttons share a baseline across a row.
- **`PackageList`** — offers, retreat programmes, dining venues *and* the tours.
  Rows of photograph-beside-text that **alternate sides at `lg`** and stack
  image-first below it. Benefits run two columns from `sm` (the Ubud lists are
  19 items). One component on purpose — a tour and a package are the same shape;
  don't add a parallel one.
  The benefits list and the tour notes sit inside **`ui/ReadMore`**, clamped to
  128px behind a "Read more" toggle. Not decoration: those columns measured
  725–905px against a 352px photograph, so a third of the row was empty band.
  The clamp is applied only where a real overflow is *measured*, so the dining
  and retreat rows — which already end above their photograph — keep no control
  at all. The heading ("Discover Benefits") stays outside the clamp so the
  collapsed state still names what it is holding back.
- **`TreatmentList`** — the spa price menu, which genuinely isn't that shape.
  Duration/price options are hairline-divided rows with gold text links, not
  buttons: ten CTA buttons down a page would break the rule that there is one
  button treatment and it means "the main action". The section's single solid
  Button is the closing Reserve Now.

`property/ImageGallery.tsx` backs all of them — a fixed-height frame navigated
by the hero's gold bullet indicators, showing no controls at all for a single
photo.

### Detail pages (`property/RoomDetail` · `property/ExperienceDetail`)
The two templates behind the 28 pages below the nav. Both open with a
`PropertyHero`, then run standard `Section` bands. `ExperienceDetail` renders
each block only if the page has it (inclusions, price, FAQ, gallery) and pulls
its band tone from a counter over the blocks it *actually* emitted, so a sparse
page still alternates sand / sand-deep instead of repeating one surface.

### FAQ (`property/FaqList`)
Native `<details>/<summary>` — opens with no JavaScript, keyboard- and
screen-reader-accessible for free, and keeps the page a Server Component.
Answers are always in the DOM, so the copy stays indexable — the same reasoning
as `Reveal` never hiding content permanently.

**Compact by design**: a closed row is 49px (`py-3`, 17/18px question), down
from 61px. Six questions stack in 294px rather than 366px.

The marker is the **header's own gold chevron**, rotating 90° → −90° on open,
not the `+` it used to be. A plus reads as "expand a tree"; the site already has
one affordance that means "there is more under this", and reusing it is what
makes the block read as a dropdown at a glance.

**The question is the one heading on this site that isn't `ink`.** The site rule
is dark headings with gold as accent only — but a closed accordion is a stack of
near-identical rows, and colour is what ranks the question above an answer set
in the body face without spending height on an element that has to stay
compact. Question: heading face, 400, `primary-deep` (the brand's brown),
slight tracking. Answer: body face, 300, `text`. Measured 4.92:1 and 9.76:1.
Full-strength gold is **not** an option here — 2.39:1 cannot carry text at this
size, which is why it is `primary-deep`.

Note the block currently renders on exactly one route: of 18 entries in
`data/experiences.ts`, only `wellness/yoga` has a non-empty `faq` array.

### Blog (`property/PostGrid` · `property/PostBody`)
**Editorial hierarchy, not a uniform grid.** The index leads with the newest
post at full width — photograph one side, headline and excerpt the other — then
runs the remainder as a compact 3-up card. One large item plus one repeating
size is how a magazine creates rhythm; fifteen identical cards read as a
catalogue and give the eye nowhere to land. This is *not* a licence for random
card sizes — the cards below the lead stay one fixed height, which is the same
rule `LinkCardGrid` enforces.

The lead splits at `lg` like every other split here, and drops to `featured={false}`
automatically under four posts (a 2- or 3-post list has no hierarchy to express)
and explicitly on an article's "more from the blog" row, where leading one post
would out-shout the article being read.

Cards otherwise follow `LinkCardGrid`'s rules (fixed photo height,
`object-cover`, square corners, gold rule that extends on hover) but put the
headline *below* the photo — a title has to stay readable at length, which a
label over a gradient does not.

Cards carry `date · N min read` and a two-line excerpt. The excerpt is clamped
rather than trimmed in the data, and the closing gold rule hangs off `mt-auto`
so the marks line up across a row whose titles wrap to different depths.

**The article: structure first, decoration second.** An earlier pass set the
piece as a print magazine feature — drop cap, a gold hairline stacked above
every heading, the lot. That was removed, for two reasons. Display-serif
editorial is the single most saturated "designed article" look there is, so it
reads as generic rather than considered; and the rule-above-every-heading
device does not survive this content, where one post carries twenty-one
headings and the page becomes a ladder of identical gold ticks. Hierarchy now
comes from scale and space, which is what scales to a 1,900-word post.

- a **standfirst** (the post's own excerpt) under a `date · N min read` line,
  closed with the gold rule. Reading time is derived from the post's words at
  200wpm — metadata, not written copy;
- the **opening paragraph is set larger** (19/21px, `ink`) as a lead-in;
- **point lists** are the main event — see `postBlocks.ts` below;
- **photographs are flush with the text, at exactly the same width.** They used
  to break the measure — 900px against a 680px column at `lg`. Breaking the
  measure is a real editorial device, but it needs a wide gutter and a
  consistent rhythm to read as one; with a photograph every few paragraphs and
  nothing else escaping the column, all it communicated was that two edges
  failed to line up. Verified by measurement: container, paragraphs and images
  all run 253 → 1013 at 1280px. The exception is an image *inside* a point
  list, which aligns to its item's text column (688px) rather than the article's
  — it belongs to that item, and the rule is still "flush with the text beside
  it";
- headings are scale and space only — no rule, no eyebrow;
- body copy runs 17/19px at 1.85 in a **`read` (760px) container**, measured at
  77 characters a line. `narrow` (680px) stays what the legal pages use; the
  article needed the extra width back once its photographs stopped escaping,
  and 19px is what keeps 760px inside a sane measure.

**`postBlocks.ts` restores list structure the WordPress import dropped.** Three
posts write their points as marker punctuation inside an ordinary paragraph
("- Balinese Purification Ceremony at Tirta Empul", "1. Traditional
Experiences"). The converter only recognised real `<ul>` markup, so all
seventeen came through as body paragraphs — the posts that are *literally
listicles* rendered as the flattest text on the site, markers sitting inline
like typos. They are now real `<ul>`/`<ol>`s with the marker in its own gutter,
so the labels start on one vertical line and the piece can be scanned.

Every word is the source's own; only the marker punctuation is replaced by a
marker. **Dashed runs are never renumbered** — one of them is titled "10
Romantic…" and writes eight points, and generating numerals would assert a
count the copy doesn't have. Posts without markers pass through untouched; this
does not guess structure that isn't stated.

`parseInline` in the same file resolves the source's `[link:URL]label`
shorthand into real links. Two posts carry one each, and they had been
rendering as visible text — see the constraint in CLAUDE.md.

#### The article block contract (what a CRUD should emit)

`ArticleBlock` in `postBlocks.ts` is the whole vocabulary. An editor writes
these directly; `toArticleBlocks` passes anything it already recognises through
untouched, so the recovery passes below are a one-time migration concern, not a
runtime dependency.

| Block | Shape | Renders as |
|---|---|---|
| `heading` | `{ text }` | `<h2>`, 24/29px `ink`, space above only |
| `paragraph` | `{ text }` | 17/19px `text`; first one is the 19/21px lead; `[link:URL]label` becomes a link |
| `list` | `{ items[] }` | gold-dash bullets, one line each |
| `image` | `{ src }` | full measure width (760px), flush with the text |
| `points` | `{ ordered, items[] }` | marker in its own gutter + heading-face label + the item's own body blocks |
| `price` | `{ columns[], rows[][] }` | a real `<table>`; last column right-aligned `ink`, headers as gold eyebrows, wrapper scrolls on a narrow phone |
| `faq` | `{ heading, items[] }` | its own `<h2>` plus `FaqAccordion` — the same rows the wellness pages use |

**Three recovery passes run in a fixed order** (`faq` → `price` → `points`),
most-specific signal first, because the weaker ones would otherwise mis-claim
the same paragraphs. What each found in the imported content:

- **`faq` — 88 question/answer pairs across 9 of the 17 posts.** Published as
  alternating paragraphs under a heading, indistinguishable from body copy, so
  over half the blog ended in a wall of short paragraphs. The trigger is a
  paragraph ending in `?` followed by one that doesn't, three times over; the
  heading above it is absorbed so the section isn't titled twice, and its
  original wording is kept ("FAQ", "Find Your Answer", "Hatha Yoga FAQ",
  "Learn More"). Headings that end in `?` are left alone — several posts use
  one as a legitimate section title.
- **`price` — one rate table, in the hot-stone-massage post.** A three-column
  table serialised *column by column*: the word "Service", four treatment
  names, "Duration", four durations, "Cost (IDR)", four prices. Read in order
  it is nonsense — each price sat five paragraphs from what it cost. A run of
  short paragraphs is a table when it divides into `c` columns of one header
  plus `k` values and **exactly one column is entirely money while no header
  is**; that pair of conditions is what disambiguates the partition (fifteen
  cells also divide 5 × 3, but that puts prices in the header row).
- **`points` — 17 items across 3 posts.** Covered above.

All three are lossless: an unrecognised block passes through unchanged.

What must not change is the *measure* — the article sits at ~77 characters a
line, and that number is the constraint, not the pixel value it happens to
produce. `PostBody` renders a block list rather than injecting CMS HTML, so
posts inherit this site's typography and nothing from WordPress can inject
markup.

`ReadingProgress` is a hairline gold bar pinned to the header's lower edge. It
is `aria-hidden`, carries no content and starts at zero width, so a failure
costs a progress bar and not information — the same standard `Reveal` is held
to. It writes width straight to the node inside a `requestAnimationFrame`
rather than through React state: a `setState` per scroll frame is exactly the
weight a reading aid must not add.

### Forms (`property/ContactForm` · `property/InquiryForm`)
One field style: underlined, not boxed — a hairline that turns gold on focus,
`primary-deep` uppercase labels. `ContactForm` is the Contact pages' fixed five
fields; `InquiryForm` is the data-driven one (`InquiryField[]`) behind the
Wedding and tour booking forms. Both sit in a `narrow` Section. Neither sends
anywhere — a Server Action would replace `handleSubmit`.

### Awards (`property/AwardsRow.tsx`)
Short badge row on `ink`. **Each badge box is a 56/68px square that hugs the
mark** — it used to be an equal-column grid, which stretched every cell to the
full column width (224px at 1240) while the badge images are square, so each
cell rendered a 68px mark inside 224px and left 156px of dead area. Squares
remove that; the space between badges becomes real spacing that
`justify-between` distributes. Seminyak = static row; Ubud = marquee (already
square).

**Image rule this makes explicit:** every *content* image on the site uses
`object-cover` at a fixed frame height, so no photograph can ever letterbox.
`object-contain` is reserved for marks that must not be cropped — the logo and
these badges — and those boxes must match the mark's own aspect ratio.

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
