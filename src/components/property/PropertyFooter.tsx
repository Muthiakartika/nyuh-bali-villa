import Image from "next/image";
import Link from "next/link";
import type { PropertySite } from "@/data/properties";
import {
  EnvelopeIcon,
  FacebookIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CurrentYear } from "@/components/ui/CurrentYear";

type PropertyFooterProps = {
  site: PropertySite;
};

// The primary footer nav. Terms & Conditions and Privacy Policy live in the
// legal bar, not here, so two pieces of boilerplate don't carry the same weight
// as "villas" and "contact".
//
// Every entry is a real link now that the blog is built too. Both properties
// use /<slug>/villa and /<slug>/discover, but their Offers slugs differ, so
// that one comes from the property data (see `offersHref`).
function buildFooterLinks(site: PropertySite) {
  return [
    { label: "about", href: `/${site.slug}`, inScope: true },
    { label: "villas", href: `/${site.slug}/villa`, inScope: true },
    { label: "offers", href: site.offersHref, inScope: true },
    { label: "Blog", href: `/${site.slug}/discover`, inScope: true },
    { label: "contact", href: `/${site.slug}/contact`, inScope: true },
  ];
}

const columnHeadingClassName = "text-eyebrow font-body block text-primary uppercase";

/**
 * The footer shared by every Seminyak/Ubud page.
 *
 * **Compact single-row layout.** An earlier version stacked three tiers — a
 * brand row with the booking CTA, a labelled column grid, and a legal bar —
 * which ran tall and pushed the Book Now button a full row away from the rest
 * of the footer. This lays everything on ONE row of columns: the brand column
 * (logo + Book Now + social) sits alongside the three information columns, so
 * the CTA reads as part of the footer rather than a banner above it, and the
 * whole block is roughly a third shorter. A single thin legal bar closes it.
 *
 * Same content throughout — every link, the full contact block, the blog
 * titles, the social icons, the legal links — just packed tight. The gold
 * `border-t-2` and the gold eyebrow headings keep it premium without spending
 * vertical space on it.
 */
export function PropertyFooter({ site }: PropertyFooterProps) {
  const footerLinks = buildFooterLinks(site);
  const mailHref = `mailto:${site.contact.email}`;

  const socialLinkClassName =
    "flex h-10 w-10 items-center justify-center border border-white/15 text-primary transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-ink";

  return (
    // Mobile `pb-24` clears DirectBookingDeals, which docks as a full-width bar
    // along the bottom edge on phones; on desktop that bar is a corner card, so
    // the padding drops to `md:pb-6`.
    <footer className="border-t-2 border-primary bg-ink px-5 pt-8 pb-24 sm:px-8 md:pt-9 md:pb-6">
      <Container>
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.8fr_1.15fr_1.25fr]">
          {/* Brand column — logo, the booking CTA, and social, on the same row
              as the rest of the footer so the CTA never floats off alone. */}
          <div className="flex flex-col items-start">
            {/* Goes to `/`, matching the header — one wordmark, one
                destination, wherever it appears. The accessible name carries
                the destination because the image itself is decorative here:
                left as alt text it would announce "Nyuh Bali Villas - Ubud"
                for a link that opens the property picker. */}
            <Link
              href="/"
              aria-label="Nyuh Bali Villas — home"
              className="relative h-[46px] w-[128px] shrink-0"
            >
              <Image
                src={site.logoSrc}
                alt=""
                fill
                sizes="128px"
                className="object-contain object-left"
              />
            </Link>

            <Button href={site.bookingHref} external className="mt-5">
              Book Now
            </Button>

            {/* All three come from the property, not from here. They used to be
                literals — Seminyak's — on a component both properties render,
                so every Ubud page pointed its map pin, Facebook and Instagram
                at the wrong resort. The labels name the property too: a screen
                reader hearing "Facebook" three pages deep into Ubud has no
                other way to know which account it is about to open. */}
            <div className="mt-5 flex gap-2.5">
              <a
                href={site.social.maps}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Find Nyuh Bali ${site.label} on Google Maps`}
                className={socialLinkClassName}
              >
                <MapPinIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Nyuh Bali ${site.label} on Facebook`}
                className={socialLinkClassName}
              >
                <FacebookIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Nyuh Bali ${site.label} on Instagram`}
                className={socialLinkClassName}
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          {/* Menu — every heading here is a string already on the site; no copy
              was written to manufacture a hierarchy. */}
          <div>
            <span className={columnHeadingClassName}>Nyuh Bali Villas</span>
            <nav className="mt-3.5">
              <ul className="flex flex-col gap-0.5">
                {footerLinks.map((link) => (
                  <li key={link.label}>
                    {link.inScope ? (
                      <Link
                        href={link.href}
                        className="inline-block py-1 text-[15px] text-white/70 uppercase transition-colors duration-300 hover:text-primary"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      // Out-of-scope labels stay plain text — not real links here.
                      <span className="inline-block py-1 text-[15px] text-white/45 uppercase">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <span className={columnHeadingClassName}>{site.label}</span>
            <ul className="mt-3.5 flex flex-col gap-2.5">
              <li className="flex items-start gap-3">
                <MapPinIcon className="mt-1 h-[15px] w-[15px] shrink-0 text-primary" />
                <p className="text-[15px] leading-[1.7] text-white/70">
                  {site.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon className="mt-1 h-[15px] w-[15px] shrink-0 text-primary" />
                <p className="text-[15px] leading-[1.7] text-white/70">
                  {site.contact.phones.map((phone) => (
                    <span key={phone} className="block">
                      {phone}
                    </span>
                  ))}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <EnvelopeIcon className="mt-1 h-[15px] w-[15px] shrink-0 text-primary" />
                <a
                  href={mailHref}
                  className="text-[15px] leading-[1.7] text-white/70 transition-colors duration-300 hover:text-primary"
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Our Blog — real links now that the posts are built. */}
          <div>
            <Link href={`/${site.slug}/discover`} className={columnHeadingClassName}>
              Our Blog
            </Link>
            <ul className="mt-3.5 flex flex-col divide-y divide-white/10 border-t border-white/10">
              {site.blogPosts.map((post) => (
                <li key={post.href}>
                  <Link
                    href={post.href}
                    className="block py-2 text-[15px] leading-[1.5] text-white/70 transition-colors duration-300 hover:text-primary"
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal bar — copyright at the bottom of the footer, where it belongs.
            On a phone the columns stack, so this rule lands directly under the
            last blog title and reads as one more row of that list. `mt-0 pt-2`
            makes it exactly that: 8px of the list item's own padding above the
            rule and 8px below it, the same 8/8 the `divide-y` gives every other
            blog row, so the legal line continues the rhythm instead of sitting
            across a gap from it. From `sm` — where the columns stop being one
            stacked list and the rule starts spanning a grid with ragged column
            bottoms — it goes back to the 16px either side that a real section
            divider needs. */}
        <div className="mt-0 flex flex-col gap-3 border-t border-white/10 pt-2 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          {/* The year is read on the client — see CurrentYear. A static build
              would otherwise bake in whichever year it was compiled, which is
              the same maintenance problem as writing the number by hand. */}
          <p className="text-[13px] text-white/40">
            © Copyright <CurrentYear /> - All Rights Reserved
          </p>
          <nav>
            <ul className="flex flex-wrap gap-x-7">
              <li>
                <Link
                  href="/terms-conditions"
                  className="inline-block py-1 text-[13px] text-white/40 transition-colors duration-300 hover:text-primary"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-block py-1 text-[13px] text-white/40 transition-colors duration-300 hover:text-primary"
                >
                  Privacy &amp; Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
