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

type PropertyFooterProps = {
  site: PropertySite;
};

// The primary footer nav. Terms & Conditions and Privacy Policy used to sit
// in this same flat row; they've moved down to the legal bar, which is where
// visitors look for them and which stops two boilerplate links from carrying
// the same weight as "villas" and "contact".
function buildFooterLinks(site: PropertySite) {
  return [
    { label: "about", href: `/${site.slug}`, inScope: true },
    { label: "villas", href: "#", inScope: false },
    { label: "offers", href: "#", inScope: false },
    { label: "Blog", href: "#", inScope: false },
    { label: "contact", href: `/${site.slug}/contact`, inScope: true },
  ];
}

const columnHeadingClassName =
  "text-eyebrow font-body block text-primary uppercase";

/**
 * The footer shared by every Seminyak/Ubud page.
 *
 * **Redesigned completely.** The old one put the copyright line *above* the
 * navigation, spread five different kinds of information across one flat row
 * of equal-weight text, gave the address, phone and email columns no headings
 * at all, listed blog posts as plain text prefixed with `"- "` like a
 * plain-text file, and offered no way to book from the bottom of a page the
 * visitor has just finished reading.
 *
 * The replacement is three tiers: a brand line with the booking CTA, a labelled
 * three-column body, and a legal bar. Same content, same links, same contact
 * details — the difference is entirely that a visitor can now tell at a glance
 * which part of it they need.
 */
export function PropertyFooter({ site }: PropertyFooterProps) {
  const footerLinks = buildFooterLinks(site);
  const mailHref = `mailto:${site.contact.email}`;

  const socialLinkClassName =
    "flex h-10 w-10 items-center justify-center border border-white/15 text-primary transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-ink";

  return (
    // The 2px gold rule across the top is kept from the original footer — it's
    // one of the few pieces of pure brand decoration on the site and it does
    // real work here, separating the dark awards row above from the dark
    // footer below.
    //
    // The deep mobile bottom padding clears DirectBookingDeals, which docks as
    // a full-width bar along the bottom edge on phones — without it the
    // copyright and legal links sit permanently underneath it.
    <footer className="border-t-2 border-primary bg-ink px-5 pt-11 pb-28 sm:px-8 md:pt-14 md:pb-7">
      <Container>
        {/* Tier 1 — brand and the booking CTA. */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-9 md:flex-row md:items-center md:justify-between">
          <Link href={`/${site.slug}`} className="relative h-[46px] w-[126px] shrink-0">
            <Image
              src={site.logoSrc}
              alt={`Nyuh Bali Villas - ${site.label}`}
              fill
              sizes="126px"
              className="object-contain object-left"
            />
          </Link>

          <Button href={site.bookingHref} external>
            Book Now
          </Button>
        </div>

        {/* Tier 2 — the labelled body. Every column heading here is a string
            that already exists on the site (the brand name, the property name,
            the site's own "Our Blog" label); no new copy was written to
            create a hierarchy. */}
        <div className="grid gap-9 pt-9 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div>
            <span className={columnHeadingClassName}>Nyuh Bali Villas</span>
            {/* `py-1` on the links with a tighter `gap` between them: as bare
                text these rows were 20px tall, below the 24px minimum tap
                target. The padding buys the height back without changing how
                far apart the labels look. */}
            <nav className="mt-4">
              <ul className="flex flex-col gap-1.5">
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
                      // Out-of-scope labels stay plain text with no hover
                      // state — they aren't real links, so they shouldn't
                      // look clickable either.
                      <span className="inline-block py-1 text-[15px] text-white/45 uppercase">
                        {link.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-7 flex gap-3">
              <a
                href="https://goo.gl/maps/C6g15D7NfNvwVxjq9"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Google Maps"
                className={socialLinkClassName}
              >
                <MapPinIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://m.facebook.com/nyuhbalivillas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialLinkClassName}
              >
                <FacebookIcon className="h-[18px] w-[18px]" />
              </a>
              <a
                href="https://www.instagram.com/nyuhbalivillas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialLinkClassName}
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
            </div>
          </div>

          <div>
            {/* The property's own name labels its contact details — the old
                footer left three unlabelled columns and relied on the icons
                alone to explain what they were. */}
            <span className={columnHeadingClassName}>{site.label}</span>
            <ul className="mt-5 flex flex-col gap-4">
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

          {/* "Our Blog" and its posts are out of this project's 7-page scope,
              so — like the nav items above — they render as plain text rather
              than linking to pages that don't exist here. The `"- "` prefixes
              the old footer printed in front of each title are gone; the
              column heading and the spacing already say it's a list. */}
          <div>
            <span className={columnHeadingClassName}>Our Blog</span>
            <ul className="mt-5 flex flex-col divide-y divide-white/10 border-t border-white/10">
              {site.blogPostTitles.map((title) => (
                <li key={title} className="py-3 text-[15px] leading-[1.6] text-white/70">
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tier 3 — the legal bar. Copyright belongs at the bottom of a
            footer, not at the top of one. */}
        <div className="mt-11 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-white/40">
            © Copyright 2025 - All Rights Reserved
          </p>

          <nav>
            <ul className="flex flex-wrap gap-x-7">
              <li>
                <Link
                  href="/terms-conditions"
                  className="inline-block py-1.5 text-[13px] text-white/40 transition-colors duration-300 hover:text-primary"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-block py-1.5 text-[13px] text-white/40 transition-colors duration-300 hover:text-primary"
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
