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

// Terms & Privacy live in the legal bar rather than this list, so two pieces of
// boilerplate don't carry the same weight as "villas" and "contact".
function buildFooterLinks(site: PropertySite) {
  return [
    { label: "About Us", href: `/${site.slug}`, inScope: true },
    { label: "Villas", href: "#", inScope: false },
    { label: "Offers", href: "#", inScope: false },
    { label: "Blog", href: "#", inScope: false },
    { label: "Contact Us", href: `/${site.slug}/contact`, inScope: true },
  ];
}

const columnHeadingClassName = "text-caption font-medium text-on-dark";

/**
 * The footer shared by every Seminyak/Ubud page.
 *
 * Structure follows the reference composition — labelled link columns, contact
 * details, a photo card, and an oversized wordmark closing the page — while the
 * colour comes from DESIGN.md, which specifies `footer-bg: #1c1c1e`. The
 * reference runs its footer light; the brand spec wins on colour, the reference
 * wins on layout, which is exactly the split this redesign was briefed on.
 *
 * The wordmark is SVG rather than styled text on purpose. It has to scale to
 * the full container width, which no step on the type ramp covers — and a
 * literal `text-[220px]` would be both off-ramp and unable to adapt.
 */
export function PropertyFooter({ site }: PropertyFooterProps) {
  const footerLinks = buildFooterLinks(site);
  const mailHref = `mailto:${site.contact.email}`;

  const socialClassName =
    "flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-on-dark transition-colors duration-200 active:bg-white/10";

  return (
    <footer className="overflow-hidden bg-footer px-5 pt-14 pb-24 sm:px-8 md:pt-20 md:pb-8">
      <Container>
        {/* Brand line and the booking action. */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-10 md:flex-row md:items-center md:justify-between">
          <Link href={`/${site.slug}`} className="relative h-11 w-32 shrink-0">
            <Image
              src={site.logoSrc}
              alt={`Nyuh Bali Villas - ${site.label}`}
              fill
              sizes="128px"
              className="object-contain object-left"
            />
          </Link>

          <Button href={site.bookingHref} external variant="accent">
            Book Now
          </Button>
        </div>

        {/* Every column heading here is a string that already exists on the
            site — the brand name, the property name, the site's own "Our Blog"
            label. No copy was written to manufacture a hierarchy. */}
        <div className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <span className={columnHeadingClassName}>Menu</span>
            <ul className="mt-5 flex flex-col gap-1.5">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  {link.inScope ? (
                    <Link
                      href={link.href}
                      className="inline-block py-1 text-body-sm text-on-dark-muted transition-colors duration-200 active:text-on-dark"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    // Out-of-scope labels stay plain text with no interactive
                    // styling — they aren't real links here.
                    <span className="inline-block py-1 text-body-sm text-muted">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className={columnHeadingClassName}>{site.label}</span>
            <ul className="mt-5 flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-body-sm text-on-dark-muted">
                  {site.contact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-body-sm text-on-dark-muted">
                  {site.contact.phones.map((phone) => (
                    <span key={phone} className="block">
                      {phone}
                    </span>
                  ))}
                </p>
              </li>
              <li className="flex items-start gap-3">
                <EnvelopeIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {/* `-my-1 py-1` keeps the visible line where it is while taking
                    the tap target from 21px to 29px — as bare text this was the
                    only control on the page under the 24px minimum. */}
                <a
                  href={mailHref}
                  className="-my-1 inline-block py-1 text-body-sm text-on-dark-muted transition-colors duration-200 active:text-on-dark"
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className={columnHeadingClassName}>Our Blog</span>
            <ul className="mt-5 flex flex-col gap-3">
              {site.blogPostTitles.map((title) => (
                <li key={title} className="text-body-sm text-on-dark-muted">
                  {title}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className={columnHeadingClassName}>Follow Us</span>
            <div className="mt-5 flex gap-3">
              <a
                href="https://goo.gl/maps/C6g15D7NfNvwVxjq9"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Find us on Google Maps"
                className={socialClassName}
              >
                <MapPinIcon className="h-4 w-4" />
              </a>
              <a
                href="https://m.facebook.com/nyuhbalivillas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className={socialClassName}
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/nyuhbalivillas/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={socialClassName}
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal bar — copyright belongs at the bottom of a footer, not the top. */}
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-caption text-muted">© Copyright 2025 - All Rights Reserved</p>
          <nav>
            <ul className="flex flex-wrap gap-x-7">
              <li>
                <Link
                  href="/terms-conditions"
                  className="inline-block py-1.5 text-caption text-muted transition-colors duration-200 active:text-on-dark"
                >
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="inline-block py-1.5 text-caption text-muted transition-colors duration-200 active:text-on-dark"
                >
                  Privacy &amp; Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* The oversized closing wordmark. `preserveAspectRatio="none"` lets it
            stretch to the container edge at any width, and it is decorative, so
            it is hidden from assistive tech — the brand name is already in the
            logo above. */}
        <svg
          aria-hidden
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          className="mt-14 h-16 w-full md:h-28"
        >
          <text
            x="0"
            y="82"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            className="fill-none text-white/15"
            fontSize="96"
            fontWeight="600"
            letterSpacing="-2"
          >
            NYUH BALI VILLAS
          </text>
        </svg>
      </Container>
    </footer>
  );
}
