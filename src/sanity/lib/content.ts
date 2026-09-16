/**
 * The one place the site asks "is this published in Sanity yet?".
 *
 * Every function here returns the existing `src/data` value when Sanity has
 * nothing to say — no project configured, no document published, or a fetch
 * that failed. That is what makes this safe to ship before a single document
 * exists: all 44 routes keep rendering exactly what they render today, and
 * each one switches over the moment its document is published.
 *
 * The conversions run in this direction (Sanity → the site's own types) on
 * purpose. The alternative — teaching every component a second shape — would
 * have meant touching every renderer instead of one module, and would leave
 * the components unable to render without a CMS.
 */
import type { PortableTextBlock } from "@portabletext/types";

import type { Experience } from "@/data/experiences";
import type { LegalSection } from "@/data/legal";
import type { Post, PostBlock } from "@/data/posts";
import type { PropertySite, PropertySlug } from "@/data/properties";
import type { RoomDetail } from "@/data/rooms";
import type { Testimonial } from "@/data/testimonials";
import type { PackageItem } from "@/components/property/PackageList";
import {
  instagramFeedWidget,
  instagramWidgetId,
  type InstagramFeedKey,
} from "@/components/property/instagramFeed";
import type { ArticleBlock } from "@/components/property/postBlocks";

import { EXPERIENCES } from "@/data/experiences";
import { PRIVACY_POLICY_SECTIONS, TERMS_CONDITIONS_SECTIONS } from "@/data/legal";
import { POSTS } from "@/data/posts";
import { PROPERTY_SITES } from "@/data/properties";
import { ROOM_DETAILS } from "@/data/rooms";
import { TESTIMONIALS } from "@/data/testimonials";

import { sanityFetch } from "@/sanity/lib/client";
import { resolveImageUrl, resolveImageUrls } from "@/sanity/lib/image";
import { toRuns } from "@/sanity/lib/richText";
import {
  allExperiencesQuery,
  allPackageSetsQuery,
  allPagePathsQuery,
  allPostPathsQuery,
  allPostsQuery,
  allRoomsQuery,
  allTestimonialsQuery,
  legalPageByPathQuery,
  pageByPathQuery,
  postByPathQuery,
  propertyBySlugQuery,
  siteSettingsQuery,
} from "@/sanity/lib/queries";
import type {
  SanityArticleBlock,
  SanityExperience,
  SanityImage,
  SanityLegalPage,
  SanityPackageItem,
  SanityPackageSet,
  SanityPage,
  SanityPost,
  SanityProperty,
  SanityRoom,
  SanitySeo,
  SanitySiteSettings,
  SanityTestimonial,
} from "@/sanity/types";

/**
 * GROQ returns `null` for a field a document does not set, but a JavaScript
 * default parameter only fires on `undefined`. Passing the null straight
 * through therefore defeats every component default — it is what made the
 * yoga page lose its "FAQ" heading, whose default lives in the renderer's
 * own signature. Optional values go through this on the way out.
 */
function orUndefined<T>(value: T | null | undefined): T | undefined {
  return value ?? undefined;
}

function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

/** Both delegate to lib/image.ts so the asset-or-hotlink rule lives in one place. */
function imageUrl(image: SanityImage | undefined, width = 1600): string | null {
  return resolveImageUrl(image, width);
}

function imageUrls(images: SanityImage[] | undefined, width = 1600): string[] {
  return resolveImageUrls(images, width);
}

// ── Pages ──────────────────────────────────────────────────────────────

export async function getSanityPage(path: string): Promise<SanityPage | null> {
  const normalized = normalizePath(path);
  const page = await sanityFetch<SanityPage>(pageByPathQuery, {
    params: { path: normalized },
    tags: ["sanity", "sanity:page", `sanity:page:${normalized}`],
  });

  if (!page?.sections?.length) return null;
  return page;
}

export async function getSanityPagePaths(): Promise<string[]> {
  const paths =
    (await sanityFetch<string[]>(allPagePathsQuery, {
      tags: ["sanity", "sanity:page"],
    })) ?? [];
  return paths.map(normalizePath);
}

// ── Site settings and properties ───────────────────────────────────────

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  return sanityFetch<SanitySiteSettings>(siteSettingsQuery, {
    tags: ["sanity", "sanity:siteSettings"],
  });
}

/**
 * A property's chrome, with Sanity overriding field by field.
 *
 * Field-level rather than document-level fallback because this document
 * carries thirty unrelated values — a half-filled property should not blank
 * the phone number in the footer of every page that property owns.
 */
export async function getPropertySite(slug: PropertySlug): Promise<PropertySite> {
  const base = PROPERTY_SITES[slug];
  // Site-wide, but carried on the property because the two components that
  // need it are Client Components — see `PropertySite.bookNowLabel`.
  const bookNowLabel = (await getSiteLabels()).bookNow;
  const document = await sanityFetch<SanityProperty>(propertyBySlugQuery, {
    params: { slug },
    tags: ["sanity", "sanity:property", `sanity:property:${slug}`],
  });
  if (!document) return { ...base, bookNowLabel };

  const logo = imageUrl(document.logo, 400);
  const badges = imageUrls(document.awardBadges, 400);

  return {
    ...base,
    bookNowLabel,
    label: document.label || base.label,
    logoSrc: logo || base.logoSrc,
    navItems: document.navItems?.length
      ? document.navItems.map((item) => ({
          label: item.label,
          href: item.href,
          inScope: item.inScope ?? true,
          children: item.children?.map((child) => ({
            label: child.label,
            href: child.href,
            inScope: child.inScope ?? true,
            external: child.external,
          })),
        }))
      : base.navItems,
    contact: {
      addressLines: document.addressLines?.length
        ? document.addressLines
        : base.contact.addressLines,
      phones: document.phones?.length ? document.phones : base.contact.phones,
      email: document.email || base.contact.email,
    },
    social: {
      maps: document.maps || base.social.maps,
      facebook: document.facebook || base.social.facebook,
      instagram: document.instagram || base.social.instagram,
    },
    bookingHref: document.bookingHref || base.bookingHref,
    bookingWidgetId: document.bookingWidgetId || base.bookingWidgetId,
    offersHref: document.offersHref || base.offersHref,
    blogPosts: document.blogPosts?.length
      ? document.blogPosts.map((item) => ({ title: item.title, href: item.href }))
      : base.blogPosts,
    awards: {
      variant: document.awardVariant || base.awards.variant,
      badges: badges.length ? badges : base.awards.badges,
    },
  };
}

/**
 * The Instagram feed endpoint for one account, as published in the Studio.
 *
 * Three feeds, not two: the two resorts run separate accounts, and Mahamaya
 * Spa (`/ubud/spa`) is a third, @mahamayaspa.ubud. The spa has no property
 * document of its own — it is an Ubud page wearing Ubud's chrome — so its
 * endpoint is a second field on Ubud's document.
 *
 * Kept out of `getPropertySite` because that returns the site's own
 * `PropertySite` type, which has no field for it — and because this is read
 * by an API route, not by a page.
 */
export async function getInstagramApiUrl(
  feed: InstagramFeedKey,
): Promise<string | undefined> {
  const slug: PropertySlug = feed === "seminyak" ? "seminyak" : "ubud";
  const document = await sanityFetch<SanityProperty>(propertyBySlugQuery, {
    params: { slug },
    tags: ["sanity", "sanity:property", `sanity:property:${slug}`],
  });
  const value =
    feed === "spa" ? document?.spaInstagramApiUrl : document?.instagramApiUrl;
  return orUndefined(value)?.trim() || undefined;
}

/**
 * The same setting, read as the feed app's workspace id instead of a URL —
 * which is what its own `<seoboost-feed widget="…">` embed takes.
 *
 * Same Studio field, same precedence (published value wins over the env), so
 * there is still exactly one place a workspace is chosen. See
 * `instagramWidgetId` for why one value can serve both forms.
 */
export async function getInstagramWidget(
  feed: InstagramFeedKey,
): Promise<string | undefined> {
  const published = instagramWidgetId(await getInstagramApiUrl(feed));
  return published ?? instagramFeedWidget(feed);
}

// ── Rooms ──────────────────────────────────────────────────────────────

/**
 * The site's own `RoomDetail`, plus the SEO fields only a Sanity document
 * has. Routes pass the whole thing to resolveDocumentMetadata; the
 * components ignore the extra key.
 */
export type ResolvedRoom = RoomDetail & { seo?: SanitySeo };

function toRoom(document: SanityRoom): ResolvedRoom {
  return {
    seo: orUndefined(document.seo),
    slug: document.slug,
    property: document.property,
    title: document.title,
    description: document.description,
    details: document.details ?? [],
    amenities: document.amenities ?? [],
    facilities: document.facilities ?? [],
    gallery: imageUrls(document.gallery),
    hero: imageUrl(document.hero) ?? "",
  };
}

export async function getRooms(property?: PropertySlug): Promise<ResolvedRoom[]> {
  const documents = await sanityFetch<SanityRoom[]>(allRoomsQuery, {
    tags: ["sanity", "sanity:room"],
  });
  const rooms: ResolvedRoom[] = documents?.length ? documents.map(toRoom) : ROOM_DETAILS;
  return property ? rooms.filter((room) => room.property === property) : rooms;
}

export async function getRoom(
  property: PropertySlug,
  slug: string,
): Promise<ResolvedRoom | null> {
  const rooms = await getRooms(property);
  return rooms.find((room) => room.slug === slug) ?? null;
}

// ── Experiences ────────────────────────────────────────────────────────

export type ResolvedExperience = Experience & { seo?: SanitySeo };

function toExperience(document: SanityExperience): ResolvedExperience {
  return {
    seo: orUndefined(document.seo),
    slug: document.slug,
    group: document.group,
    eyebrow: document.eyebrow,
    title: document.title,
    paragraphs: document.paragraphs ?? [],
    recommendedFor: document.recommendedFor?.length ? document.recommendedFor : undefined,
    note: orUndefined(document.note),
    sections: document.sections?.length
      ? document.sections.map((section) => ({
          heading: section.heading,
          body: section.body ?? [],
          image: imageUrl(section.image) ?? undefined,
        }))
      : undefined,
    highlights: document.highlights?.length
      ? {
          heading: document.highlightsHeading || "Why Choose Ubud Nyuh Bali Resort?",
          items: document.highlights.map((item) => ({
            icon: imageUrl(item.icon, 200) ?? "",
            title: item.title,
            body: item.body,
          })),
        }
      : undefined,
    blocks: document.blocks?.length ? document.blocks : undefined,
    programs: document.programs?.length
      ? {
          heading: document.programsHeading || "Available Programs",
          tiers: document.programs,
        }
      : undefined,
    inclusions: document.inclusions ?? [],
    price: orUndefined(document.price),
    faq: document.faq ?? [],
    faqHeading: orUndefined(document.faqHeading),
    closingCta: orUndefined(document.closingCta),
    team: document.team?.length
      ? {
          heading: document.teamHeading || "Meet our Team",
          members: document.team.map((member) => ({
            name: member.name,
            photo: imageUrl(member.photo, 800) ?? "",
            bio: member.bio,
          })),
        }
      : undefined,
    gallery: imageUrls(document.gallery),
    hero: imageUrl(document.hero) ?? "",
    cardImage: imageUrl(document.cardImage, 900) ?? undefined,
  };
}

export async function getExperiences(): Promise<ResolvedExperience[]> {
  const documents = await sanityFetch<SanityExperience[]>(allExperiencesQuery, {
    tags: ["sanity", "sanity:experience"],
  });
  return documents?.length ? documents.map(toExperience) : EXPERIENCES;
}

export async function getExperience(slug: string): Promise<ResolvedExperience | null> {
  const experiences = await getExperiences();
  return experiences.find((experience) => experience.slug === slug) ?? null;
}

// ── Posts ──────────────────────────────────────────────────────────────

/**
 * Sanity's article blocks are already the `ArticleBlock` shapes
 * `postBlocks.ts` renders, so this is a rename rather than a conversion —
 * and `toArticleBlocks`, which the renderer still runs, passes anything it
 * already recognises straight through untouched.
 */
export function toArticleBlocksFromSanity(
  blocks: SanityArticleBlock[] | undefined,
): ArticleBlock[] {
  return (blocks ?? []).flatMap((block): ArticleBlock[] => {
    switch (block._type) {
      case "articleHeading":
        return [{ kind: "heading", text: block.text }];
      case "articleParagraph":
        return [{ kind: "paragraph", text: block.text }];
      case "articleList":
        return [{ kind: "list", items: block.items ?? [] }];
      case "articleImage": {
        const src = imageUrl(block.image);
        return src ? [{ kind: "image", src }] : [];
      }
      case "articlePoints":
        return [
          {
            kind: "points",
            ordered: Boolean(block.ordered),
            items: (block.items ?? []).map((item, index) => ({
              marker: block.ordered ? String(index + 1) : null,
              label: item.label,
              body: (item.body ?? []).flatMap((child): PostBlock[] => {
                if (child._type === "articleParagraph") {
                  return [{ kind: "paragraph", text: child.text }];
                }
                const src = imageUrl(child.image);
                return src ? [{ kind: "image", src }] : [];
              }),
            })),
          },
        ];
      case "articlePrice":
        return [
          {
            kind: "price",
            columns: block.table?.columns ?? [],
            rows: (block.table?.rows ?? []).map((row) => row.cells ?? []),
          },
        ];
      case "articleFaq":
        return [
          {
            kind: "faq",
            heading: block.heading,
            items: (block.items ?? []).map((item) => ({
              question: item.question,
              answer: item.answer,
            })),
          },
        ];
      default:
        // An unknown block renders nothing rather than crashing the page.
        return [];
    }
  });
}

/**
 * The `Post` the site's own components take. `blocks` keeps the narrow
 * `PostBlock` type the source file declares; the richer article blocks a
 * Sanity post can carry travel alongside it in `articleBlocks`, which
 * `getPostArticleBlocks` hands to the renderer.
 */
export type ResolvedPost = Post & {
  articleBlocks?: ArticleBlock[];
  seo?: SanitySeo;
};

function toPost(document: SanityPost): ResolvedPost {
  const articleBlocks = toArticleBlocksFromSanity(document.blocks);
  return {
    seo: orUndefined(document.seo),
    path: document.path,
    property: document.property,
    title: document.title,
    date: document.date,
    excerpt: document.excerpt,
    image: imageUrl(document.image) ?? "",
    // Passed straight through rather than matched against POST_CATEGORIES: an
    // editor who adds or renames a category in the Studio should see it on the
    // card, and a local lookup would silently drop anything not in the file.
    categories: document.categories?.map((item) => ({
      slug: item.slug,
      title: item.title,
    })),
    // Only the four block kinds `PostBlock` declares can live here; points,
    // price and FAQ blocks travel in `articleBlocks` instead of being
    // flattened back into paragraphs.
    blocks: articleBlocks.filter(
      (block): block is PostBlock =>
        block.kind === "heading" ||
        block.kind === "paragraph" ||
        block.kind === "list" ||
        block.kind === "image",
    ),
    articleBlocks,
  };
}

export async function getPosts(property?: PropertySlug): Promise<ResolvedPost[]> {
  const documents = await sanityFetch<SanityPost[]>(allPostsQuery, {
    tags: ["sanity", "sanity:post"],
  });
  const posts: ResolvedPost[] = documents?.length ? documents.map(toPost) : POSTS;
  return property ? posts.filter((post) => post.property === property) : posts;
}

export async function getPostByPath(path: string): Promise<ResolvedPost | null> {
  const normalized = normalizePath(path);
  const document = await sanityFetch<SanityPost>(postByPathQuery, {
    params: { path: normalized },
    tags: ["sanity", "sanity:post", `sanity:post:${normalized}`],
  });
  if (document) return toPost(document);
  return POSTS.find((post) => post.path === normalized) ?? null;
}

export async function getPostPaths(): Promise<string[]> {
  const paths = await sanityFetch<string[]>(allPostPathsQuery, {
    tags: ["sanity", "sanity:post"],
  });
  return paths?.length ? paths.map(normalizePath) : POSTS.map((post) => post.path);
}

// ── Testimonials ───────────────────────────────────────────────────────

export async function getTestimonials(property: PropertySlug): Promise<Testimonial[]> {
  const documents = await sanityFetch<SanityTestimonial[]>(allTestimonialsQuery, {
    tags: ["sanity", "sanity:testimonial"],
  });
  const published = (documents ?? []).filter((item) => item.property === property);
  if (!published.length) return TESTIMONIALS[property];
  return published.map((item) => ({ quote: item.quote, author: item.author }));
}

// ── Packages ───────────────────────────────────────────────────────────

export function toPackageItems(
  packages: SanityPackageItem[] | undefined,
  alwaysIncluded: string[] = [],
): PackageItem[] {
  return (packages ?? []).map((item) => ({
    name: item.name,
    images: imageUrls(item.images),
    // Rich text since the CMS audit pass; `toRuns` accepts the string every
    // document held before the migration, so both shapes render.
    description: toRuns(item.description),
    benefitsHeading: item.benefitsHeading,
    benefits: [...(item.benefits ?? []), ...alwaysIncluded],
    meta: item.meta?.map((fact) => ({ label: fact.label, value: fact.value })),
    notes: item.notes,
    ctas: item.ctas?.map((cta) => ({
      label: cta.label,
      href: cta.href,
      external: cta.external,
      inScope: cta.inScope,
      variant: cta.variant,
    })),
  }));
}

/** Null means nothing is published under this name; the caller keeps its own list. */
export async function getPackageSet(slug: string): Promise<PackageItem[] | null> {
  const sets = await sanityFetch<SanityPackageSet[]>(allPackageSetsQuery, {
    tags: ["sanity", "sanity:packageSet"],
  });
  const set = sets?.find((item) => item.slug === slug);
  if (!set?.packages?.length) return null;
  return toPackageItems(set.packages, set.alwaysIncluded ?? []);
}

// ── Legal pages ────────────────────────────────────────────────────────

const LEGAL_FALLBACK: Record<string, LegalSection[]> = {
  "/terms-conditions": TERMS_CONDITIONS_SECTIONS,
  "/privacy-policy": PRIVACY_POLICY_SECTIONS,
};

export async function getLegalPage(
  path: string,
): Promise<{ sections: LegalSection[]; document: SanityLegalPage | null }> {
  const normalized = normalizePath(path);
  const document = await sanityFetch<SanityLegalPage>(legalPageByPathQuery, {
    params: { path: normalized },
    tags: ["sanity", "sanity:legalPage", `sanity:legalPage:${normalized}`],
  });

  if (!document?.sections?.length) {
    return { sections: LEGAL_FALLBACK[normalized] ?? [], document: null };
  }

  const sections = document.sections.map((section): LegalSection =>
    section._type === "legalList"
      ? { heading: section.heading, type: "list", items: section.items ?? [] }
      : { heading: section.heading, type: "paragraph", text: section.text },
  );

  return { sections, document };
}

/** Portable text to plain text, for the few places the site renders strings. */
export function portableTextToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .map((block) => {
      if (!block || typeof block !== "object" || !("children" in block)) return "";
      const children = (block as { children?: Array<{ text?: string }> }).children;
      return children?.map((child) => child.text || "").join("") || "";
    })
    .filter(Boolean)
    .join("\n\n");
}

// ── Footer and chrome copy ─────────────────────────────────────────────

/** Everything `PropertyFooter` renders that is not the property's own. */
export type FooterSettings = {
  logo: { src: string; alt: string };
  bookingLabel: string;
  menuHeading: string;
  menuLinks: { label: string; href: string; inScope: boolean; external?: boolean }[];
  blogHeading: string;
  note: string;
  legalLinks: { label: string; href: string; external?: boolean }[];
};

/** The wordmark the footer has always shipped, when nothing is published. */
const FOOTER_LOGO_SRC = "/uploads/2022/12/Logo-Nyuh-Bali.png";

/**
 * The footer's own wording, resolved once per render.
 *
 * Every one of these was a literal inside `PropertyFooter` — the column
 * headings, the five menu labels, the copyright line, both legal links — so a
 * client wanting "Villas" to read "Accommodation" needed a code change and a
 * deploy. `siteSettings` had fields for some of it already and **nothing read
 * them**, which is the worse failure: a document an editor can fill in and
 * watch the site ignore.
 *
 * Falls back field by field, like `getPropertySite`, and the menu falls back
 * to the property's own paths — those differ per resort (`offersHref`), which
 * is why an empty list is not the same as an empty menu.
 */
export async function getFooterSettings(site: PropertySite): Promise<FooterSettings> {
  const settings = await getSiteSettings();

  const defaultMenu = [
    { label: "about", href: `/${site.slug}`, inScope: true },
    { label: "villas", href: `/${site.slug}/villa`, inScope: true },
    { label: "offers", href: site.offersHref, inScope: true },
    { label: "Blog", href: `/${site.slug}/discover`, inScope: true },
    { label: "contact", href: `/${site.slug}/contact`, inScope: true },
  ];

  const defaultLegal = [
    { label: "Terms & Conditions", href: "/terms-conditions" },
    { label: "Privacy & Policy", href: "/privacy-policy" },
  ];

  return {
    logo: {
      src: imageUrl(settings?.footerLogo, 400) || FOOTER_LOGO_SRC,
      // The mark is decorative here — the link already announces where it
      // goes — so an empty alt is correct and is what the footer shipped.
      alt: "",
    },
    bookingLabel: settings?.footerBookingLabel || "Book Now",
    menuHeading: settings?.footerMenuHeading || "Nyuh Bali Villas",
    menuLinks: settings?.footerMenuLinks?.length
      ? settings.footerMenuLinks.map((item) => ({
          label: item.label,
          href: item.href,
          inScope: item.inScope ?? true,
          external: item.external,
        }))
      : defaultMenu,
    blogHeading: settings?.footerBlogHeading || "Our Blog",
    note: settings?.footerNote || "All Rights Reserved",
    legalLinks: settings?.legalLinks?.length
      ? settings.legalLinks.map((item) => ({
          label: item.label,
          href: item.href,
          external: item.external,
        }))
      : defaultLegal,
  };
}

/**
 * The wordmark over the landing page's photographs.
 *
 * The property pages take theirs from the property document, but the homepage
 * has no property — so this was the one image on the site with no CMS field
 * behind it at all, written into `HomeHeader` as a path. It is a different
 * artwork from the footer's: its tagline is cream, for the dark photography
 * it sits on.
 */
export async function getHomeLogo(): Promise<{ src: string; alt: string }> {
  const settings = await getSiteSettings();
  return {
    src: imageUrl(settings?.homeLogo, 400) || "/uploads/2023/04/logonyuhbali.webp",
    alt: settings?.homeLogo?.alt || settings?.title || "Nyuh Bali Villas",
  };
}

/** The homepage's vertical booking tab. Two short words, one per column. */
export async function getBookNowLabel(): Promise<string> {
  // The same field the header and the spa menu use, in capitals: this tab
  // stacks one letter per line, and lowercase letters stacked vertically are
  // barely readable. Uppercasing here rather than asking an editor to type
  // capitals means one label serves both places.
  const settings = await getSiteSettings();
  return (settings?.bookNowLabel?.trim() || "Book Now").toUpperCase();
}

/** The wording on the direct-booking bar docked to every page. */
export type DirectBookingDeal = {
  headline: string;
  code?: string;
  buttonLabel: string;
};

/**
 * The offer, its promo code and its button label.
 *
 * All three were literals inside `DirectBookingDeals` — on a bar that renders
 * on all 78 pages, carrying a discount percentage and a promo code. A client
 * running a different offer needed a developer, and the same code was already
 * an editable field on the About band (`aboutNarrativeSection.promoCode`), so
 * the two could drift apart with nothing to catch it.
 *
 * `code` distinguishes "not set" from "deliberately empty": an offer with no
 * promo code is a real thing to publish, and `?? ` rather than `||` is what
 * lets an editor clear the line rather than being given the default back.
 */
export async function getDirectBookingDeal(): Promise<DirectBookingDeal> {
  const settings = await getSiteSettings();
  return {
    headline: settings?.dealHeadline || "Direct Booking Deals 66% Off",
    code: settings?.dealCode ?? 'Code : "ilovenyuh"',
    buttonLabel: settings?.dealButtonLabel || "Book Now",
  };
}

/** The words the shared components set their buttons and sections in. */
export type SiteLabels = {
  bookNow: string;
  checkRates: string;
  gallery: string;
  details: string;
  amenities: string;
  recommendedFor: string;
  inclusions: string;
  blog: string;
  relatedRetreats: string;
  inquiry: string;
  followInstagram: string;
};

/**
 * One resolver for every label the room, experience and blog pages draw.
 *
 * Those 47 pages have no page-builder — their content comes from a `room`,
 * `experience`, `post` or `legalPage` document and their *section headings*
 * came from nowhere at all, written into `RoomDetail`, `ExperienceDetailBody`
 * and `PostPage`. A client asking for "Amenities & Facilities" in Indonesian
 * needed a developer.
 *
 * They belong to Site settings rather than to each document because they are
 * the same words on all 47: "Gallery" on ten separate room documents would be
 * ten copies of one decision, and the first one edited would disagree with
 * the other nine.
 *
 * Every default is the string its component shipped with, so an unset field
 * renders exactly what the site renders today.
 */
export async function getSiteLabels(): Promise<SiteLabels> {
  const s = await getSiteSettings();
  return {
    bookNow: s?.bookNowLabel?.trim() || "Book Now",
    checkRates: s?.checkRatesLabel?.trim() || "Check Rates",
    gallery: s?.galleryHeading?.trim() || "Gallery",
    details: s?.detailsHeading?.trim() || "Details",
    amenities: s?.amenitiesHeading?.trim() || "Amenities & Facilities",
    recommendedFor: s?.recommendedForHeading?.trim() || "Recommended for",
    inclusions: s?.inclusionsHeading?.trim() || "Inclusions",
    blog: s?.blogLabel?.trim() || "Our Blog",
    relatedRetreats:
      s?.relatedRetreatsHeading?.trim() || "Other Personalized Luxury Retreat",
    inquiry: s?.inquiryHeading?.trim() || "Inquiry",
    followInstagram: s?.followInstagramLabel?.trim() || "Follow on Instagram",
  };
}
