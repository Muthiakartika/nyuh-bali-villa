// Nyuh Bali Villas operates two physical properties, and several UI pieces
// (the homepage picker, both property headers/footers, the mobile nav
// overlay) all need this same data — which links exist, which ones fall
// inside this project's 7-page scope, and each property's contact details.
// Centralizing it here means a page component just looks up `PROPERTY_SITES.seminyak`
// instead of every component re-typing addresses and phone numbers.

export type Property = {
  slug: "seminyak" | "ubud";
  label: string;
  href: string;
};

// Used by the homepage picker (PropertyPanel) and its header/footer/mobile
// overlay — those only ever need the simple "name + link" pair.
export const PROPERTIES: Property[] = [
  { slug: "seminyak", label: "Seminyak", href: "/seminyak" },
  { slug: "ubud", label: "Ubud", href: "/ubud" },
];

export type PropertyNavItem = {
  label: string;
  href: string;
  /**
   * Whether this nav destination is one of the 7 pages this project
   * actually builds. The live site's nav has several items (Villas,
   * Offers, Dining, SPA, …) that lead to pages outside this project's
   * scope; per the brief, those render as plain non-clickable text instead
   * of dead links into pages that don't exist here.
   */
  inScope: boolean;
};

export type PropertySite = {
  slug: "seminyak" | "ubud";
  label: string;
  logoSrc: string;
  navItems: PropertyNavItem[];
  contact: {
    addressLines: string[];
    phones: string[];
    email: string;
  };
  /** Property-specific booking-engine URL (each property has its own
   * `propertyId` query param), used by the "Book Your Stay" CTA and the
   * dismissible "Direct Booking Deals" corner widget. */
  bookingHref: string;
  /** Real titles from each property's own "Our Blog" footer teaser — the
   * two properties' blogs are entirely different, not the same posts with
   * the property name swapped in, so this can't be derived from `label`. */
  blogPostTitles: string[];
};

export const PROPERTY_SITES: Record<"seminyak" | "ubud", PropertySite> = {
  seminyak: {
    slug: "seminyak",
    label: "Seminyak",
    logoSrc:
      "https://nyuhbalivillas.com/wp-content/uploads/2023/04/logonyuhbaliseminyak.webp",
    navItems: [
      { label: "About Us", href: "/seminyak", inScope: true },
      {
        label: "Villas",
        href: "https://nyuhbalivillas.com/seminyak/villa/",
        inScope: false,
      },
      {
        label: "Offers",
        href: "https://nyuhbalivillas.com/seminyak/villa/honeymoon/packages/",
        inScope: false,
      },
      {
        label: "Dining",
        href: "https://nyuhbalivillas.com/seminyak/dining/",
        inScope: false,
      },
      {
        label: "SPA",
        href: "https://nyuhbalivillas.com/seminyak/spa/",
        inScope: false,
      },
      {
        label: "Explore Bali",
        href: "https://nyuhbalivillas.com/seminyak/tour/",
        inScope: false,
      },
      { label: "Contact Us", href: "/seminyak/contact", inScope: true },
    ],
    contact: {
      addressLines: ["Bali Deli st 99,", "Seminyak, Bali"],
      phones: ["+62 361 738920", "+62 361 739196"],
      email: "reservation@nyuhbalivillas.com",
    },
    bookingHref:
      "https://booking.nyuhbalivillas.com/inst/#home?propertyId=581MZlmJ8YVJgcICxbs034K4e3E7IANq0jI5ODU=&JDRN=Y",
    blogPostTitles: [
      "Sunset Seminyak",
      "10 Romantic Honeymoon Activities in Seminyak",
    ],
  },
  ubud: {
    slug: "ubud",
    label: "Ubud",
    logoSrc:
      "https://nyuhbalivillas.com/wp-content/uploads/2023/04/logonyuhbaliubud.webp",
    // Note: unlike Seminyak, the live Ubud nav has no "Contact" item at
    // all — Contact – Ubud is only reachable from the footer. That
    // asymmetry is intentional and preserved here, not a mistake.
    navItems: [
      { label: "About Us", href: "/ubud", inScope: true },
      {
        label: "Stay",
        href: "https://nyuhbalivillas.com/ubud-backup/villa/",
        inScope: false,
      },
      {
        label: "Offers",
        href: "https://nyuhbalivillas.com/ubud-backup/packages/",
        inScope: false,
      },
      {
        label: "Services",
        href: "https://nyuhbalivillas.com/complimentary-services/",
        inScope: false,
      },
      {
        label: "SPA",
        href: "https://nyuhbalivillas.com/ubud-backup/spa/",
        inScope: false,
      },
      {
        label: "Retreat",
        href: "https://nyuhbalivillas.com/ubud-backup/retreat/",
        inScope: false,
      },
      {
        label: "Dining",
        href: "https://nyuhbalivillas.com/ubud-backup/dining/",
        inScope: false,
      },
      {
        label: "Culture",
        href: "https://nyuhbalivillas.com/ubud/balinese-culture/",
        inScope: false,
      },
    ],
    contact: {
      addressLines: ["Raya Silungan street", "Lodtunduh Ubud Bali (80571)"],
      phones: ["+62 85 333 779 779"],
      email: "info@ubudnyuhbali.com",
    },
    bookingHref:
      "https://booking.nyuhbalivillas.com/inst/#home?propertyId=222Mjs8xZLdlXkm6I5ODQ=&JDRN=Y",
    blogPostTitles: [
      "Enter Ubud's Luxury Yoga Retreat",
      "Five Relaxing Activities to Do in Ubud",
      "Most Instagrammable Places in Ubud",
    ],
  },
};
