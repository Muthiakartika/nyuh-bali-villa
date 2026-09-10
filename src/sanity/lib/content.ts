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
  const document = await sanityFetch<SanityProperty>(propertyBySlugQuery, {
    params: { slug },
    tags: ["sanity", "sanity:property", `sanity:property:${slug}`],
  });
  if (!document) return base;

  const logo = imageUrl(document.logo, 400);
  const badges = imageUrls(document.awardBadges, 400);

  return {
    ...base,
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
    instagramFeedUrl: document.instagramFeedUrl || base.instagramFeedUrl,
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
    description: item.description,
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
