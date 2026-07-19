import Image from "next/image";
import Link from "next/link";
import type { PropertySite } from "@/data/properties";
import { EnvelopeIcon, FacebookIcon, InstagramIcon, MapPinIcon, PhoneIcon } from "@/components/ui/icons";

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
    <footer className="bg-ink px-5 py-10 md:px-[92px]">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <Link href={`/${site.slug}`} className="relative h-10 w-10 shrink-0">
            <Image
              src="https://nyuhbalivillas.com/wp-content/uploads/2022/12/Logo-Nyuh-Bali.png"
              alt="Nyuh Bali Villas"
              fill
              sizes="40px"
              className="object-contain"
            />
          </Link>

          <p className="text-sm text-white/50">© Copyright 2025 - All Rights Reserved</p>

          <nav>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  {link.inScope ? (
                    <Link href={link.href} className="text-[15px] text-white/50 uppercase">
                      {link.label}
                    </Link>
                  ) : (
                    <span className="text-[15px] text-white/50 uppercase">{link.label}</span>
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
            <a href={mailHref} className="text-base leading-[1.6] text-white/50">
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

        <div className="flex gap-4">
          <a
            href="https://goo.gl/maps/C6g15D7NfNvwVxjq9"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Find us on Google Maps"
          >
            <MapPinIcon className="h-8 w-8 text-primary" />
          </a>
          <a
            href="https://m.facebook.com/nyuhbalivillas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FacebookIcon className="h-8 w-8 text-primary" />
          </a>
          <a
            href="https://www.instagram.com/nyuhbalivillas/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-8 w-8 text-primary" />
          </a>
          <a href={mailHref} aria-label="Email">
            <EnvelopeIcon className="h-8 w-8 text-primary" />
          </a>
        </div>
      </div>
    </footer>
  );
}
