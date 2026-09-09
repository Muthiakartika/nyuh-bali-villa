# Sanity content system

The website keeps its existing React components, Tailwind tokens, fonts, spacing and responsive behaviour. Sanity supplies structured content and section order; it never stores CSS or arbitrary HTML.

**Nothing changes on the public site until you configure a project.** Until `NEXT_PUBLIC_SANITY_PROJECT_ID` is set — or when a matching document has not been published — every route continues to render the content in `src/data/`, exactly as it does today. That is what `isSanityConfigured` in `src/sanity/env.ts` guards, and it is what makes this safe to ship before a single document exists.

## 1. Create and connect the Sanity project

1. Create a project and a `production` dataset at [sanity.io/manage](https://www.sanity.io/manage).
2. Copy `.env.example` to `.env.local` and fill in:

   ```dotenv
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   NEXT_PUBLIC_SANITY_API_VERSION=2025-02-19
   NEXT_PUBLIC_SANITY_STUDIO_URL=/studio
   SANITY_STUDIO_PREVIEW_ORIGIN=http://localhost:3001
   SANITY_API_READ_TOKEN=viewer-token
   SANITY_REVALIDATE_SECRET=a-long-random-secret
   ```

   `SANITY_API_READ_TOKEN` must be a **Viewer** token and must never carry the `NEXT_PUBLIC_` prefix. Generate the revalidate secret with `openssl rand -hex 32`.

3. In Sanity Manage → API → CORS Origins, add the production origin with credentials enabled. Add `http://localhost:3001` for local preview work.
4. Open `/studio` on the running site, or deploy the Studio separately with `npm run sanity:deploy`.

## 2. Versions — deliberately not healthylook's

This setup mirrors the healthylook project's architecture file for file, but **not its dependency versions**. healthylook runs Next 15 with `next-sanity@11` / `sanity@4`; this project is on **Next 16.2.10**, and `next-sanity@13` requires `next ^16` and `sanity ^5.29 || ^6`. Installing healthylook's versions here would not build.

Two API differences follow from that, both already handled:

- **`defineLive` no longer takes `stega` or `fetchOptions`.** `stega` is now a per-call option on `sanityFetch` and resolves itself from `draftMode()` outside strict mode, which is what healthylook's `stega: true` was for. The 60-second ISR fallback lives on the published-client path in `src/sanity/lib/client.ts` instead.
- **`revalidateTag` takes a cache profile in Next 16.** The webhook route passes `{ expire: 0 }` — a full purge, which is what a publish means. A named profile such as `"max"` would leave long-lived entries in place.

## 3. Import the existing content

`scripts/sanity/migrate.ts` imports everything in `src/data/` — 58 documents and 198 image references. Check what it will do before touching the dataset:

```bash
npm run sanity:migrate:dry
```

A dry run needs no credentials and writes nothing; it prints every document it would create and how the article-block recovery landed.

To write for real, pick whichever authentication actually works for you:

```bash
npm run sanity:migrate
```

uses your `npx sanity login` session. If that login cannot complete — a stale Sanity session in the default browser is enough to break the callback — put an **Editor** token in `SANITY_API_WRITE_TOKEN` and run:

```bash
npm run sanity:migrate:token
```

That path builds its own client from the token and never asks the CLI for a session, so it needs no login at all. It is also the one to use from CI.

| Flag | Effect |
|---|---|
| *(none)* | Creates missing documents only. Editor changes survive a rerun. |
| `--dry-run` | Prints the plan, writes nothing, needs no credentials. |
| `--upload-images` | Downloads each image and uploads it to Sanity instead of hotlinking. Off by default. |
| `--only=posts,legal` | Runs just those steps. Step names: `properties`, `settings`, `testimonials`, `rooms`, `experiences`, `packages`, `categories`, `pages`, `posts`, `legal`. The `pages` step is the one to rerun with `--replace` after editing a route's content file — it is a seed, and `createIfNotExists` would leave the published document as it was. |
| `--replace` | `createOrReplace` instead of `createIfNotExists` — **discards editor changes**. |

The `categories` step is the one that does not only create. It writes the seven
category documents *and* patches each post's `categories` field, because the
posts already exist and `createIfNotExists` would leave every one of them
untagged. It is a field patch rather than `--only=posts --replace` precisely so
a post keeps whatever an editor has since written into its body.

Every migrate script already ends in `--`, so one `--` from npm is enough:

```bash
npm run sanity:migrate:token -- --only=posts --replace
```

Without that trailing `--` in the script, `sanity exec` claims the flags as its own and rejects them rather than passing them to the migration.

Check the first line of output says the mode you expected before believing a `--replace` run did anything.

**Document ids must not contain a dot.** `safeId` joins with `-`, and that is
load-bearing rather than cosmetic. Sanity's default public grant is
`_id in path("*")`, which matches only single-segment ids — the same rule that
hides `drafts.foo`. With healthylook's `prefix.slug` convention, 57 of these 58
documents were invisible to every tokenless read on a dataset marked *public*;
only `siteSettings`, the one id without a dot, came back. Server rendering
never noticed because it reads with a token. What it silently breaks is Live
Content in the browser and any public API consumer.

**Two things this migration does deliberately.**

*Posts are stored as recovered blocks.* `src/components/property/postBlocks.ts` says its three recovery passes "are what a migration would run once", so the script runs `toArticleBlocks` and writes the result. The dry run confirms it lands as that file predicts — **9 FAQ blocks** ("nine of the seventeen posts"), **3 point lists** ("three posts write their points as marker punctuation") and **1 rate table** ("one table found, no false positives"). After this the listicles are real lists and the 88 question/answer pairs are real FAQ blocks in the CMS, not paragraph runs re-derived by heuristics on every render.

*Images stay hotlinked.* The site points every `<Image>` at nyuhbalivillas.com's own CDN (see `next.config.ts` and CLAUDE.md), and the migration keeps it that way: each image field is written with the live URL in `externalUrl` and no uploaded asset. Nothing is copied into Sanity, a migrated page renders the exact photograph it renders today, and the import needs no bandwidth or asset storage.

Moving an image into Sanity later needs no migration and no code change — drop a file onto the image field in the Studio and the upload wins, because `imageUrl` in `src/sanity/lib/content.ts` prefers an asset over `externalUrl`. To move everything at once, rerun with `--upload-images --replace`; uploads are keyed on the source URL, so an interrupted run resumes rather than starting over, and any download that fails keeps its hotlink instead of leaving the field empty.

## 4. How a page actually gets its content

Every route follows the same three steps, and every step has a fallback, which
is why the site never depends on the CMS being reachable.

```
route (page.tsx)
   │  await getRooms("ubud") / getPostByPath(...) / getPropertySite(...)
   ▼
src/sanity/lib/content.ts            ← the only place that asks "published yet?"
   │  sanityFetch(query, { tags })
   ▼
src/sanity/lib/client.ts
   │  1. Live Content  (live.sanityFetch)   — subscribes, updates without a deploy
   │  2. published API (fetchPublished)     — retried when Live is empty or fails
   │  3. null                               — both failed, or no project configured
   ▼
back in content.ts
      null or empty  →  return the src/data value unchanged
      documents      →  convert to the site's own types and return those
```

Three consequences worth holding onto:

- **An unpublished document is not an error.** `sanityFetch` returns `null`, and
  the resolver hands back `src/data`. That is why all 76 pages rendered
  byte-identically before a single document existed, and why they still do now.
- **The components never learned a second shape.** Conversion happens once, in
  `content.ts`, into the types the renderers already took (`RoomDetail`,
  `Post`, `PropertySite`). A renderer cannot tell where its data came from.
- **`getPropertySite` falls back field by field**, not document by document. A
  half-filled property keeps the phone number that page already showed.

### Cache invalidation

```
editor clicks Publish
   │
   ├── Sanity Live pushes to any open page               (seconds, no deploy)
   └── webhook → POST /api/revalidate/sanity
                    → revalidateTag("sanity:post:/ubud/…", { expire: 0 })
```

A 60-second ISR fallback sits under both, so a webhook that never arrives
delays a change rather than freezing it.

### Where a change lands

| You edit | The site picks it up |
|---|---|
| a document in `/studio` | on publish, via Live + webhook |
| `src/data/*.ts` | next build — it is the fallback, still live for anything unpublished |
| a schema in `src/sanity/schemaTypes` | after `npm run sanity:typegen` and a redeploy |

## 5. Editing model

| Document | Backs | Falls back to |
|---|---|---|
| **Page** | a new route at its own path, via an ordered `sections` array | 404 if unpublished |
| **Blog post** | all 17 posts, across every prefix | `src/data/posts.ts` |
| **Blog category** | the label on every blog card and article | `POST_CATEGORIES` in `src/data/posts.ts` |
| **Room or villa** | the 10 villa detail pages | `src/data/rooms.ts` |
| **Experience** | the 18 retreat / wellness / culture pages | `src/data/experiences.ts` |
| **Package set** | the romance packages, on both routes at once | `src/data/packages.ts` |
| **Testimonial** | the carousels | `src/data/testimonials.ts` |
| **Legal page** | Terms & Conditions, Privacy Policy | `src/data/legal.ts` |
| **Property** | header, footer, nav, contact, booking, awards | `src/data/properties.ts` |
| **Site settings** | site-wide defaults | `src/data/seo.ts` and constants |

Background and layout choices are controlled enums. Editors cannot enter CSS classes, scripts or unrestricted HTML.

Four modelling decisions worth knowing:

- **Image fields hold either an upload or a hotlink.** `imageWithAlt` carries an optional `externalUrl` alongside the usual asset, and the resolver prefers the asset. That is what lets the content move into Sanity now while the photographs stay on the live CDN until someone decides otherwise — see section 3.
- **Blog categories are ours, not WordPress's.** The live site's taxonomy is two
  buckets — `ubud-news` (16 posts) and `seminyak-news` (2), no tags — which just
  restates `Post.property` and reads as nothing on a card. The seven categories
  here are topical, and every label reuses a word the site already navigates by
  ("Stay", "Wellness", "Retreat", "SPA", "Romance", "Explore Bali", "About Us"),
  so the blog gains a taxonomy without new brand copy. `toPost` passes whatever
  the CMS returns straight through rather than matching it against the file, so
  a category added or renamed in the Studio shows up on the card as authored.
- **Article bodies are typed blocks, not portable text.** `src/components/property/postBlocks.ts` says its `ArticleBlock` union "is the contract for the coming CRUD", and its three recovery passes exist only because the imported WordPress posts arrived flattened. Authoring `points`, `faq` and `price` blocks directly means those passes see correct blocks and let them through untouched — portable text would have meant flattening back to paragraphs and asking the heuristics to guess again.
- **`Property` fields fall back individually, not as a document.** It carries thirty unrelated values; a half-filled property must not blank the phone number in the footer of every page it owns.
- **Experiences keep `programs` tiers** rather than one flat inclusions list, for the reason `src/data/experiences.ts` gives: what you get depends on how long you stay, and flattening the tiers "lost the whole point of the section".

## 6. The page builder

A `page` document is an ordered `sections` array. `PageBuilder` switches on
`SanitySection` — the handwritten union in `src/sanity/types.ts` — and each
branch renders through a component the site already has, so a CMS page and a
hand-written route produce the same markup.

### Where a page document is served

```
src/app/[...slug]/page.tsx      catch-all, prerendered from published page paths
```

Next.js gives a static route priority over a catch-all, so this only ever
answers paths nothing else claims: all 44 existing routes keep serving their
own files, and `/` is excluded because `[...slug]` needs at least one segment.
Verified — with the catch-all in place, all 76 existing pages still render
byte-identically to the pre-Sanity build.

Chrome (header, footer, booking widget) stays per **property**, not per page:
the document's `property` field picks which one wraps it. That is the same
rule the legal pages already follow.

### Handing an existing route over

`ManagedPage` lets a route opt in one at a time. Wrap its JSX and nothing
changes until someone publishes a `page` at that path:

```tsx
<ManagedPage path="/ubud/spa" fallbackProperty="ubud">
  … the route's existing JSX …
</ManagedPage>
```

**Every hand-written route uses it — 23 of them, with a seeded `page`
document each.** Both About pages, both Stay/Villas, both Dining, both SPA, all
three Offers/Romance, both blog indexes, both Contact, plus Retreat, Luxury
Retreat, Host Your Retreat, Explore Bali, Culture, Wellness, Wedding and
Complimentary Services. Nothing hand-written is left outside the CMS.

**Seeding changed no page.** Verified by building before and after and diffing
the `<main>` of every one: identical text, identical photographs in identical
order. That is the point — the CMS took the pages over exactly as they were.

What made that possible is where the content lives. Each of these pages keeps
its constants in **`src/data/pages/<page>.ts`** (`HERO_IMAGES`, `DINING`,
`TREATMENTS`, the long intros…), the route imports them to render, and the
migration imports *the same constants* to seed. There is one copy, so a seeded
document cannot drift from the page it was seeded from. Constants had to leave
the route files for a plain reason: a Node script cannot import a module that
pulls in React or `server-only`.

Two pages needed a section type that did not exist, and both are worth knowing
about because the near-miss was tempting in each case:

- **`proseSection`** (Explore Bali's "You are in the Right Hands . . ."), which
  renders `ProseBand`. `richTextSection` looked like the answer and was not: it
  runs portable text at the `read` width (760px) where that band runs the page's
  `wide` container with the paragraphs capped at 62rem. Seeding with it would
  have narrowed a band nobody asked to change. Its `{email}` token is how the
  one linked address stays out of CMS copy — the property document supplies it.
- **`ctaSection`** for Host Your Retreat's closing "Get a Quote for your Event".
  This one *is* the existing type; the block wraps its content in
  `mx-auto max-w-2xl text-center` where the route did not, which changes nothing
  for a short centred heading and a single button, and the build diff confirms
  identical text and images.

Handing over a further route is three steps:

1. **Check every band on it has a section type.** The builder covers 22, but a
   hand-written page can still use a component with no section — the About band
   was one (`aboutNarrativeSection`), the Stay listing another
   (`roomListSection`), the contact body a third (`contactSection`). Add the
   missing type (schema → `schemaTypes/index.ts` → the `SanitySection` union →
   `PageBuilder` → a block in `ContentSections.tsx` that renders **the site's own
   component**, so the CMS page and the coded one produce the same markup).
2. **Move its constants to `src/data/pages/`** and import them back into the
   route.
3. **Wrap the route and seed its document** in the migration's `pages` step,
   then rebuild and diff `<main>` against the previous build before believing it.

### The 23 sections

| Section | Renders through |
|---|---|
| Hero | `PropertyHero` |
| About + Best Price Guaranteed | `AboutNarrative` |
| Room list (written here) | `RoomList` |
| Contact form + photograph | `ContactPanel` |
| Rich text | `SanityPortableText` |
| Heading + paragraphs | `ProseBand` |
| Text with image | grid + `SectionHeading` |
| Gallery | `ImageGallery` |
| Amenities | `AmenityGrid` |
| Card grid | `LinkCardGrid` |
| Collection | `RoomList` / `PostGrid` / `LinkCardGrid` / `TestimonialCarousel` |
| Packages | `PackageList` |
| Programme tiers | `ProgramList` |
| Spa menu | `TreatmentList` |
| Bullet list, Rate table | own markup, matching `PostBody`'s |
| FAQ | `FaqList` |
| Call to action | `SectionHeading` + `Button` |
| Enquiry form | `InquiryForm` |
| Awards, Deals, Instagram, Booking widget | their existing components |

**Collection sections list documents rather than restating them** — the
alternative was making an editor paste every room into every page that lists
it, which is the duplication the room documents exist to remove. Each branch
resolves through the same fallback layer as the routes.

### Seeing it work

```bash
npm run sanity:seed-demo
```

Publishes `/cms-renderer-test` exercising eight section types, including a
collection pulling three real Ubud rooms. Remove it with:

```bash
npm run sanity:seed-demo -- --remove
```

It is a demonstration, not content — do not leave it in a deployed dataset.

## 7. Preview and publishing

The Presentation tool loads `SANITY_STUDIO_PREVIEW_ORIGIN` and enables Next.js Draft Mode through `/api/draft-mode/enable`.

Published changes are picked up by Sanity Live. A webhook gives immediate, deterministic invalidation; the 60-second ISR fallback means a missed webhook delays content rather than freezing it:

- URL: `https://your-domain.example/api/revalidate/sanity`
- Method: `POST`
- Header: `Authorization: Bearer <SANITY_REVALIDATE_SECRET>`
- Projection:

  ```groq
  {
    _type,
    path,
    property,
    "slug": slug.current
  }
  ```

`property` is in the projection because a room or experience slug is only unique within a property, so it joins the cache tag.

Trigger it for create, update and delete on `page`, `post`, `room`, `experience`, `packageSet`, `testimonial`, `legalPage`, `property` and `siteSettings`.

Confirm the webhook exists with `npm run sanity -- hook list`. An empty result means there is no instant production invalidation yet.

## 8. `dynamicParams = false` and the CMS

The room, experience, post **and CMS-page** routes are catch-alls with `dynamicParams = false`, so `generateStaticParams` is authoritative: a document published only in Sanity **must** appear there or its URL 404s. Each builds its list from `getRooms` / `getExperiences` / `getPostPaths` / `getSanityPagePaths`, which return Sanity's documents when they exist and `src/data`'s otherwise.

**This is the one thing that is not instant.** Editing a published page updates in seconds through Live Content and the webhook. Creating a *new* page at a path that has never been built needs a fresh `generateStaticParams`, which means a redeploy. If editors should be able to add pages without one, drop `dynamicParams = false` from `src/app/[...slug]/page.tsx` — the trade is that an unknown path then renders on demand instead of 404ing at the edge.

## 9. Type safety

Schema modules live in `src/sanity/schemaTypes`, queries in `src/sanity/lib/queries.ts`, handwritten runtime contracts in `src/sanity/types.ts`, and the fallback layer in `src/sanity/lib/content.ts`.

After changing a schema or a GROQ projection, regenerate:

```bash
npm run sanity:typegen
```

That extracts `src/sanity/schema.json` and writes `src/sanity/types.generated.ts`, **validating every GROQ query against the schema as it goes** — it is the fastest way to catch a projection that no longer matches its document. Then run:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

`src/sanity/types.generated.ts` is machine-written; `eslint.config.mjs` exempts it from `no-empty-object-type` rather than hand-patching output that regeneration would overwrite.

## 10. Not done yet

- **No route uses `ManagedPage`.** All 44 keep rendering their own JSX, which is why they still diff clean against the pre-Sanity build. Handing one over is a per-route decision, and should be made per route rather than in bulk.
- **New CMS pages need a redeploy** to be reachable — see section 8 for the one-line change that removes that constraint.
- **`UBUD_OFFER_QUOTES`** stays in `src/data/packages.ts`. It is a curated set for the offers pages, distinct from the general Ubud testimonials, and folding the two together would change what renders.
- **The migration's `--upload-images` path has never been run.** Hotlinking is the default and what is in the dataset; the upload branch is only dry-run verified.
