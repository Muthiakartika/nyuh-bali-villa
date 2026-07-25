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
   * Whether this nav destination is a page this project actually builds.
   * The live site's nav still has items leading outside this project's scope
   * (Blog, per-room detail pages); per the brief, those render as plain
   * non-clickable text instead of dead links into pages that don't exist here.
   */
  inScope: boolean;
  /**
   * Dropdown entries. The live Ubud menu has exactly three: Offers, SPA and
   * Retreat. Seminyak's menu is flat and leaves this undefined.
   *
   * A child may point off-site (Medical Aesthetic is a separate business at
   * healthylook-aesthetic.com), which is what `external` marks — `inScope`
   * alone can't express "real link, but not one of ours".
   */
  children?: PropertyNavChild[];
};

export type PropertyNavChild = {
  label: string;
  href: string;
  inScope: boolean;
  external?: boolean;
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
  /** Where this property's "Offers" lives. The two differ — Seminyak's is
   * nested under the honeymoon villa (/seminyak/villa/honeymoon/packages),
   * Ubud's is top-level (/ubud/packages) — so the footer can't derive it from
   * the slug the way it derives "villas" (/<slug>/villa). Update this if
   * either Offers slug is renamed. */
  offersHref: string;
  /** The "Our Blog" footer teaser — the exact posts each property links to,
   * which differ per property (the two blogs are entirely separate, not the
   * same posts with the name swapped in). Now that the posts themselves are
   * built these carry real hrefs; the live URLs are preserved, including the
   * ones that don't sit under /<property>/discover/. */
  blogPosts: { title: string; href: string }[];
  /** Award badges for the `AwardsRow` that closes every page, and which of
   * the two treatments that row uses (Seminyak is a static grid, Ubud a
   * marquee — see AwardsRow). Centralized here because the badge set is
   * identical on all of a property's pages; the two About pages predate this
   * field and still list theirs inline, which is the one place to reconcile
   * if the badges ever change. */
  awards: {
    variant: "grid" | "marquee";
    badges: string[];
  };
};

const UPLOADS = "https://nyuhbalivillas.com/wp-content/uploads";

export const PROPERTY_SITES: Record<"seminyak" | "ubud", PropertySite> = {
  seminyak: {
    slug: "seminyak",
    label: "Seminyak",
    logoSrc:
      "https://nyuhbalivillas.com/wp-content/uploads/2023/04/logonyuhbaliseminyak.webp",
    navItems: [
      // Every Seminyak nav destination is now built in this project, so the
      // whole menu is in scope. The hrefs mirror the WordPress paths exactly
      // (see the Route Information comment at the top of each page file) —
      // if a slug is ever renamed, this list is one of the places to update.
      { label: "About Us", href: "/seminyak", inScope: true },
      { label: "Villas", href: "/seminyak/villa", inScope: true },
      {
        label: "Offers",
        href: "/seminyak/villa/honeymoon/packages",
        inScope: true,
      },
      { label: "Dining", href: "/seminyak/dining", inScope: true },
      { label: "SPA", href: "/seminyak/spa", inScope: true },
      { label: "Explore Bali", href: "/seminyak/tour", inScope: true },
      { label: "Contact Us", href: "/seminyak/contact", inScope: true },
    ],
    contact: {
      addressLines: ["Bali Deli st 99,", "Seminyak, Bali"],
      phones: ["+62 361 738920", "+62 361 739196"],
      email: "reservation@nyuhbalivillas.com",
    },
    bookingHref:
      "https://booking.nyuhbalivillas.com/inst/#home?propertyId=581MZlmJ8YVJgcICxbs034K4e3E7IANq0jI5ODU=&JDRN=Y",
    offersHref: "/seminyak/villa/honeymoon/packages",
    blogPosts: [
      { title: "Sunset Seminyak", href: "/seminyak/discover/sunset" },
      {
        title: "10 Romantic Honeymoon Activities in Seminyak",
        href: "/seminyak/discover/10-romantic-honeymoon-activities",
      },
    ],
    awards: {
      variant: "grid",
      badges: [
        `${UPLOADS}/2023/01/awards-hotelcom-2020.png`,
        `${UPLOADS}/2023/01/awards-hotelcom.png`,
        `${UPLOADS}/2023/01/awards-tripadvisor.png`,
        `${UPLOADS}/2023/01/awards-hotelscombined.png`,
        `${UPLOADS}/2023/02/ubud-awards-chse.png`,
      ],
    },
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
      // Mirrors the live Ubud menu exactly: 8 top-level items, three of which
      // (Offers, SPA, Retreat) carry a dropdown. Every destination is now
      // built in this project except Medical Aesthetic, which is a separate
      // business on its own domain and so is an external link, not an inert
      // label. Romance and Wedding live inside the Offers dropdown — that is
      // where the live site puts them too, which is what keeps the top row at
      // 8 items rather than the 10 that wouldn't fit at `lg`.
      { label: "About Us", href: "/ubud", inScope: true },
      { label: "Stay", href: "/ubud/villa", inScope: true },
      {
        label: "Offers",
        href: "/ubud/packages",
        inScope: true,
        children: [
          {
            label: "Romance",
            href: "/ubud/villa/honeymoon/packages",
            inScope: true,
          },
          { label: "Retreat", href: "/ubud/retreat", inScope: true },
          { label: "Wedding", href: "/ubud/wedding", inScope: true },
        ],
      },
      {
        label: "Services",
        href: "/complimentary-services",
        inScope: true,
      },
      {
        label: "SPA",
        href: "/ubud/spa",
        inScope: true,
        children: [
          { label: "Balinese Spa", href: "/ubud/spa", inScope: true },
          {
            label: "Medical Aesthetic",
            href: "https://healthylook-aesthetic.com/",
            inScope: true,
            external: true,
          },
        ],
      },
      {
        label: "Retreat",
        href: "/ubud/retreat",
        inScope: true,
        children: [
          { label: "Luxury Retreat", href: "/ubud/retreat/luxury", inScope: true },
          {
            label: "Host Your Retreat",
            href: "/ubud/retreat/host-your-own",
            inScope: true,
          },
          {
            label: "Wellness Facilities",
            href: "/ubud/wellness",
            inScope: true,
          },
        ],
      },
      { label: "Dining", href: "/ubud/dining", inScope: true },
      { label: "Culture", href: "/ubud/balinese-culture", inScope: true },
    ],
    contact: {
      addressLines: ["Raya Silungan street", "Lodtunduh Ubud Bali (80571)"],
      phones: ["+62 85 333 779 779"],
      email: "info@ubudnyuhbali.com",
    },
    bookingHref:
      "https://booking.nyuhbalivillas.com/inst/#home?propertyId=222Mjs8xZLdlXkm6I5ODQ=&JDRN=Y",
    offersHref: "/ubud/packages",
    blogPosts: [
      {
        title: "Enter Ubud's Luxury Yoga Retreat",
        href: "/ubud/wellness/yoga/retreat",
      },
      {
        title: "Five Relaxing Activities to Do in Ubud",
        href: "/ubud/discover/five-relaxing-activities-to-do",
      },
      {
        title: "Most Instagrammable Places in Ubud",
        href: "/ubud/discover/most-instagrammable-places",
      },
    ],
    awards: {
      variant: "marquee",
      badges: [
        `${UPLOADS}/2023/02/ubud-award-3.jpg.webp`,
        `${UPLOADS}/2023/02/ubud-award-1.jpg.webp`,
        `${UPLOADS}/2023/12/tripadvisor2020.png.webp`,
        `${UPLOADS}/2023/12/tripadvisor-2021.png.webp`,
        `${UPLOADS}/2023/02/ubud-awards-chse.png`,
        `${UPLOADS}/2023/12/Best-Luxury-Boutique-Retreat-2023.png.webp`,
        `${UPLOADS}/2023/12/Best-Luxury-Wellness-Resort.png.webp`,
        `${UPLOADS}/2023/12/Best-Luxury-Yoga-Wellness-Retreat.png.webp`,
      ],
    },
  },
};
