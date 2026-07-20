import Image from "next/image";
import Link from "next/link";
import type { PropertySite } from "@/data/properties";
import { EnvelopeIcon, FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";
import { Container } from "@/components/ui/Container";

type PropertyFooterProps = {
  site: PropertySite;
};

// Secondary footer nav: a mix of in-scope pages (this project builds them)
// and out-of-scope ones (the live site links to pages this project doesn't
// implement). Terms & Conditions and Privacy Policy are shared, top-level
// routes — not nested under /seminyak or /ubud — because the live site
// links to the same two pages from both properties' footers.
function buildFooterLinks(site: PropertySite) {
  return [
    { label: "about", href: `/${site.slug}`, inScope: true },
    { label: "villas", href: "#", inScope: false },
    { label: "offers", href: "#", inScope: false },
    { label: "Blog", href: "#", inScope: false },
    { label: "contact", href: `/${site.slug}/contact`, inScope: true },
    { label: "Terms & Conditions", href: "/terms-conditions", inScope: true },
    { label: "Privacy & Policy", href: "/privacy-policy", inScope: true },
  ];
}

/**
 * The footer shared by every Seminyak/Ubud page: small logo + copyright,
 * a row of secondary nav links, an address/phone/email block, and social
 * links. Reused across About and Contact for both properties by passing in
 * a different `site` from `PROPERTY_SITES`.
 */
export function PropertyFooter({ site }: PropertyFooterProps) {
  const footerLinks = buildFooterLinks(site);
  const mailHref = `mailto:${site.contact.email}`;

  return (
    // Background stays full-bleed on <footer>; content is capped at 1120px
    // and centered via Container — same split as PropertyHeader, matching
    // the live site's measured layout instead of stretching edge-to-edge.
    <footer className="bg-ink px-5 py-10">
      <Container className="flex flex-col gap-8">
        {/* Gold 2px divider at the very top of the footer content. Measured
            on the live site as a `border-bottom: 2px` in the primary gold
            (#c7a259) on a full content-width block. It shows on EVERY page
            that uses this footer — including Contact and the legal pages,
            which have no awards row above them — so it belongs here in the
            shared footer, not on AwardsRow. */}
        <div className="w-full border-t-2 border-primary" />

        {/* Logo, copyright and nav stack vertically and left-align. The live
            footer does NOT spread these across a horizontal row — the old
            `md:flex-row md:justify-between` here was the main thing that made
            this footer look different from the original. */}
        <div className="flex flex-col items-start gap-4">
          {/* The footer reuses the same per-property wordmark logo as the
              header (site.logoSrc, shown at 136×50) — confirmed from the
              live footer's real image source — rather than the small round
              icon this previously used. */}
          <Link href={`/${site.slug}`} className="relative h-[50px] w-[136px] shrink-0">
            <Image
              src={site.logoSrc}
              alt={`Nyuh Bali Villas - ${site.label}`}
              fill
              sizes="136px"
              className="object-contain"
            />
          </Link>

          <p className="text-sm text-white/50">© Copyright 2025 - All Rights Reserved</p>

          <nav>
            {/* tracking-[1px] matches the live footer nav's letter-spacing. */}
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  {link.inScope ? (
                    <Link
                      href={link.href}
                      className="text-[15px] tracking-[1px] text-white/50 uppercase transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    // Out-of-scope labels (villas, offers, Blog) stay plain
                    // text with no hover state — they aren't real links, so
                    // they shouldn't look clickable either.
                    <span className="text-[15px] tracking-[1px] text-white/50 uppercase">
                      {link.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-8 border-t border-white/10 pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-8 w-8 shrink-0 text-primary" />
            <p className="text-base leading-[1.6] text-white/50">
              {site.contact.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <PhoneIcon className="h-8 w-8 shrink-0 text-primary" />
            <p className="text-base leading-[1.6] text-white/50">
              {site.contact.phones.map((phone) => (
                <span key={phone} className="block">
                  {phone}
                </span>
              ))}
            </p>
          </div>

          <div className="flex items-start gap-3">
            <a href={mailHref} aria-label="Email">
              <EnvelopeIcon className="h-8 w-8 shrink-0 text-primary" />
            </a>
            <a
              href={mailHref}
              className="text-base leading-[1.6] text-white/50 transition-colors duration-200 hover:text-white"
            >
              {site.contact.email}
            </a>
          </div>

          {/* "Our Blog" and its posts are out of this project's 7-page
              scope, so — like the nav items above — they render as plain
              text rather than linking to pages that don't exist here. */}
          <div className="flex flex-col gap-1">
            <span className="text-base text-white/50">Our Blog</span>
            {site.blogPostTitles.map((title) => (
              <span key={title} className="text-sm text-white/50">
                - {title}
              </span>
            ))}
          </div>
        </div>

        {/* transition-opacity + hover:opacity-70 on each icon link is the
            only hover feedback these need — the icons already carry the
            brand's gold accent color, so dimming on hover reads as "pressed"
            without introducing a new color or a shadow/scale effect. */}
        <div className="flex gap-4">
          <a
            href="https://goo.gl/maps/C6g15D7NfNvwVxjq9"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Find us on Google Maps"
            className="transition-opacity duration-200 hover:opacity-70"
          >
            <MapPinIcon className="h-8 w-8 text-primary" />
          </a>
          <a
            href="https://m.facebook.com/nyuhbalivillas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="transition-opacity duration-200 hover:opacity-70"
          >
            <FacebookIcon className="h-8 w-8 text-primary" />
          </a>
          <a
            href="https://www.instagram.com/nyuhbalivillas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-opacity duration-200 hover:opacity-70"
          >
            <InstagramIcon className="h-8 w-8 text-primary" />
          </a>
          <a
            href={mailHref}
            aria-label="Email"
            className="transition-opacity duration-200 hover:opacity-70"
          >
            <EnvelopeIcon className="h-8 w-8 text-primary" />
          </a>
        </div>
      </Container>
    </footer>
  );
}
