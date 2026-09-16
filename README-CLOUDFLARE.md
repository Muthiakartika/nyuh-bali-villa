# Cloudflare: edge cache and automatic purging

Everything needed to put nyuhbalivillas.com behind Cloudflare without content
going stale: the cache rules the zone should run, the purge that fires when an
editor publishes, and how to check both are working.

Nothing here is active until `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_PURGE_TOKEN`
are set. Until then the site behaves exactly as it does today — the publish
webhook still revalidates Next's own cache, and the purge step answers
`not-configured` instead of failing. That is the state a preview deployment
runs in; it is not a state to launch in.

Two commands do the operating:

```bash
npm run cache:check    # is the token live, and what is the edge holding? purges nothing
npm run cache:purge    # empty the zone, with before/after proof
```

---

## 1. The problem, in one paragraph

There are **two** caches between an editor and a visitor, and they are cleared
by different things.

```
editor clicks Publish in /studio
   │
   ├── Sanity Live pushes to any open page                    (seconds)
   └── webhook → POST /api/revalidate/sanity
                    ├── revalidateTag(…, { expire: 0 })   ← Next / Vercel
                    └── purgeCloudflare(…)                ← Cloudflare's edge
```

`revalidateTag` has always been there, and on a site served straight from
Vercel it is the whole story. Behind Cloudflare it is half of one: with the
HTML cache rule below in place, most visitors are answered by an edge server
that never asks the origin anything. An origin that has quietly regenerated
changes nothing for them. The edge copy has to be dropped explicitly, which is
what `src/server/cloudflare.ts` does in the same request.

A 60-second ISR fallback sits under the Next half, so a missed webhook delays a
change rather than freezing it. The edge has a floor of its own — the 1-day
edge TTL in §3 — so a purge that never happens costs a day, not a month. Both
are backstops, not the mechanism: a failed purge is still logged loudly rather
than swallowed, and §6 is worth reading before launch day.

---

## 2. Before the cache rules: DNS and TLS

1. **Add the domain in Vercel first, with the Cloudflare proxy off** (grey
   cloud). Vercel issues the certificate over the live DNS record, and an
   orange-clouded record can leave it stuck on "Issuing". Wait for Vercel to
   show the domain as Valid.
2. Turn the proxy **on** (orange cloud) for the apex and `www`.
3. SSL/TLS → Overview → **Full (strict)**. Vercel presents a real certificate;
   anything less than strict is a downgrade for no gain.
4. SSL/TLS → Edge Certificates → **Always Use HTTPS** on.
5. Speed → Optimization → **leave Rocket Loader off.** It reorders and defers
   scripts, and this site has two that cannot survive that: the booking
   engine's loader (`<script id="propInfo">`, which calls `replaceWith` on
   itself) and the Instagram feed's `embed.js`, which defines a custom element.
6. Caching → Tiered Cache → **Smart Tiered Caching on** if the plan offers it.
   It means one origin fetch per page rather than one per edge location.

---

## 3. The cache rules

Four rules, in `scripts/cloudflare/cache-rules.mjs`. They are kept in the repo
rather than only in the dashboard so that what the edge is doing is reviewable
in a diff, and so a zone can be rebuilt from scratch.

```bash
npm run cloudflare:rules:dry
```

prints exactly what would be sent;

```bash
npm run cloudflare:rules
```

applies it — but refuses first if the zone already holds a cache rule this
script did not write, printing them, so nothing is lost silently.

### What they say

**Every rule is scoped to `nyuhbalivillas.com` and `www.nyuhbalivillas.com`**,
and that is not decoration. A Cloudflare zone covers the apex *and every
subdomain of it*, so a rule matched on path alone would also apply to
`booking.nyuhbalivillas.com` — the STAAH booking engine. Holding that at the
edge would freeze a live availability calendar with a nightly rate on every
date. `ubudnyuhbali.com` is deliberately absent: it carries Ubud's email and
does not serve this site.

| # | Matches (on those two hostnames) | Setting | Why |
|---|---|---|---|
| 1 | `/api/*`, `/studio*`, `/_next/image*`, or either draft-mode cookie | **Bypass cache** | Forms, the publish webhook, the signed-in Studio and unpublished previews must never be served from a cache. `/_next/image` is on the list for a different reason — below. |
| 2 | `/_next/static/*` | **Cache, respect origin** | Content-hashed filenames, and the origin already says `immutable`. Nothing to decide. |
| 3 | `/uploads/*` | **Cache, respect origin** | The 352 files carried over from WordPress's media library. `next.config.ts` sends `max-age=2592000` for them — below. |
| 4 | everything else (the 74 pages) | **Cache, edge TTL 1 day, browser TTL respect origin** | The rule that makes the site fast, and the one the purge exists for. |

### Why one day and not thirty

Publishing drops the edge copy within the second, so the edge TTL is only ever
how long a page *nobody edited* stays warm. That makes it worth choosing for
the case where the purge **fails** rather than the case where it works: a token
revoked, a WAF rule added in front of the webhook, an outage. With a month, the
wrong page survives a month and nothing in the Studio would say so. With a day,
the site heals itself overnight.

The speed cost is close to nil. A page anyone actually visits stays hot; one
nobody visits was cold either way.

### The one idea the whole design rests on

**Long edge TTL, and no browser TTL of our own.**

Cloudflare holds a page for a day, so almost nobody waits for the origin. The
browser is left with whatever Next already sends for a prerendered page
(`max-age=0, must-revalidate`), so it re-asks Cloudflare on every navigation.
That is what makes a purge take effect for everyone at once: there is no copy
anywhere that a purge cannot reach.

Override Browser TTL with a long value and you buy a little speed and lose that
property completely. A visitor who loaded the old page keeps it until their own
clock runs out, and no purge, publish or redeploy can reach them. If someone
reports "the change is live for me but not for them", this is the first thing
to check.

### Why `/uploads/*` is not left to rule 4

`public/uploads/` holds 315 photographs and 37 menu PDFs under WordPress's own
`/YYYY/MM/` layout. Rule 4's one-day edge TTL is a number chosen for *pages* —
things whose whole point is that publishing changes them. A photograph at a
fixed path does not change; capping it at a day would have Cloudflare re-fetch
352 files from Vercel every day for nothing.

The rule says **respect origin** rather than naming a number, because
`next.config.ts` already sends `Cache-Control: public, max-age=2592000` for
`/uploads/*` and one place to state a figure beats two that drift apart. Thirty
days and deliberately not `immutable`: these filenames are stable, so a
photograph swapped in under an existing name would otherwise be invisible to
anyone holding the old one, and a month bounds that. Giving the replacement a
new filename busts it immediately when that is not fast enough.

That header exists for a second reason worth knowing. Vercel serves everything
in `public/` as `max-age=0, must-revalidate` unless told otherwise — files
under `_next/static` get a fingerprinted name and a year of `immutable` for
free, but a `public/` file keeps the name it was authored with, so Next cannot
assume it is safe to hold. Without the header every menu PDF pays a conditional
request each time a guest opens it. And if the header ever goes missing, the
fallback is that the edge stops caching these rather than caching them wrongly
— the safe direction to fail in.

### Why `/_next/image` is bypassed rather than cached

The image optimizer answers WebP or AVIF depending on the request's `Accept`
header, and marks that with `Vary: Accept`. **Cloudflare ignores `Vary` outside
Enterprise**, so caching those responses at the edge risks handing AVIF to a
browser that cannot read it — a broken photograph, cached. Vercel caches the
optimized images at its own edge already, so bypassing costs a hop, not the
work.

If those bytes are ever wanted at Cloudflare's edge, remove the ambiguity
first: `images: { formats: ["image/webp"] }` in `next.config.ts` leaves one
format for every browser, and rule 1 can drop its `/_next/image` clause.

### Clicking them in instead

Caching → Cache Rules → Create rule, four times, in this order. The expression
editor accepts the same strings the script sends, and
`npm run cloudflare:rules:dry` prints them.

### What is in the zone today, and what happens to it

The zone still carries the WordPress-era rules, which is what it should carry
while WordPress is still being served. They are a **cutover** job, not a
today job — deleting them now only makes the live old site slower.

| Order | Rule | At cutover | Why |
|---|---|---|---|
| 1 | `Cache Everything [Template]` — `URI Full wildcard https://nyuhbalivillas.com/*` | **replaced** by rule 4 above | Its match misses `www.` entirely, it carries no bypass list at all, and its Edge TTL outlives what the origin asks for — see below |
| 2 | `_GRECAPTCHA` (Disabled) | delete | Already off, and this site uses Turnstile |
| 3 | `Bypass wp admin` — `/wp-admin/*` | delete | No WordPress to protect |
| 4 | `Bypass login` — `/wp-login.php*` | delete | Same |
| 5 | `Bypass Ubud Directory` — `/ubud-directory/*` | delete | Not built here — see the note below |
| 6 | `Bypass Seminyak Directory` — `/seminyak-directory/*` | delete | Same |

`npm run cloudflare:rules` replaces the whole phase in one PUT, so it does all
six at once — and **refuses on the first run**, printing every rule it did not
write, so nobody discards them without reading the list. `--force` is the
second run, after reading it.

**Two values decide whether a purge can reach everyone, and a rules list
cannot answer either** — it shows only that Browser TTL and Edge TTL are *set*,
never to what. Both were measured against the live zone instead.

- **Rule 1's Browser TTL is Respect origin**, measured 2026-09-16 and no longer
  an open question. The probe is to ask the edge for two files whose origin
  headers disagree: the apex HTML comes back `max-age=7200` and
  `/wp-content/uploads/2023/03/Honeymoon-Pool-Villa-1.webp` comes back
  `max-age=604800`. A fixed Browser TTL would have flattened both to one
  number, so the rule is passing the origin's own value through — which is what
  rule 4 above sets too. That takes the worst cutover risk off the list: there
  is no visitor holding a copy a purge cannot reach.
- **Caching → Configuration → Browser Cache TTL** is a *zone-wide* setting and
  not a cache rule at all, so the probe above cannot tell it apart from rule
  1's — it proves only that *neither* is overriding. It is the most commonly
  missed lever here, so confirm it reads **Respect Existing Headers** in the
  dashboard before cutover: Next sends the right header per file type, and one
  zone-wide number is simultaneously too long for HTML and too short for hashed
  assets.

**Rule 1's Edge TTL is longer than the origin asks for, and that is measured
rather than inferred.** `npm run cache:check` against the live apex, with
`SITE_URL` set, reads this back:

    cf-cache-status  HIT
    age              427384s  (4.9 days)
    cache-control    max-age=7200

WordPress asks for two hours and the edge has held that copy for **almost five
days** — so rule 1 carries an Edge TTL of its own, well past the one day rule 4
sets. The exact number is still unread: reading a rule's settings back needs a
Cache Rules → Read token, which nothing in this repo holds, so what is
established is a floor of five days rather than a value. Two consequences, and
the second is the one that bites:

- It is why the edge's copy, not the browser's, is the one to plan around
  here. The browser's expires in two hours and Respect origin keeps it that
  way; the edge's outlives it by days and only a purge ends it.
- **At cutover, stale WordPress HTML can outlive the DNS change by days.** The
  edge answers from its own copy without asking the new origin at all, so
  pointing DNS at Vercel does not by itself put this build in front of anyone
  holding a cached page. `npm run cache:purge` immediately after the switch is
  what makes the cutover visible; it is not optional here, and the 4.9 days
  above is why.

**Rule 1 caches responses that say not to, and that is the cutover hazard a
rules list does not show at all.** `Cache Everything` overrides
*cacheability*, not just TTL. Measured on the live zone the same day:
`/sitemap_index.xml` answers `Cache-Control: private, must-revalidate` and is
served `HIT` at an age of 4.7 days regardless, and `/wp-json/wp/v2/pages`
answers `private` and reports `MISS` — which is Cloudflare storing a copy, not
declining to. Today that is a WordPress staleness quirk and nothing more.
Pointed at Vercel with rule 1 still in place, the same behaviour reaches three
things that matter:

- **`/studio`** — the HTML of an application that is signed in as a person,
  held at the edge.
- **`/_next/image*`** — `Vary: Accept` is ignored outside Enterprise, so a
  browser that cannot read AVIF can be handed one, cached.
- **the two draft-mode cookies** — unpublished content stored where the public
  is served from.

Forms are the exception rather than a fourth entry: Cloudflare caches GET and
HEAD only, so a POST to `/api/contact` was never exposed by this. Rule 1 of §3
is what closes the other three, which is the argument for applying the rules in
the same sitting as the DNS change rather than the week after.

**The rest of the zone, same pass, as a before picture.** `/` and
`/ubud/villa/` `HIT` at 4.9 and 4.5 days. `/robots.txt` `HIT` at 4.9 days —
worth remembering, because a stale `robots.txt` outlives a cutover exactly the
way the HTML does. `/wp-admin/` and `/wp-login.php` are not cached, so rules 3
and 4 are doing their job, and neither is `/ubud-directory/`, so rules 5 and 6
are doing theirs. `www.nyuhbalivillas.com` 301s to the apex and is never
cached, which is why rule 1 missing `www.` costs nothing today and would cost
the entire `www` audience the moment Vercel is serving. And
`booking.nyuhbalivillas.com` answers from `Server: AmazonS3` with no
`cf-cache-status` at all — it is not proxied through this zone, so the
subdomain trap every rule in §3 is scoped against is currently theoretical.
Keep the scoping anyway: a grey-clouded record is one click from being an
orange one.

**A cutover issue the rules list used to reveal, now closed:** rules 5 and 6
imply `/ubud-directory` and `/seminyak-directory` are in use — the in-room
directories a guest reaches from the QR code beside the bed. This project did
not build them when those rules were written, so the URLs would have 404ed the
moment DNS pointed at Vercel. Pass 5 built all four (`/seminyak-directory`,
`/ubud-directory`, `/suite-directory`, `/welcomeaboard`); each is prerendered
and deliberately kept out of the sitemap by `UNLISTED` in `src/app/sitemap.ts`,
matching the live site, which lists none of them either. Rules 5 and 6 can be
deleted with the rest — nothing needs settling with the client any more.

---

## 4. Environment variables

On Vercel (Production, and Preview only if a preview is ever proxied):

| Variable | Value | Needed for |
|---|---|---|
| `CLOUDFLARE_ZONE_ID` | Overview → right-hand sidebar of the zone | every purge |
| `CLOUDFLARE_PURGE_TOKEN` | a token with **Zone → Cache Purge → Purge**, this zone only | every purge |
| `SITE_URL` | `https://nyuhbalivillas.com` | the CLI's before/after probe, and URL-mode purges |
| `CLOUDFLARE_PURGE_MODE` | unset, or `urls` | see §5 |

**Give the runtime token that one permission and nothing else.** A token that
can only empty a cache is worthless to whoever steals it; an "Edit zone" token
can repoint the domain at another server. Purging is all the site ever asks
Cloudflare for.

**The Zone ID sits next to the Account ID and both are 32 hex characters.**
Pasting the wrong one is the single most common failure here — `npm run
cache:check` catches it before a purge does.

**Applying the cache rules needs a second, wider token** — Zone → Cache Rules →
Edit — read from `CLOUDFLARE_RULES_TOKEN`. That is a one-off admin job: keep it
on your own machine in `.env.local`, never in Vercel and never in CI.

For the post-deploy purge, `CLOUDFLARE_ZONE_ID` and `CLOUDFLARE_PURGE_TOKEN`
again as GitHub repository secrets (Settings → Secrets and variables →
Actions), with `SITE_URL` as a repository *variable* if you want the workflow
to print the before/after.

---

## 5. Where each purge comes from

| Trigger | What fires | Scope |
|---|---|---|
| Editor publishes in `/studio` | Sanity webhook → `/api/revalidate/sanity` | see below |
| Vercel finishes a production deploy | `.github/workflows/cloudflare-purge.yml` | everything |
| A person | `npm run cache:purge` | everything, or `-- /ubud /ubud/villa` |

The webhook is already configured for the Next half (README-SANITY.md §7) and
needs no change — the same POST now does both halves.

### Everything, or only the pages that changed

**Purge-everything is the default, deliberately.** A URL purge drops only the
exact URLs it is given, and a page arrived at with `?utm_source=…` is a
different cache entry from the same page without it — so precisely the traffic
a campaign sends would keep the old copy. Against that, this site is 74 static
pages that Vercel regenerates in milliseconds, and publishes are occasional. A
full purge costs close to nothing here.

Set `CLOUDFLARE_PURGE_MODE=urls` (and `SITE_URL`) to trade that for precision
on a busier zone. `src/server/purgeTargets.ts` works out which pages a document
touches:

| Published document | Purges |
|---|---|
| `page` | its own path, plus `/sitemap.xml` |
| `legalPage` | its own path |
| `post` | its path, both blog indexes, plus `/sitemap.xml` |
| `room` | `/{property}/villa/{slug}`, plus the villa listing |
| `experience` | its path and every ancestor down to `/ubud` (plus `/ubud/fitness` for a wellness class) |
| `packageSet` | all three package routes |
| `property`, `siteSettings`, `testimonial` | **everything** — none of the three is confined to one route |
| anything else, or a document with no usable slug | **everything** |

`/sitemap.xml` joins the two document types it is built from, because
publishing either can change which URLs it lists. `legalPage` is left out on
purpose: those two paths are already among the 74, so editing one cannot change
the sitemap's membership. Next's own copy needs no entry here at all — the
webhook always revalidates the `sanity` tag, which the sitemap's queries carry.

The ancestor walk is what covers the listing page without a per-family map: a
detail page's listing is always one of its own ancestors. Falling back to a
full purge on anything unrecognised is the same judgement in the other
direction — over-purging costs a cache miss, under-purging costs a wrong page
served until the edge TTL runs out.

That module is pure — no env, no network — so it can be exercised on its own:

```bash
node --experimental-strip-types -e "import('./src/server/purgeTargets.ts').then((m) => console.log(m.purgeTargetFor({ _type: 'experience', slug: 'wellness/yoga' })))"
```

---

## 6. Verifying

**Start here — is the configuration even right?**

```bash
npm run cache:check
```

It checks the zone id's shape, asks Cloudflare whether the token is live
(`/user/tokens/verify`, which needs no zone permission at all), and prints what
the edge is serving right now. **It purges nothing**, so it is safe against a
production zone at any time. There is no dry run for a purge, which is exactly
why the two things worth knowing beforehand are split out into their own
command.

```
  ✓ zone id has the right shape
  ✓ token is live (status: active)

  What the edge is serving right now:
    cf-cache-status  HIT
    age              551720s  (6.4 days)
    cache-control    max-age=7200
```

An `age` in days on an HTML page is the whole problem this file exists for.

**The last block only appears when `SITE_URL` is set.** Without it the command
still validates the zone id and the token — the two things that actually break
a purge — and prints `not checked — set SITE_URL to probe the live edge` in
place of the edge state. That is easy to read as "the edge is fine" when it
means "nobody looked", so set `SITE_URL` before trusting a clean run.

**Is the edge caching pages at all?** Two requests; the second should say HIT.

```bash
curl -sI https://nyuhbalivillas.com/ubud/villa | grep -i "cf-cache-status\|cache-control"
```

`DYNAMIC` means no cache rule matched — rule 3 is missing, or its expression
does not match. `BYPASS` means rule 1 matched something it should not.

**Is anything overriding Browser TTL?** Ask for two files whose origin
headers disagree and compare what comes back. A rule or a zone-wide setting
that overrides would flatten both to the same number; passing both through
means Respect origin is in force, and that a purge can reach every visitor.

```bash
curl -sI https://nyuhbalivillas.com/ | grep -i ^cache-control
curl -sI https://nyuhbalivillas.com/wp-content/uploads/2023/03/Honeymoon-Pool-Villa-1.webp | grep -i ^cache-control
```

**Is the Studio excluded?**

```bash
curl -sI https://nyuhbalivillas.com/studio | grep -i cf-cache-status
```

must be `BYPASS` or `DYNAMIC`, never `HIT`.

**Does publishing clear it?** Publish any page in the Studio, then request it
again. `cf-cache-status` should be `MISS` on the first request after the
publish and `HIT` after that, with the new copy.

**Did the purge actually run?** The webhook's own response carries it, and
Sanity shows the body under API → Webhooks → the hook → Delivery log:

```json
{
  "ok": true,
  "revalidated": { "_type": "page", "path": "/ubud/villa" },
  "cloudflare": { "ok": true, "purged": true, "scope": "everything", "urls": 0 }
}
```

`"purged": false, "reason": "not-configured"` means the two variables are not
set on the deployment. `"ok": false` means Cloudflare refused; the server log
carries the reason, and it is nearly always a token missing the Purge
permission or scoped to the wrong zone.

---

## 7. Things that go wrong here

Cloudflare names its own failures precisely, and both the site and the CLI pass
them through rather than summarising:

| In the log | Cause |
|---|---|
| `[cloudflare] purge failed: 10000 Authentication error` | The token is wrong, expired, or lacks the Cache Purge permission |
| `[cloudflare] purge failed: 7003` | `CLOUDFLARE_ZONE_ID` is not a zone — almost always the **Account ID**, which sits beside it and is also 32 hex characters |
| `[cloudflare] purge failed: The operation was aborted due to timeout` | Cloudflare did not answer inside 8s. The publish still succeeded; run `npm run cache:purge` |
| nothing at all | One of the two variables is empty, so the purge was skipped. That is the intended behaviour, not a fault |

And the ones that are not about the API:

- **The Sanity webhook starts failing once bot protection is on.** It is a POST
  from a datacentre to `/api/revalidate/sanity`, which is exactly what Bot
  Fight Mode and the managed WAF rules exist to stop. Add a WAF custom rule
  with the **Skip** action for
  `http.request.uri.path eq "/api/revalidate/sanity"`, or point the webhook at
  the `*.vercel.app` origin instead — it purges Cloudflare either way, it just
  stops passing through it.
- **A deploy left the old pages up.** Nothing is published in Sanity during a
  deploy, so nothing fires. That is what the GitHub Actions workflow is for:
  check the run, and check both repository secrets exist.
- **One visitor still sees the old page after a successful purge.** Their
  browser is holding it. Check Browser TTL on rule 3 is still "Respect origin"
  — see §3.
- **A page with a query string is stale while the clean URL is fresh.**
  `CLOUDFLARE_PURGE_MODE=urls` is set. Unset it.
- **Forms break.** Check rule 1 still matches `/api/*`. A cached `/api/contact`
  would answer every visitor with the first visitor's confirmation.
- **Hydration errors, or the booking bar never loads.** Rocket Loader. §2.5.

---

## 8. Deliberately not done

- **No cache-key customisation.** Stripping `utm_*` from the cache key would
  raise the hit rate and close the query-string hole in URL-mode purges, but
  the feature is plan-gated and this site does not need it — purging everything
  already closes that hole.
- **No purge by tag or by prefix.** Both are Enterprise. The URL list and the
  full purge are what every plan has.
- **No `/api/purge` endpoint.** The deploy purge runs from CI with a token CI
  already holds, and a secret-protected endpoint would be one more public
  surface for something nothing needs to call from outside. Same reasoning as
  the missing `/api/turnstile/verify` route in CLAUDE.md.

---

## 9. What must never be crawled, and what enforces it

Cache and crawl are two different questions that keep getting answered in the
same sentence, because the same three URLs come up in both. They are not the
same control and they do not live in the same place: **a cache rule decides
whether Cloudflare keeps a copy; nothing in Cloudflare decides whether Google
keeps one.** Everything below is enforced by this build, and the table says
which layer each piece sits in so a change to one is not mistaken for a change
to the other.

| What | Cached at the edge? | Crawlable? | Enforced by |
|---|---|---|---|
| The 74 pages | yes, 1 day (rule 4) | **yes** — the point of the site | `src/app/robots.ts`, `src/app/sitemap.ts` |
| `/uploads/*` | yes, respect origin (rule 3) | yes | — |
| `/_next/static/*` | yes, respect origin (rule 2) | yes, deliberately | Google renders before indexing; a site that hides its own CSS and JS is judged on the wreckage |
| `/studio` and everything under it | **no** (rule 1) | **no** | `Disallow: /studio` · the route's `robots: { index: false, follow: false }` · `X-Robots-Tag: noindex, nofollow` in `next.config.ts` |
| `/api/*` | **no** (rule 1) | **no** | `Disallow: /api/` |
| `/_next/image*` | **no** (rule 1) | n/a | `Vary: Accept` — see §3 |
| Draft-mode previews | **no** (rule 1) | n/a | the two cookies |
| A **preview** deployment | n/a — not proxied | **no** | `robots.ts` returns `Disallow: /` on `VERCEL_ENV === "preview"`, plus Vercel's own `X-Robots-Tag` |
| The **production** `*.vercel.app` alias | n/a — not proxied | **no** | `src/proxy.ts` 308s every page request to `nyuhbalivillas.com` |
| `?utm_source=…` copies of a page | yes, as separate entries | **no** | the three `utm` `Disallow` lines in `robots.ts` |

### The Studio, three ways, because each covers a different failure

`Disallow: /studio` is a prefix match, so it covers `/studio` itself and every
tool route beneath it (`/studio/structure`, `/studio/vision`, …), which a
crawler would otherwise walk forever. In practice it is the whole of what
matters, because **nothing on this site links to the Studio** — a crawler has
no way to reach it.

The case it does not cover is a URL someone pastes somewhere public. A crawler
may fetch that regardless, so the route's own `robots: { index: false, follow:
false }` metadata is the backstop — and note the two are not redundant in the
way they look: a *disallowed* page is never fetched, so its `noindex` is never
read. That is exactly why the `X-Robots-Tag` header in `next.config.ts` exists
as well, and being a header it also covers the Studio's asset responses rather
than only its HTML.

Rule 1 is the fourth thing, and it is a different kind of protection: it stops
Cloudflare holding a copy of an application that is **signed in as a person**.
Without it, `Cache Everything` would store `/studio`'s HTML at the edge — see
§3, where the live zone is measured doing exactly that to responses marked
`private`.

### The Vercel alias, which is the one Cloudflare cannot touch

A Vercel **production** deployment answers on its own `*.vercel.app` alias as
well as on `nyuhbalivillas.com`, and that alias serves all 74 pages. Two
things that look like they cover it do not:

- **Vercel's automatic `X-Robots-Tag: noindex`** is sent on *preview*
  deployments only. A production alias reports `VERCEL_ENV` as `"production"`
  and is served without it — and, before this, with the permissive robots.txt.
- **These cache rules** cannot help at all. They belong to the zone for
  `nyuhbalivillas.com`; `*.vercel.app` is not in that zone and never passes
  through the proxy. **Everything protecting the alias has to live in the
  build**, which is why `src/proxy.ts` exists and why it is the only
  middleware in this project.

It 308s every page request on a non-canonical host to `SITE_ORIGIN`. The
canonical tags in `layout.tsx` were already correct and absolute, which is most
of the defence — but a canonical is a hint, not a directive, so the duplicate
can still be crawled and occasionally indexed. A 308 removes the question.

Three exemptions, and each one is load-bearing:

| Exempt | Why |
|---|---|
| Anything that is not a production deployment | localhost and previews are supposed to answer on their own hosts; redirecting either would make both unusable |
| `/api/` | §7 recommends pointing the Sanity webhook at the alias *on purpose* when bot protection starts eating it. A 308 only survives a client that follows redirects and preserves the method |
| Any request carrying `cf-ray` | The guard that makes the rule safe. If the proxy were ever pointed at the alias by name — a Host Header Override — "host is not canonical" would be true for *every* live request, and each would redirect to a domain that resolves back through the same proxy. That is not duplicate content, it is the site down in a loop |

**`SITE_URL` must be set on the Vercel production environment for this to do
anything useful.** Unset, `SITE_ORIGIN` falls back to
`https://nyuhbalivillas.com`, which happens to be right — but it is the same
variable `cache:check` and the canonicals read, so set it rather than relying
on the fallback being correct.

### Checking it

```bash
# The Studio is bypassed at the edge, and says noindex on its own.
curl -sI https://nyuhbalivillas.com/studio | grep -iE "cf-cache-status|x-robots-tag"

# The production Vercel alias 308s to the real domain.
curl -sI https://<project>.vercel.app/ubud/villa | grep -iE "^HTTP|^location"

# ...but its API surface does not, so the webhook keeps working.
curl -sI https://<project>.vercel.app/api/revalidate/sanity | grep -iE "^HTTP"

# A preview deployment refuses everything.
curl -s https://<preview>.vercel.app/robots.txt

# Production robots.txt lists the Studio, the API and the three utm rules.
curl -s https://nyuhbalivillas.com/robots.txt
```

The first must never say `HIT`. The second must be `308` with a `location` on
`nyuhbalivillas.com`. The third must **not** be a redirect — if it is, the
`/api/` exemption has been lost and the publish webhook is one WAF rule away
from silently failing.
