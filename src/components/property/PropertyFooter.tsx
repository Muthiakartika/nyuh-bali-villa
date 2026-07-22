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

// The primary footer nav. Terms & Conditions and Privacy Policy live in the
// legal bar, not here, so two pieces of boilerplate don't carry the same weight
// as "villas" and "contact".
function buildFooterLinks(site: PropertySite) {
  return [
    { label: "about", href: `/${site.slug}`, inScope: true },
    { label: "villas", href: "#", inScope: false },
    { label: "offers", href: "#", inScope: false },
    { label: "Blog", href: "#", inScope: false },
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
            <Link href={`/${site.slug}`} className="relative h-[46px] w-[128px] shrink-0">
              <Image
                src={site.logoSrc}
                alt={`Nyuh Bali Villas - ${site.label}`}
                fill
                sizes="128px"
                className="object-contain object-left"
              />
            </Link>

            <Button href={site.bookingHref} external className="mt-5">
              Book Now
            </Button>

            <div className="mt-5 flex gap-2.5">
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

          {/* Our Blog — out of the project's 7-page scope, so plain text. */}
          <div>
            <span className={columnHeadingClassName}>Our Blog</span>
            <ul className="mt-3.5 flex flex-col divide-y divide-white/10 border-t border-white/10">
              {site.blogPostTitles.map((title) => (
                <li key={title} className="py-2 text-[15px] leading-[1.5] text-white/70">
                  {title}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal bar — copyright at the bottom of the footer, where it belongs. */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-white/40">© Copyright 2025 - All Rights Reserved</p>
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
