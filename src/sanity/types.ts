/**
 * Handwritten runtime contracts for what the GROQ projections in
 * lib/queries.ts actually return.
 *
 * These are deliberately separate from `types.generated.ts` (which
 * `npm run sanity:typegen` writes from the schema): the generated file
 * describes the schema, this one describes the shape a renderer receives
 * after projection and dereferencing. Keep the two in step by regenerating
 * after any schema or projection change.
 */
import type { PortableTextBlock } from "@portabletext/types";
import type { AmenityIconName } from "@/components/property/AmenityGrid";
import type { HeadingLevel } from "@/components/ui/SectionHeading";
import type { PropertySlug } from "@/data/properties";

export type SanityImage = {
  _type?: string;
  asset?: { _ref?: string; _type?: string };
  alt?: string;
  caption?: string;
  /** The live site's own CDN link, used when nothing has been uploaded. */
  externalUrl?: string;
  crop?: unknown;
  hotspot?: unknown;
};

export type SanitySeo = {
  title?: string;
  description?: string;
  /** Falls back to `title`; the live site sends the same string for both. */
  ogTitle?: string;
  /** Falls back to `description`. */
  ogDescription?: string;
  image?: SanityImage;
  /** Only set when this page deliberately points its ranking at another URL. */
  canonicalUrl?: string;
  noIndex?: boolean;
};

/**
 * `href` is always a string by the time a renderer sees one: an internal
 * reference is resolved to its path by `linkProjection` in lib/queries.ts,
 * and a typed path passes through. `linkType` and `reference` survive the
 * projection but nothing reads them downstream.
 */
export type SanityLink = {
  label: string;
  href: string;
  linkType?: "internal" | "file" | "custom";
  external?: boolean;
  inScope?: boolean;
  variant?: "solid" | "outline";
};

/**
 * A value that became rich text in the CMS audit pass but whose published
 * data may still be the string it was seeded as. Every reader goes through
 * `toRuns` / `richTextToPlainText` in lib/richText.ts, so both shapes render.
 */
export type SanityRichTextValue = string | PortableTextBlock[];

/**
 * Body copy that became `proseRichText`. Three shapes rather than two: these
 * fields were `string[]` before, and a document published before the
 * migration still holds one. `RichProse` renders all three identically.
 */
export type SanityProseValue = string | string[] | PortableTextBlock[];

export type SanityBulletGroup = { heading?: string; items: string[] };

export type SanityFaqItem = { question: string; answer: string };

export type SanityDetailRow = { label: string; value: string };

export type SanityAmenity = {
  icon: AmenityIconName;
  title: string;
  subtitle?: string;
};

export type SanityPriceTable = {
  columns: string[];
  rows: { cells: string[] }[];
};

export type SanityPackageItem = {
  name: string;
  images?: SanityImage[];
  description?: SanityRichTextValue;
  meta?: { label: string; value: string }[];
  benefitsHeading?: string;
  benefits?: string[];
  notes?: string[];
  ctas?: SanityLink[];
};

export type SanityTreatmentItem = {
  name: string;
  description: string;
  options: { label: string; href: string }[];
  includes?: string[];
};

export type SanityTreatmentCategory = {
  name: string;
  image?: SanityImage;
  treatments: SanityTreatmentItem[];
};

export type SanityExperienceProgram = {
  name: string;
  groups: SanityBulletGroup[];
};

// ── Page-builder sections ──────────────────────────────────────────────

type SectionBase = {
  _key: string;
  anchor?: string;
  isHidden?: boolean;
  tone?: "sand" | "sand-deep" | "white";
  /** Which tag the band's heading is written as. Absent means the renderer's
   *  own default, which is what every document seeded before this field
   *  existed relies on. */
  headingLevel?: HeadingLevel;
};

/** One half of the homepage picker. `image` is the shared upload-or-hotlink
 *  shape, so a photograph can move into Sanity without a code change. */
export type SanityPropertyPanel = {
  _key?: string;
  name?: string;
  description?: string;
  image?: SanityImage;
  href?: string;
};

export type SanitySection =
  | (SectionBase & {
      _type: "heroSection";
      images: SanityImage[];
      eyebrow?: string;
      title: string;
      alt?: string;
    })
  | (SectionBase & {
      _type: "aboutNarrativeSection";
      eyebrow?: string;
      heading: string;
      paragraphs: SanityProseValue;
      tagline?: string;
      buttonLabel: string;
      offerHeading?: string;
      offerSubtitle?: string;
      offerCodeLabel?: string;
      promoCode: string;
      perks?: string[];
      image?: SanityImage;
    })
  | (SectionBase & {
      _type: "richTextSection";
      eyebrow?: string;
      heading?: string;
      body: unknown[];
    })
  | (SectionBase & {
      _type: "proseSection";
      eyebrow?: string;
      heading: string;
      paragraphs: SanityProseValue;
    })
  | (SectionBase & {
      _type: "splitContentSection";
      eyebrow?: string;
      heading: string;
      paragraphs: SanityProseValue;
      script?: string;
      image?: SanityImage;
      imageSide?: "left" | "right";
      action?: SanityLink;
    })
  | (SectionBase & {
      _type: "gallerySection";
      eyebrow?: string;
      heading?: string;
      images: SanityImage[];
      alt?: string;
    })
  | (SectionBase & {
      _type: "amenityGridSection";
      heading?: string;
      amenities: SanityAmenity[];
    })
  | (SectionBase & {
      _type: "linkCardGridSection";
      eyebrow?: string;
      heading: string;
      items: {
        _key: string;
        label: string;
        href: string;
        image: SanityImage;
        inScope?: boolean;
      }[];
      columns: 2 | 3 | 4;
    })
  | (SectionBase & {
      _type: "collectionSection";
      eyebrow?: string;
      heading?: string;
      intro?: SanityProseValue;
      collection: "room" | "post" | "experience" | "testimonial";
      property?: string;
      group?: string;
      /** Rooms only: an explicit subset, in this order. */
      slugs?: string[];
      /** Testimonials only: quotes written on the page instead of listed. */
      quotes?: { _key: string; quote: string; author: string }[];
      limit?: number;
    })
  | (SectionBase & {
      _type: "roomListSection";
      eyebrow?: string;
      heading: string;
      intro?: SanityProseValue;
      rooms: {
        _key: string;
        name: string;
        images?: SanityImage[];
        bed?: string;
        size?: string;
        occupancy?: string;
        detailsHref?: string;
        detailsInScope?: boolean;
      }[];
    })
  | (SectionBase & {
      _type: "packageListSection";
      eyebrow?: string;
      heading?: string;
      intro?: SanityRichTextValue;
      source: "inline" | "reference";
      packages?: SanityPackageItem[];
      packageSet?: {
        _id: string;
        title: string;
        alwaysIncluded?: string[];
        packages: SanityPackageItem[];
      };
    })
  | (SectionBase & {
      _type: "programListSection";
      heading: string;
      tiers: SanityExperienceProgram[];
    })
  | (SectionBase & {
      _type: "treatmentListSection";
      eyebrow?: string;
      heading: string;
      intro?: SanityProseValue;
      notes?: string[];
      categories: SanityTreatmentCategory[];
      cta?: SanityLink;
    })
  | (SectionBase & {
      _type: "bulletListSection";
      eyebrow?: string;
      heading?: string;
      intro?: SanityProseValue;
      groups: SanityBulletGroup[];
    })
  | (SectionBase & {
      _type: "priceTableSection";
      heading?: string;
      table: SanityPriceTable;
    })
  | (SectionBase & {
      _type: "faqSection";
      heading?: string;
      faqs: SanityFaqItem[];
    })
  | (SectionBase & {
      _type: "ctaSection";
      eyebrow?: string;
      heading: string;
      body?: SanityProseValue;
      actions?: SanityLink[];
      image?: SanityImage;
    })
  | (SectionBase & {
      _type: "inquiryFormSection";
      heading: string;
      fields: {
        _key: string;
        kind: string;
        name: string;
        label: string;
        options?: string[];
        required?: boolean;
      }[];
      submitLabel?: string;
      confirmation?: string;
      pricing?: {
        enabled?: boolean;
        field?: string;
        taxPercent?: number;
        discountPercent?: number;
        note?: string;
      };
    })
  | (SectionBase & {
      _type: "contactSection";
      eyebrow?: string;
      heading: string;
      formHeading?: string;
      confirmation?: string;
      intro?: SanityProseValue;
      image: SanityImage;
    })
  | (SectionBase & {
      _type: "awardsSection";
      /** Empty means the property's own badges. */
      badges?: SanityImage[];
      /** Empty means the property's own layout. */
      variant?: "grid" | "marquee" | "";
    })
  | (SectionBase & {
      _type: "dealsSection";
      bookingHref?: string;
      headline?: string;
      code?: string;
      buttonLabel?: string;
    })
  | (SectionBase & {
      _type: "propertyPickerSection";
      panels?: SanityPropertyPanel[];
    })
  | (SectionBase & {
      _type: "instagramSection";
      heading?: string;
      /** A feed key ("seminyak" | "ubud" | "spa"), not a URL — the grid can only
       *  call this site's own proxy. Empty means the page's own property. */
      feed?: string;
      /** The "Follow on Instagram" target. Empty means the page's own property. */
      profileUrl?: string;
    })
  | (SectionBase & {
      _type: "bookingWidgetSection";
      widgetId?: string;
    });

// ── Documents ──────────────────────────────────────────────────────────

export type SanityPage = {
  _id: string;
  _type: "page";
  title: string;
  path: string;
  property?: PropertySlug;
  seo?: SanitySeo;
  sections?: SanitySection[];
};

/** Mirrors the `ArticleBlock` union in components/property/postBlocks.ts. */
export type SanityArticleBlock =
  | { _key: string; _type: "articleHeading"; text: string }
  | { _key: string; _type: "articleParagraph"; text: string }
  | { _key: string; _type: "articleList"; items: string[] }
  | { _key: string; _type: "articleImage"; image: SanityImage }
  | {
      _key: string;
      _type: "articlePoints";
      ordered?: boolean;
      items: {
        _key: string;
        label: string;
        body?: Array<
          | { _key: string; _type: "articleParagraph"; text: string }
          | { _key: string; _type: "articleImage"; image: SanityImage }
        >;
      }[];
    }
  | { _key: string; _type: "articlePrice"; table: SanityPriceTable }
  | {
      _key: string;
      _type: "articleFaq";
      heading: string;
      items: SanityFaqItem[];
    };

export type SanityPost = {
  _id: string;
  _type: "post";
  title: string;
  path: string;
  property: PropertySlug;
  date: string;
  order?: number;
  excerpt: string;
  image?: SanityImage;
  categories?: { _id: string; title: string; slug: string }[];
  blocks?: SanityArticleBlock[];
  seo?: SanitySeo;
};

export type SanityRoom = {
  _id: string;
  _type: "room";
  title: string;
  slug: string;
  property: PropertySlug;
  description: string;
  details?: SanityDetailRow[];
  amenities?: string[];
  facilities?: string[];
  hero?: SanityImage;
  gallery?: SanityImage[];
  order?: number;
  seo?: SanitySeo;
};

export type SanityExperience = {
  _id: string;
  _type: "experience";
  title: string;
  slug: string;
  group: "retreat" | "wellness" | "culture";
  eyebrow: string;
  paragraphs: string[];
  recommendedFor?: string[];
  note?: string;
  sections?: { heading: string; body: string[]; image?: SanityImage }[];
  blocks?: { heading: string; intro?: string; groups: SanityBulletGroup[] }[];
  programsHeading?: string;
  programs?: SanityExperienceProgram[];
  inclusions?: string[];
  price?: string;
  highlightsHeading?: string;
  highlights?: { icon?: SanityImage; title: string; body: string }[];
  closingCta?: string;
  teamHeading?: string;
  team?: { name: string; photo?: SanityImage; bio: string }[];
  faqHeading?: string;
  faq?: SanityFaqItem[];
  hero?: SanityImage;
  /** The thumbnail used when this retreat is listed on another one's page. */
  cardImage?: SanityImage;
  gallery?: SanityImage[];
  seo?: SanitySeo;
};

export type SanityPackageSet = {
  _id: string;
  _type: "packageSet";
  title: string;
  slug: string;
  property: PropertySlug;
  alwaysIncluded?: string[];
  packages: SanityPackageItem[];
};

export type SanityTestimonial = {
  _id: string;
  _type: "testimonial";
  quote: string;
  author: string;
  property: PropertySlug;
  order?: number;
};

export type SanityLegalSection =
  | { _key: string; _type: "legalParagraph"; heading: string; text: string }
  | { _key: string; _type: "legalList"; heading: string; items: string[] };

export type SanityLegalPage = {
  _id: string;
  _type: "legalPage";
  title: string;
  path: string;
  intro?: string;
  sections: SanityLegalSection[];
  seo?: SanitySeo;
};

export type SanityProperty = {
  _id: string;
  _type: "property";
  slug: PropertySlug;
  label: string;
  logo?: SanityImage;
  navItems?: {
    _key: string;
    label: string;
    href: string;
    inScope?: boolean;
    children?: {
      _key: string;
      label: string;
      href: string;
      inScope?: boolean;
      external?: boolean;
    }[];
  }[];
  addressLines?: string[];
  phones?: string[];
  email?: string;
  maps?: string;
  facebook?: string;
  instagram?: string;
  instagramApiUrl?: string;
  /** Ubud only — the Mahamaya Spa account's own feed endpoint. */
  spaInstagramApiUrl?: string;
  bookingHref?: string;
  bookingWidgetId?: string;
  offersHref?: string;
  blogPosts?: { _key: string; title: string; href: string }[];
  awardBadges?: SanityImage[];
  awardVariant?: "grid" | "marquee";
};

export type SanitySiteSettings = {
  _id: string;
  _type: "siteSettings";
  title?: string;
  description?: string;
  favicon?: SanityImage;
  bookNowLabel?: string;
  checkRatesLabel?: string;
  galleryHeading?: string;
  detailsHeading?: string;
  amenitiesHeading?: string;
  recommendedForHeading?: string;
  inclusionsHeading?: string;
  blogLabel?: string;
  relatedRetreatsHeading?: string;
  inquiryHeading?: string;
  followInstagramLabel?: string;
  dealHeadline?: string;
  dealCode?: string;
  dealButtonLabel?: string;
  homeLogo?: SanityImage;
  footerLogo?: SanityImage;
  footerBookingLabel?: string;
  footerMenuHeading?: string;
  footerMenuLinks?: SanityLink[];
  footerBlogHeading?: string;
  footerNote?: string;
  legalLinks?: SanityLink[];
  defaultSeo?: SanitySeo;
};
